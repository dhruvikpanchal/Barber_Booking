import { relations } from "drizzle-orm";
import {
  boolean,
  doublePrecision,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";
import {
  appointmentStatusEnum,
  barberRequestStatusEnum,
  barberStatusEnum,
  cancelledByEnum,
  contactReplyStatusEnum,
  notificationTypeEnum,
  queueSourceEnum,
  roleEnum,
  serviceChangeStatusEnum,
  walkInStatusEnum,
} from "./enums";

function createId() {
  return crypto.randomUUID();
}

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
};

// ─── USER ───────────────────────────────────────────────────────────────────

export const users = pgTable("users", {
  id: text("id").primaryKey().$defaultFn(createId),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash"),
  role: roleEnum("role").notNull().default("CUSTOMER"),
  isActive: boolean("is_active").notNull().default(true),
  emailVerified: boolean("email_verified").notNull().default(false),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  fullName: text("full_name").notNull(),
  phone: text("phone"),
  photoUrl: text("photo_url"),
  address: text("address"),
  city: text("city"),
  passwordResetToken: text("password_reset_token"),
  passwordResetExpires: timestamp("password_reset_expires", {
    withTimezone: true,
    mode: "date",
  }),
  refreshTokenHash: text("refresh_token_hash"),
  refreshTokenExpires: timestamp("refresh_token_expires", {
    withTimezone: true,
    mode: "date",
  }),
  googleId: text("google_id").unique(),
  lastActiveAt: timestamp("last_active_at", { withTimezone: true, mode: "date" }),
  ...timestamps,
});

// ─── SHOP ───────────────────────────────────────────────────────────────────

export const shops = pgTable("shops", {
  id: text("id").primaryKey().$defaultFn(createId),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  city: text("city").notNull(),
  address: text("address"),
  imageUrl: text("image_url"),
  startingPrice: integer("starting_price").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  tags: jsonb("tags"),
  averageRating: doublePrecision("average_rating").notNull().default(0),
  reviewCount: integer("review_count").notNull().default(0),
  barberCount: integer("barber_count").notNull().default(0),
  openHoursSummary: text("open_hours_summary"),
  ...timestamps,
});

// ─── BARBER PROFILE ─────────────────────────────────────────────────────────

export const barberProfiles = pgTable("barber_profiles", {
  id: text("id").primaryKey().$defaultFn(createId),
  userId: text("user_id")
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: "cascade" }),
  shopId: text("shop_id").references(() => shops.id),
  slug: text("slug").notNull().unique(),
  displayRole: text("display_role").notNull(),
  bio: text("bio"),
  experience: integer("experience").notNull().default(0),
  portfolioUrl: text("portfolio_url"),
  availability: text("availability"),
  startingPrice: integer("starting_price").notNull().default(0),
  barberStatus: barberStatusEnum("barber_status").notNull().default("ACTIVE"),
  isAvailable: boolean("is_available").notNull().default(true),
  averageRating: doublePrecision("average_rating").notNull().default(0),
  reviewCount: integer("review_count").notNull().default(0),
  totalAppointments: integer("total_appointments").notNull().default(0),
  appointmentsThisMonth: integer("appointments_this_month").notNull().default(0),
  servicesCount: integer("services_count").notNull().default(0),
  joinedAt: timestamp("joined_at", { withTimezone: true, mode: "date" }).defaultNow().notNull(),
  ...timestamps,
});

export const barberSpecialties = pgTable("barber_specialties", {
  id: text("id").primaryKey().$defaultFn(createId),
  barberId: text("barber_id")
    .notNull()
    .references(() => barberProfiles.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
});

export const galleryImages = pgTable("gallery_images", {
  id: text("id").primaryKey().$defaultFn(createId),
  barberId: text("barber_id")
    .notNull()
    .references(() => barberProfiles.id, { onDelete: "cascade" }),
  src: text("src").notNull(),
  alt: text("alt"),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).defaultNow().notNull(),
});

export const workingHours = pgTable(
  "working_hours",
  {
    id: text("id").primaryKey().$defaultFn(createId),
    barberId: text("barber_id")
      .notNull()
      .references(() => barberProfiles.id, { onDelete: "cascade" }),
    day: integer("day").notNull(),
    openTime: text("open_time"),
    closeTime: text("close_time"),
    isClosed: boolean("is_closed").notNull().default(false),
  },
  (table) => [unique("working_hours_barber_id_day_unique").on(table.barberId, table.day)],
);

