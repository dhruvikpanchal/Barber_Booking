import { and, asc, count, desc, eq, gte, inArray, isNotNull, or } from "drizzle-orm";
import {
  barberProfiles,
  barberServices,
  barberSpecialties,
  contactMessages,
  db,
  galleryImages,
  reviews,
  services,
  shops,
  users,
  workingHours,
} from "@/server/db";
import type {
  BarbersListQuery,
  ServicesListQuery,
  ShopsListQuery,
} from "@/server/modules/public/schema";
import { contains } from "@/server/db/helpers";

const barberListWith = {
  user: { columns: { fullName: true, photoUrl: true, city: true } },
  shop: { columns: { name: true, city: true } },
  specialties: { columns: { name: true } },
  services: {
    where: eq(barberServices.isActive, true),
    with: {
      service: { columns: { slug: true, name: true, isActive: true } },
    },
  },
} as const;

const barberDetailWith = {
  user: { columns: { fullName: true, photoUrl: true, city: true } },
  shop: { columns: { name: true, city: true, address: true } },
  specialties: { columns: { name: true } },
  services: {
    where: eq(barberServices.isActive, true),
    with: {
      service: {
        columns: {
          slug: true,
          name: true,
          description: true,
          price: true,
          duration: true,
          isActive: true,
        },
      },
    },
  },
  workingHours: true as const,
  galleryImages: true as const,
  reviews: {
    limit: 20,
    with: {
      customer: { columns: { fullName: true } },
      appointment: {
        with: {
          services: { limit: 1 },
        },
      },
    },
  },
} as const;

function normalizeBarberDetail<
  T extends {
    workingHours: { day: number }[];
    galleryImages: { sortOrder: number }[];
    reviews: { createdAt: Date }[];
  },
>(row: T): T {
  return {
    ...row,
    workingHours: [...row.workingHours].sort((a, b) => a.day - b.day),
    galleryImages: [...row.galleryImages].sort((a, b) => a.sortOrder - b.sortOrder),
    reviews: [...row.reviews].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()),
  } as T;
}

function activeBarberWhere() {
  return and(
    eq(barberProfiles.barberStatus, "ACTIVE"),
    inArray(
      barberProfiles.userId,
      db.select({ id: users.id }).from(users).where(eq(users.isActive, true)),
    ),
  );
}

function activeBarberIdsSubquery() {
  return db
    .select({ id: barberProfiles.id })
    .from(barberProfiles)
    .innerJoin(users, eq(barberProfiles.userId, users.id))
    .where(and(eq(barberProfiles.barberStatus, "ACTIVE"), eq(users.isActive, true)));
}

function barberHasServiceCondition(serviceSlug: string) {
  return inArray(
    barberProfiles.id,
    db
      .select({ id: barberServices.barberId })
      .from(barberServices)
      .innerJoin(services, eq(barberServices.serviceId, services.id))
      .where(
        and(
          eq(barberServices.isActive, true),
          eq(services.slug, serviceSlug),
          eq(services.isActive, true),
        ),
      ),
  );
}

function barberTextSearchCondition(q: string) {
  return or(
    inArray(
      barberProfiles.userId,
      db.select({ id: users.id }).from(users).where(contains(users.fullName, q)),
    ),
    contains(barberProfiles.displayRole, q),
    inArray(
      barberProfiles.shopId,
      db
        .select({ id: shops.id })
        .from(shops)
        .where(or(contains(shops.name, q), contains(shops.city, q))),
    ),
    inArray(
      barberProfiles.id,
      db
        .select({ id: barberSpecialties.barberId })
        .from(barberSpecialties)
        .where(contains(barberSpecialties.name, q)),
    ),
    inArray(
      barberProfiles.id,
      db
        .select({ id: barberServices.barberId })
        .from(barberServices)
        .innerJoin(services, eq(barberServices.serviceId, services.id))
        .where(contains(services.name, q)),
    ),
  );
}

function buildBarberWhere(query: Pick<BarbersListQuery, "q" | "city" | "service" | "available">) {
  const conditions = [activeBarberWhere()];

  if (query.available === true) conditions.push(eq(barberProfiles.isAvailable, true));
  if (query.available === false) conditions.push(eq(barberProfiles.isAvailable, false));

  if (query.city) {
    conditions.push(
      or(
        inArray(
          barberProfiles.shopId,
          db.select({ id: shops.id }).from(shops).where(contains(shops.city, query.city)),
        ),
        inArray(
          barberProfiles.userId,
          db.select({ id: users.id }).from(users).where(contains(users.city, query.city)),
        ),
      ),
    );
  }

  if (query.service) {
    conditions.push(barberHasServiceCondition(query.service));
  }

  if (query.q) {
    conditions.push(barberTextSearchCondition(query.q));
  }

  return and(...conditions);
}

function barberOrderBy(sort: BarbersListQuery["sort"]) {
  if (sort === "price") return [asc(barberProfiles.startingPrice)];
  if (sort === "reviews") return [desc(barberProfiles.reviewCount)];
  return [desc(barberProfiles.averageRating)];
}

