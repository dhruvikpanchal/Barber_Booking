import { PUBLIC_CONTACT_INFO, CONTACT_SUBJECTS } from "@/server/modules/public/constants";
import {
  buildPaginationMeta,
  toBarberDetail,
  toBarberListItem,
  toServiceDetail,
  toServiceListItem,
  toShopListItem,
  toTestimonial,
} from "@/server/modules/public/mapper";
import { publicRepository } from "@/server/modules/public/repository";
import type {
  BarbersListQuery,
  ContactMessageInput,
  SearchQuery,
  ServicesListQuery,
  ShopsListQuery,
  TestimonialsQuery,
} from "@/server/modules/public/schema";
import { NotFoundError } from "@/server/modules/shared/helpers/AppError";

export const publicService = {
  async getHome() {
    const [shops, barbers, services, testimonials] = await Promise.all([
      publicRepository.findFeaturedShops(4),
      publicRepository.findFeaturedBarbers(8),
      publicRepository.findFeaturedServices(6),
      publicRepository.findTestimonials(3),
    ]);

    return {
      shops: shops.map(toShopListItem),
      barbers: barbers.map(toBarberListItem),
      services: services.map(toServiceListItem),
      testimonials: testimonials.map(toTestimonial),
    };
  },

  async listBarbers(query: BarbersListQuery) {
    const [rows, total] = await publicRepository.findBarbers(query);
    return {
      items: rows.map(toBarberListItem),
      meta: buildPaginationMeta(total, query.page, query.limit),
    };
  },

  async getBarberBySlug(slug: string) {
    const row = await publicRepository.findBarberBySlug(slug);
    if (!row) throw new NotFoundError("Barber");
    return toBarberDetail(row);
  },

  async listServices(query: ServicesListQuery) {
    const [rows, total] = await publicRepository.findServices(query);
    let items = rows.map(toServiceListItem);
    if (query.category) {
      const cat = query.category.toLowerCase();
      items = items.filter((s: { category: string }) => s.category.toLowerCase() === cat);
    }
    return {
      items,
      meta: buildPaginationMeta(total, query.page, query.limit),
    };
  },

  async getServiceBySlug(slug: string) {
    const row = await publicRepository.findServiceBySlug(slug);
    if (!row) throw new NotFoundError("Service");
    return toServiceDetail(row);
  },

  async listShops(query: ShopsListQuery) {
    const [rows, total] = await publicRepository.findShops(query);
    return {
      items: rows.map(toShopListItem),
      meta: buildPaginationMeta(total, query.page, query.limit),
    };
  },

  async getTestimonials(query: TestimonialsQuery) {
    const rows = await publicRepository.findTestimonials(query.limit);
    return rows.map(toTestimonial);
  },

  async search(query: SearchQuery) {
    const [barbers, services, shops] = await publicRepository.searchPublic(
      query.q,
      query.location,
      query.limit,
    );

    return {
      barbers: barbers.map(toBarberListItem),
      services: services.map(toServiceListItem),
      shops: shops.map(toShopListItem),
    };
  },

  getContactInfo() {
    return {
      subjects: [...CONTACT_SUBJECTS],
      info: PUBLIC_CONTACT_INFO,
    };
  },

  async submitContact(input: ContactMessageInput, userId?: string | null) {
    const message = await publicRepository.createContactMessage({
      ...input,
      userId: userId ?? null,
    });

    return {
      id: message.id,
      message: "Your message has been received. Our team will reply within one business day.",
    };
  },
};