export const breakSlots = pgTable("break_slots", {
  id: text("id").primaryKey().$defaultFn(createId),
  barberId: text("barber_id")
    .notNull()
    .references(() => barberProfiles.id, { onDelete: "cascade" }),
  label: text("label").notNull(),
  start: text("start").notNull(),
  end: text("end").notNull(),
});

export const unavailableDates = pgTable(
  "unavailable_dates",
  {
    id: text("id").primaryKey().$defaultFn(createId),
    barberId: text("barber_id")
      .notNull()
      .references(() => barberProfiles.id, { onDelete: "cascade" }),
    date: text("date").notNull(),
  },
  (table) => [unique("unavailable_dates_barber_id_date_unique").on(table.barberId, table.date)],
);

// ─── SERVICE CATALOG ────────────────────────────────────────────────────────

export const services = pgTable("services", {
  id: text("id").primaryKey().$defaultFn(createId),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  description: text("description"),
  price: integer("price").notNull(),
  duration: integer("duration").notNull(),
  isPopular: boolean("is_popular").notNull().default(false),
  isActive: boolean("is_active").notNull().default(true),
  ...timestamps,
});

export const barberServices = pgTable(
  "barber_services",
  {
    id: text("id").primaryKey().$defaultFn(createId),
    barberId: text("barber_id")
      .notNull()
      .references(() => barberProfiles.id, { onDelete: "cascade" }),
    serviceId: text("service_id")
      .notNull()
      .references(() => services.id),
    priceOverride: integer("price_override"),
    isActive: boolean("is_active").notNull().default(true),
  },
  (table) => [
    unique("barber_services_barber_id_service_id_unique").on(table.barberId, table.serviceId),
  ],
);

// ─── APPOINTMENT ────────────────────────────────────────────────────────────

export const appointments = pgTable("appointments", {
  id: text("id").primaryKey().$defaultFn(createId),
  customerId: text("customer_id")
    .notNull()
    .references(() => users.id),
  barberId: text("barber_id")
    .notNull()
    .references(() => barberProfiles.id),
  status: appointmentStatusEnum("status").notNull().default("PENDING"),
  startAt: timestamp("start_at", { withTimezone: true, mode: "date" }).notNull(),
  estimatedPrice: integer("estimated_price").notNull(),
  finalPrice: integer("final_price"),
  notes: text("notes"),
  barberNotes: text("barber_notes"),
  cancelledBy: cancelledByEnum("cancelled_by"),
  cancelReason: text("cancel_reason"),
  cancelledAt: timestamp("cancelled_at", { withTimezone: true, mode: "date" }),
  bookedAt: timestamp("booked_at", { withTimezone: true, mode: "date" }).defaultNow().notNull(),
  confirmedAt: timestamp("confirmed_at", { withTimezone: true, mode: "date" }),
  arrivedAt: timestamp("arrived_at", { withTimezone: true, mode: "date" }),
  completedAt: timestamp("completed_at", { withTimezone: true, mode: "date" }),
  ...timestamps,
});

export const appointmentServices = pgTable("appointment_services", {
  id: text("id").primaryKey().$defaultFn(createId),
  appointmentId: text("appointment_id")
    .notNull()
    .references(() => appointments.id, { onDelete: "cascade" }),
  serviceId: text("service_id")
    .notNull()
    .references(() => services.id),
  name: text("name").notNull(),
  price: integer("price").notNull(),
  duration: integer("duration").notNull(),
});