async function countBarberProfiles(
  where: ReturnType<typeof buildBarberWhere> | ReturnType<typeof activeBarberWhere>,
) {
  const [row] = await db.select({ count: count() }).from(barberProfiles).where(where);
  return row?.count ?? 0;
}

async function countServices(where: ReturnType<typeof and>) {
  const [row] = await db.select({ count: count() }).from(services).where(where);
  return row?.count ?? 0;
}

async function countShops(where: ReturnType<typeof eq>) {
  const [row] = await db.select({ count: count() }).from(shops).where(where);
  return row?.count ?? 0;
}

export const publicRepository = {
  findBarbers(query: BarbersListQuery) {
    const where = buildBarberWhere(query);
    const offset = (query.page - 1) * query.limit;

    return Promise.all([
      db.query.barberProfiles.findMany({
        where,
        with: barberListWith,
        orderBy: barberOrderBy(query.sort),
        offset,
        limit: query.limit,
      }),
      countBarberProfiles(where),
    ]);
  },

  findBarberBySlug(slug: string) {
    return db.query.barberProfiles
      .findFirst({
        where: and(eq(barberProfiles.slug, slug), activeBarberWhere()),
        with: barberDetailWith,
      })
      .then((row) => (row ? normalizeBarberDetail(row) : undefined));
  },

  findServices(query: ServicesListQuery) {
    const conditions = [eq(services.isActive, true)];
    if (query.popular === true) conditions.push(eq(services.isPopular, true));
    if (query.popular === false) conditions.push(eq(services.isPopular, false));
    const where = and(...conditions);
    const offset = (query.page - 1) * query.limit;

    return Promise.all([
      db.query.services.findMany({
        where,
        orderBy: [desc(services.isPopular), asc(services.name)],
        offset,
        limit: query.limit,
      }),
      countServices(where),
    ]);
  },

  findServiceBySlug(slug: string) {
    return db.query.services.findFirst({
      where: and(eq(services.slug, slug), eq(services.isActive, true)),
    });
  },

  findShops(query: ShopsListQuery) {
    const where = eq(shops.isActive, true);
    const offset = (query.page - 1) * query.limit;

    return Promise.all([
      db.query.shops.findMany({
        where,
        orderBy: [desc(shops.averageRating)],
        offset,
        limit: query.limit,
      }),
      countShops(where),
    ]);
  },

  findFeaturedShops(limit: number) {
    return db.query.shops.findMany({
      where: eq(shops.isActive, true),
      orderBy: [desc(shops.averageRating)],
      limit,
    });
  },

  findFeaturedBarbers(limit: number) {
    return db.query.barberProfiles.findMany({
      where: activeBarberWhere(),
      with: barberListWith,
      orderBy: [desc(barberProfiles.averageRating)],
      limit,
    });
  },

  findFeaturedServices(limit: number) {
    return db.query.services.findMany({
      where: eq(services.isActive, true),
      orderBy: [desc(services.isPopular), asc(services.name)],
      limit,
    });
  },

  findTestimonials(limit: number) {
    return db.query.reviews.findMany({
      where: and(
        gte(reviews.rating, 4),
        isNotNull(reviews.comment),
        inArray(reviews.barberId, activeBarberIdsSubquery()),
      ),
      orderBy: [desc(reviews.createdAt)],
      limit,
      with: { customer: { columns: { fullName: true } } },
    });
  },

  searchPublic(q: string, location: string, limit: number) {
    const barberWhere = buildBarberWhere({
      q: q || undefined,
      city: location || undefined,
      available: undefined,
    });

    const serviceConditions = [eq(services.isActive, true)];
    if (q) {
      serviceConditions.push(or(contains(services.name, q), contains(services.description, q))!);
    }
    const serviceWhere = and(...serviceConditions);

    const shopConditions = [eq(shops.isActive, true)];
    if (q || location) {
      const shopOrConditions = [
        ...(q ? [contains(shops.name, q), contains(shops.city, q)] : []),
        ...(location ? [contains(shops.city, location)] : []),
      ];
      shopConditions.push(or(...shopOrConditions)!);
    }
    const shopWhere = and(...shopConditions);

    return Promise.all([
      db.query.barberProfiles.findMany({
        where: barberWhere,
        with: barberListWith,
        orderBy: [desc(barberProfiles.averageRating)],
        limit,
      }),
      db.query.services.findMany({
        where: serviceWhere,
        orderBy: [asc(services.name)],
        limit,
      }),
      db.query.shops.findMany({
        where: shopWhere,
        orderBy: [desc(shops.averageRating)],
        limit,
      }),
    ]);
  },

  async createContactMessage(data: {
    name: string;
    email: string;
    subject: string;
    message: string;
    userId?: string | null;
  }) {
    const [message] = await db
      .insert(contactMessages)
      .values({
        name: data.name,
        email: data.email,
        subject: data.subject,
        message: data.message,
        userId: data.userId ?? null,
      })
      .returning();
    return message!;
  },
};