export const appointmentOriginalServices = pgTable("appointment_original_services", {
  id: text("id").primaryKey().$defaultFn(createId),
  appointmentId: text("appointment_id")
    .notNull()
    .references(() => appointments.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  price: integer("price").notNull(),
  duration: integer("duration").notNull(),
});

export const appointmentModifications = pgTable("appointment_modifications", {
  id: text("id").primaryKey().$defaultFn(createId),
  appointmentId: text("appointment_id")
    .notNull()
    .references(() => appointments.id, { onDelete: "cascade" }),
  actor: text("actor").notNull(),
  field: text("field"),
  previousValue: text("previous_value"),
  updatedValue: text("updated_value"),
  summary: text("summary").notNull(),
  reason: text("reason"),
  at: timestamp("at", { withTimezone: true, mode: "date" }).defaultNow().notNull(),
});

export const appointmentActivity = pgTable("appointment_activity", {
  id: text("id").primaryKey().$defaultFn(createId),
  appointmentId: text("appointment_id")
    .notNull()
    .references(() => appointments.id, { onDelete: "cascade" }),
  message: text("message").notNull(),
  at: timestamp("at", { withTimezone: true, mode: "date" }).defaultNow().notNull(),
});

// ─── SERVICE CHANGE REQUEST ───────────────────────────────────────────────────

export const serviceChangeRequests = pgTable("service_change_requests", {
  id: text("id").primaryKey().$defaultFn(createId),
  appointmentId: text("appointment_id")
    .notNull()
    .references(() => appointments.id, { onDelete: "cascade" }),
  status: serviceChangeStatusEnum("status").notNull().default("PENDING"),
  customerNote: text("customer_note"),
  rejectionNote: text("rejection_note"),
  requestedAt: timestamp("requested_at", { withTimezone: true, mode: "date" })
    .defaultNow()
    .notNull(),
  resolvedAt: timestamp("resolved_at", { withTimezone: true, mode: "date" }),
});

export const serviceChangeItems = pgTable("service_change_items", {
  id: text("id").primaryKey().$defaultFn(createId),
  requestId: text("request_id")
    .notNull()
    .references(() => serviceChangeRequests.id, { onDelete: "cascade" }),
  serviceId: text("service_id").references(() => services.id),
  side: text("side").notNull(),
  name: text("name").notNull(),
  price: integer("price").notNull(),
  duration: integer("duration").notNull(),
});

// ─── WALK-IN ────────────────────────────────────────────────────────────────

export const walkIns = pgTable("walk_ins", {
  id: text("id").primaryKey().$defaultFn(createId),
  barberId: text("barber_id")
    .notNull()
    .references(() => barberProfiles.id),
  customerName: text("customer_name").notNull(),
  phone: text("phone"),
  notes: text("notes"),
  serviceName: text("service_name").notNull(),
  duration: integer("duration").notNull(),
  status: walkInStatusEnum("status").notNull().default("WAITING"),
  addedAt: timestamp("added_at", { withTimezone: true, mode: "date" }).defaultNow().notNull(),
  startedAt: timestamp("started_at", { withTimezone: true, mode: "date" }),
  completedAt: timestamp("completed_at", { withTimezone: true, mode: "date" }),
  cancelledAt: timestamp("cancelled_at", { withTimezone: true, mode: "date" }),
});

// ─── QUEUE ──────────────────────────────────────────────────────────────────

export const chairs = pgTable("chairs", {
  id: text("id").primaryKey().$defaultFn(createId),
  barberId: text("barber_id")
    .notNull()
    .references(() => barberProfiles.id, { onDelete: "cascade" }),
  label: text("label").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const queueEntries = pgTable("queue_entries", {
  id: text("id").primaryKey().$defaultFn(createId),
  barberId: text("barber_id")
    .notNull()
    .references(() => barberProfiles.id),
  appointmentId: text("appointment_id")
    .unique()
    .references(() => appointments.id),
  walkInId: text("walk_in_id").unique(),
  chairId: text("chair_id").references(() => chairs.id),
  source: queueSourceEnum("source").notNull(),
  customerName: text("customer_name").notNull(),
  phone: text("phone"),
  serviceName: text("service_name").notNull(),
  duration: integer("duration").notNull(),
  notes: text("notes"),
  status: walkInStatusEnum("status").notNull().default("WAITING"),
  position: integer("position").notNull().default(0),
  addedAt: timestamp("added_at", { withTimezone: true, mode: "date" }).defaultNow().notNull(),
  startedAt: timestamp("started_at", { withTimezone: true, mode: "date" }),
  completedAt: timestamp("completed_at", { withTimezone: true, mode: "date" }),
});

// ─── REVIEW ─────────────────────────────────────────────────────────────────

export const reviews = pgTable("reviews", {
  id: text("id").primaryKey().$defaultFn(createId),
  appointmentId: text("appointment_id")
    .notNull()
    .unique()
    .references(() => appointments.id),
  customerId: text("customer_id")
    .notNull()
    .references(() => users.id),
  barberId: text("barber_id")
    .notNull()
    .references(() => barberProfiles.id),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  barberReply: text("barber_reply"),
  barberRepliedAt: timestamp("barber_replied_at", { withTimezone: true, mode: "date" }),
  ...timestamps,
});

// ─── FAVORITES ──────────────────────────────────────────────────────────────

export const favoriteBarbers = pgTable(
  "favorite_barbers",
  {
    id: text("id").primaryKey().$defaultFn(createId),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    barberId: text("barber_id")
      .notNull()
      .references(() => barberProfiles.id, { onDelete: "cascade" }),
    savedAt: timestamp("saved_at", { withTimezone: true, mode: "date" }).defaultNow().notNull(),
    lastVisitedAt: timestamp("last_visited_at", { withTimezone: true, mode: "date" }),
    totalVisits: integer("total_visits").notNull().default(0),
    lastService: text("last_service"),
    yourRating: integer("your_rating"),
  },
  (table) => [unique("favorite_barbers_user_id_barber_id_unique").on(table.userId, table.barberId)],
);

export const favoriteShops = pgTable(
  "favorite_shops",
  {
    id: text("id").primaryKey().$defaultFn(createId),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    shopId: text("shop_id")
      .notNull()
      .references(() => shops.id, { onDelete: "cascade" }),
    savedAt: timestamp("saved_at", { withTimezone: true, mode: "date" }).defaultNow().notNull(),
    lastVisitedAt: timestamp("last_visited_at", { withTimezone: true, mode: "date" }),
    totalVisits: integer("total_visits").notNull().default(0),
  },
  (table) => [unique("favorite_shops_user_id_shop_id_unique").on(table.userId, table.shopId)],
);

// ─── BARBER REQUEST ─────────────────────────────────────────────────────────

export const barberRequests = pgTable("barber_requests", {
  id: text("id").primaryKey().$defaultFn(createId),
  barberId: text("barber_id")
    .unique()
    .references(() => barberProfiles.id),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  city: text("city"),
  profilePhotoUrl: text("profile_photo_url"),
  shopName: text("shop_name"),
  bio: text("bio"),
  experience: text("experience").notNull(),
  availability: text("availability"),
  specialties: jsonb("specialties"),
  portfolioUrl: text("portfolio_url"),
  status: barberRequestStatusEnum("status").notNull().default("PENDING"),
  rejectionNote: text("rejection_note"),
  submittedAt: timestamp("submitted_at", { withTimezone: true, mode: "date" })
    .defaultNow()
    .notNull(),
  reviewedAt: timestamp("reviewed_at", { withTimezone: true, mode: "date" }),
});

export const requestDocuments = pgTable("request_documents", {
  id: text("id").primaryKey().$defaultFn(createId),
  requestId: text("request_id")
    .notNull()
    .references(() => barberRequests.id, { onDelete: "cascade" }),
  label: text("label").notNull(),
  fileName: text("file_name").notNull(),
  fileUrl: text("file_url"),
  uploadedAt: timestamp("uploaded_at", { withTimezone: true, mode: "date" }).defaultNow().notNull(),
});

// ─── NOTIFICATION ───────────────────────────────────────────────────────────

export const notifications = pgTable("notifications", {
  id: text("id").primaryKey().$defaultFn(createId),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  type: notificationTypeEnum("type").notNull(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  isRead: boolean("is_read").notNull().default(false),
  appointmentId: text("appointment_id").references(() => appointments.id),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).defaultNow().notNull(),
});

// ─── CONTACT MESSAGE ────────────────────────────────────────────────────────

export const contactMessages = pgTable("contact_messages", {
  id: text("id").primaryKey().$defaultFn(createId),
  userId: text("user_id").references(() => users.id),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  isRead: boolean("is_read").notNull().default(false),
  replyStatus: contactReplyStatusEnum("reply_status").notNull().default("UNREPLIED"),
  replyText: text("reply_text"),
  repliedAt: timestamp("replied_at", { withTimezone: true, mode: "date" }),
  internalNote: text("internal_note"),
  assignedTo: text("assigned_to"),
  submittedAt: timestamp("submitted_at", { withTimezone: true, mode: "date" })
    .defaultNow()
    .notNull(),
});

// ─── RELATIONS ──────────────────────────────────────────────────────────────

export const usersRelations = relations(users, ({ one, many }) => ({
  barberProfile: one(barberProfiles),
  appointments: many(appointments),
  reviews: many(reviews),
  notifications: many(notifications),
  favorites: many(favoriteBarbers),
  favoriteShops: many(favoriteShops),
  contactMessages: many(contactMessages),
}));

export const shopsRelations = relations(shops, ({ many }) => ({
  barbers: many(barberProfiles),
  favoritedBy: many(favoriteShops),
}));

export const barberProfilesRelations = relations(barberProfiles, ({ one, many }) => ({
  user: one(users, { fields: [barberProfiles.userId], references: [users.id] }),
  shop: one(shops, { fields: [barberProfiles.shopId], references: [shops.id] }),
  services: many(barberServices),
  workingHours: many(workingHours),
  breakSlots: many(breakSlots),
  unavailableDates: many(unavailableDates),
  galleryImages: many(galleryImages),
  specialties: many(barberSpecialties),
  appointments: many(appointments),
  reviews: many(reviews),
  walkIns: many(walkIns),
  queueEntries: many(queueEntries),
  chairs: many(chairs),
  barberRequest: one(barberRequests),
  favoritedBy: many(favoriteBarbers),
}));

export const barberSpecialtiesRelations = relations(barberSpecialties, ({ one }) => ({
  barber: one(barberProfiles, {
    fields: [barberSpecialties.barberId],
    references: [barberProfiles.id],
  }),
}));

export const galleryImagesRelations = relations(galleryImages, ({ one }) => ({
  barber: one(barberProfiles, {
    fields: [galleryImages.barberId],
    references: [barberProfiles.id],
  }),
}));

export const workingHoursRelations = relations(workingHours, ({ one }) => ({
  barber: one(barberProfiles, {
    fields: [workingHours.barberId],
    references: [barberProfiles.id],
  }),
}));

export const breakSlotsRelations = relations(breakSlots, ({ one }) => ({
  barber: one(barberProfiles, {
    fields: [breakSlots.barberId],
    references: [barberProfiles.id],
  }),
}));

export const unavailableDatesRelations = relations(unavailableDates, ({ one }) => ({
  barber: one(barberProfiles, {
    fields: [unavailableDates.barberId],
    references: [barberProfiles.id],
  }),
}));

export const servicesRelations = relations(services, ({ many }) => ({
  barberServices: many(barberServices),
  appointmentServices: many(appointmentServices),
  changeItems: many(serviceChangeItems),
}));

export const barberServicesRelations = relations(barberServices, ({ one }) => ({
  barber: one(barberProfiles, {
    fields: [barberServices.barberId],
    references: [barberProfiles.id],
  }),
  service: one(services, {
    fields: [barberServices.serviceId],
    references: [services.id],
  }),
}));

export const appointmentsRelations = relations(appointments, ({ one, many }) => ({
  customer: one(users, { fields: [appointments.customerId], references: [users.id] }),
  barber: one(barberProfiles, {
    fields: [appointments.barberId],
    references: [barberProfiles.id],
  }),
  services: many(appointmentServices),
  originalServices: many(appointmentOriginalServices),
  serviceChangeRequests: many(serviceChangeRequests),
  modificationHistory: many(appointmentModifications),
  activityLog: many(appointmentActivity),
  review: one(reviews),
  notifications: many(notifications),
  queueEntry: one(queueEntries),
}));

export const appointmentServicesRelations = relations(appointmentServices, ({ one }) => ({
  appointment: one(appointments, {
    fields: [appointmentServices.appointmentId],
    references: [appointments.id],
  }),
  service: one(services, {
    fields: [appointmentServices.serviceId],
    references: [services.id],
  }),
}));

export const appointmentOriginalServicesRelations = relations(
  appointmentOriginalServices,
  ({ one }) => ({
    appointment: one(appointments, {
      fields: [appointmentOriginalServices.appointmentId],
      references: [appointments.id],
    }),
  }),
);

export const appointmentModificationsRelations = relations(appointmentModifications, ({ one }) => ({
  appointment: one(appointments, {
    fields: [appointmentModifications.appointmentId],
    references: [appointments.id],
  }),
}));

export const appointmentActivityRelations = relations(appointmentActivity, ({ one }) => ({
  appointment: one(appointments, {
    fields: [appointmentActivity.appointmentId],
    references: [appointments.id],
  }),
}));

export const serviceChangeRequestsRelations = relations(serviceChangeRequests, ({ one, many }) => ({
  appointment: one(appointments, {
    fields: [serviceChangeRequests.appointmentId],
    references: [appointments.id],
  }),
  items: many(serviceChangeItems),
}));

export const serviceChangeItemsRelations = relations(serviceChangeItems, ({ one }) => ({
  request: one(serviceChangeRequests, {
    fields: [serviceChangeItems.requestId],
    references: [serviceChangeRequests.id],
  }),
  service: one(services, {
    fields: [serviceChangeItems.serviceId],
    references: [services.id],
  }),
}));

export const walkInsRelations = relations(walkIns, ({ one }) => ({
  barber: one(barberProfiles, {
    fields: [walkIns.barberId],
    references: [barberProfiles.id],
  }),
}));

export const chairsRelations = relations(chairs, ({ one, many }) => ({
  barber: one(barberProfiles, {
    fields: [chairs.barberId],
    references: [barberProfiles.id],
  }),
  queueEntries: many(queueEntries),
}));

export const queueEntriesRelations = relations(queueEntries, ({ one }) => ({
  barber: one(barberProfiles, {
    fields: [queueEntries.barberId],
    references: [barberProfiles.id],
  }),
  appointment: one(appointments, {
    fields: [queueEntries.appointmentId],
    references: [appointments.id],
  }),
  chair: one(chairs, { fields: [queueEntries.chairId], references: [chairs.id] }),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  appointment: one(appointments, {
    fields: [reviews.appointmentId],
    references: [appointments.id],
  }),
  customer: one(users, { fields: [reviews.customerId], references: [users.id] }),
  barber: one(barberProfiles, {
    fields: [reviews.barberId],
    references: [barberProfiles.id],
  }),
}));

export const favoriteBarbersRelations = relations(favoriteBarbers, ({ one }) => ({
  user: one(users, { fields: [favoriteBarbers.userId], references: [users.id] }),
  barber: one(barberProfiles, {
    fields: [favoriteBarbers.barberId],
    references: [barberProfiles.id],
  }),
}));

export const favoriteShopsRelations = relations(favoriteShops, ({ one }) => ({
  user: one(users, { fields: [favoriteShops.userId], references: [users.id] }),
  shop: one(shops, { fields: [favoriteShops.shopId], references: [shops.id] }),
}));

export const barberRequestsRelations = relations(barberRequests, ({ one, many }) => ({
  barber: one(barberProfiles, {
    fields: [barberRequests.barberId],
    references: [barberProfiles.id],
  }),
  documents: many(requestDocuments),
}));

export const requestDocumentsRelations = relations(requestDocuments, ({ one }) => ({
  request: one(barberRequests, {
    fields: [requestDocuments.requestId],
    references: [barberRequests.id],
  }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, { fields: [notifications.userId], references: [users.id] }),
  appointment: one(appointments, {
    fields: [notifications.appointmentId],
    references: [appointments.id],
  }),
}));

export const contactMessagesRelations = relations(contactMessages, ({ one }) => ({
  user: one(users, { fields: [contactMessages.userId], references: [users.id] }),
}));

// ─── SCHEMA EXPORT ──────────────────────────────────────────────────────────

export const schema = {
  users,
  shops,
  barberProfiles,
  barberSpecialties,
  galleryImages,
  workingHours,
  breakSlots,
  unavailableDates,
  services,
  barberServices,
  appointments,
  appointmentServices,
  appointmentOriginalServices,
  appointmentModifications,
  appointmentActivity,
  serviceChangeRequests,
  serviceChangeItems,
  walkIns,
  chairs,
  queueEntries,
  reviews,
  favoriteBarbers,
  favoriteShops,
  barberRequests,
  requestDocuments,
  notifications,
  contactMessages,
};

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type BarberProfile = typeof barberProfiles.$inferSelect;
export type Appointment = typeof appointments.$inferSelect;
export type Service = typeof services.$inferSelect;
