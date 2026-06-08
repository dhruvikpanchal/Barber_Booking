CREATE TYPE "public"."role" AS ENUM('ADMIN', 'BARBER', 'CUSTOMER');
--> statement-breakpoint
CREATE TYPE "public"."appointment_status" AS ENUM('PENDING', 'CONFIRMED', 'IN_SERVICE', 'COMPLETED', 'CANCELLED', 'NO_SHOW');
--> statement-breakpoint
CREATE TYPE "public"."cancelled_by" AS ENUM('CUSTOMER', 'BARBER', 'ADMIN', 'SYSTEM');
--> statement-breakpoint
CREATE TYPE "public"."service_change_status" AS ENUM('PENDING', 'ACCEPTED', 'REJECTED');
--> statement-breakpoint
CREATE TYPE "public"."barber_request_status" AS ENUM('PENDING', 'APPROVED', 'REJECTED');
--> statement-breakpoint
CREATE TYPE "public"."walk_in_status" AS ENUM('WAITING', 'IN_SERVICE', 'DONE', 'CANCELLED');
--> statement-breakpoint
CREATE TYPE "public"."queue_source" AS ENUM('ONLINE', 'WALK_IN');
--> statement-breakpoint
CREATE TYPE "public"."barber_status" AS ENUM('ACTIVE', 'INACTIVE', 'DISABLED');
--> statement-breakpoint
CREATE TYPE "public"."notification_type" AS ENUM('BOOKING_CONFIRMED', 'BOOKING_CANCELLED', 'BOOKING_REMINDER', 'SERVICE_CHANGE_ACCEPTED', 'SERVICE_CHANGE_REJECTED', 'REVIEW_REQUEST', 'PROMOTION', 'NEW_BOOKING_REQUEST', 'BOOKING_MODIFICATION_REQUEST', 'SERVICE_CHANGE_REQUESTED', 'BOOKING_CANCELLED_BY_CUSTOMER', 'BARBER_REQUEST_SUBMITTED', 'BARBER_REQUEST_APPROVED', 'BARBER_REQUEST_REJECTED', 'NEW_CONTACT_MESSAGE');
--> statement-breakpoint
CREATE TYPE "public"."contact_reply_status" AS ENUM('UNREPLIED', 'REPLIED');
--> statement-breakpoint
CREATE TABLE "appointment_activity" (
	"id" text PRIMARY KEY NOT NULL,
	"appointment_id" text NOT NULL,
	"message" text NOT NULL,
	"at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "appointment_modifications" (
	"id" text PRIMARY KEY NOT NULL,
	"appointment_id" text NOT NULL,
	"actor" text NOT NULL,
	"field" text,
	"previous_value" text,
	"updated_value" text,
	"summary" text NOT NULL,
	"reason" text,
	"at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "appointment_original_services" (
	"id" text PRIMARY KEY NOT NULL,
	"appointment_id" text NOT NULL,
	"name" text NOT NULL,
	"price" integer NOT NULL,
	"duration" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "appointment_services" (
	"id" text PRIMARY KEY NOT NULL,
	"appointment_id" text NOT NULL,
	"service_id" text NOT NULL,
	"name" text NOT NULL,
	"price" integer NOT NULL,
	"duration" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "appointments" (
	"id" text PRIMARY KEY NOT NULL,
	"customer_id" text NOT NULL,
	"barber_id" text NOT NULL,
	"status" "appointment_status" DEFAULT 'PENDING' NOT NULL,
	"start_at" timestamp with time zone NOT NULL,
	"estimated_price" integer NOT NULL,
	"final_price" integer,
	"notes" text,
	"barber_notes" text,
	"cancelled_by" "cancelled_by",
	"cancel_reason" text,
	"cancelled_at" timestamp with time zone,
	"booked_at" timestamp with time zone DEFAULT now() NOT NULL,
	"confirmed_at" timestamp with time zone,
	"arrived_at" timestamp with time zone,
	"completed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "barber_profiles" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"shop_id" text,
	"slug" text NOT NULL,
	"display_role" text NOT NULL,
	"bio" text,
	"experience" integer DEFAULT 0 NOT NULL,
	"portfolio_url" text,
	"availability" text,
	"starting_price" integer DEFAULT 0 NOT NULL,
	"barber_status" "barber_status" DEFAULT 'ACTIVE' NOT NULL,
	"is_available" boolean DEFAULT true NOT NULL,
	"average_rating" double precision DEFAULT 0 NOT NULL,
	"review_count" integer DEFAULT 0 NOT NULL,
	"total_appointments" integer DEFAULT 0 NOT NULL,
	"appointments_this_month" integer DEFAULT 0 NOT NULL,
	"services_count" integer DEFAULT 0 NOT NULL,
	"joined_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "barber_profiles_user_id_unique" UNIQUE("user_id"),
	CONSTRAINT "barber_profiles_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "barber_requests" (
	"id" text PRIMARY KEY NOT NULL,
	"barber_id" text,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"city" text,
	"profile_photo_url" text,
	"shop_name" text,
	"bio" text,
	"experience" text NOT NULL,
	"availability" text,
	"specialties" jsonb,
	"portfolio_url" text,
	"status" "barber_request_status" DEFAULT 'PENDING' NOT NULL,
	"rejection_note" text,
	"submitted_at" timestamp with time zone DEFAULT now() NOT NULL,
	"reviewed_at" timestamp with time zone,
	CONSTRAINT "barber_requests_barber_id_unique" UNIQUE("barber_id")
);
--> statement-breakpoint
CREATE TABLE "barber_services" (
	"id" text PRIMARY KEY NOT NULL,
	"barber_id" text NOT NULL,
	"service_id" text NOT NULL,
	"price_override" integer,
	"is_active" boolean DEFAULT true NOT NULL,
	CONSTRAINT "barber_services_barber_id_service_id_unique" UNIQUE("barber_id","service_id")
);
--> statement-breakpoint
CREATE TABLE "barber_specialties" (
	"id" text PRIMARY KEY NOT NULL,
	"barber_id" text NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "break_slots" (
	"id" text PRIMARY KEY NOT NULL,
	"barber_id" text NOT NULL,
	"label" text NOT NULL,
	"start" text NOT NULL,
	"end" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "chairs" (
	"id" text PRIMARY KEY NOT NULL,
	"barber_id" text NOT NULL,
	"label" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "contact_messages" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"subject" text NOT NULL,
	"message" text NOT NULL,
	"is_read" boolean DEFAULT false NOT NULL,
	"reply_status" "contact_reply_status" DEFAULT 'UNREPLIED' NOT NULL,
	"reply_text" text,
	"replied_at" timestamp with time zone,
	"internal_note" text,
	"assigned_to" text,
	"submitted_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "favorite_barbers" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"barber_id" text NOT NULL,
	"saved_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_visited_at" timestamp with time zone,
	"total_visits" integer DEFAULT 0 NOT NULL,
	"last_service" text,
	"your_rating" integer,
	CONSTRAINT "favorite_barbers_user_id_barber_id_unique" UNIQUE("user_id","barber_id")
);
--> statement-breakpoint
CREATE TABLE "favorite_shops" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"shop_id" text NOT NULL,
	"saved_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_visited_at" timestamp with time zone,
	"total_visits" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "favorite_shops_user_id_shop_id_unique" UNIQUE("user_id","shop_id")
);
--> statement-breakpoint
CREATE TABLE "gallery_images" (
	"id" text PRIMARY KEY NOT NULL,
	"barber_id" text NOT NULL,
	"src" text NOT NULL,
	"alt" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"type" "notification_type" NOT NULL,
	"title" text NOT NULL,
	"message" text NOT NULL,
	"is_read" boolean DEFAULT false NOT NULL,
	"appointment_id" text,
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "queue_entries" (
	"id" text PRIMARY KEY NOT NULL,
	"barber_id" text NOT NULL,
	"appointment_id" text,
	"walk_in_id" text,
	"chair_id" text,
	"source" "queue_source" NOT NULL,
	"customer_name" text NOT NULL,
	"phone" text,
	"service_name" text NOT NULL,
	"duration" integer NOT NULL,
	"notes" text,
	"status" "walk_in_status" DEFAULT 'WAITING' NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	"added_at" timestamp with time zone DEFAULT now() NOT NULL,
	"started_at" timestamp with time zone,
	"completed_at" timestamp with time zone,
	CONSTRAINT "queue_entries_appointment_id_unique" UNIQUE("appointment_id"),
	CONSTRAINT "queue_entries_walk_in_id_unique" UNIQUE("walk_in_id")
);
--> statement-breakpoint
CREATE TABLE "request_documents" (
	"id" text PRIMARY KEY NOT NULL,
	"request_id" text NOT NULL,
	"label" text NOT NULL,
	"file_name" text NOT NULL,
	"file_url" text,
	"uploaded_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reviews" (
	"id" text PRIMARY KEY NOT NULL,
	"appointment_id" text NOT NULL,
	"customer_id" text NOT NULL,
	"barber_id" text NOT NULL,
	"rating" integer NOT NULL,
	"comment" text,
	"barber_reply" text,
	"barber_replied_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "reviews_appointment_id_unique" UNIQUE("appointment_id")
);
--> statement-breakpoint
CREATE TABLE "service_change_items" (
	"id" text PRIMARY KEY NOT NULL,
	"request_id" text NOT NULL,
	"service_id" text,
	"side" text NOT NULL,
	"name" text NOT NULL,
	"price" integer NOT NULL,
	"duration" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "service_change_requests" (
	"id" text PRIMARY KEY NOT NULL,
	"appointment_id" text NOT NULL,
	"status" "service_change_status" DEFAULT 'PENDING' NOT NULL,
	"customer_note" text,
	"rejection_note" text,
	"requested_at" timestamp with time zone DEFAULT now() NOT NULL,
	"resolved_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "services" (
	"id" text PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"price" integer NOT NULL,
	"duration" integer NOT NULL,
	"is_popular" boolean DEFAULT false NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "services_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "shops" (
	"id" text PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"city" text NOT NULL,
	"address" text,
	"image_url" text,
	"starting_price" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"tags" jsonb,
	"average_rating" double precision DEFAULT 0 NOT NULL,
	"review_count" integer DEFAULT 0 NOT NULL,
	"barber_count" integer DEFAULT 0 NOT NULL,
	"open_hours_summary" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "shops_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "unavailable_dates" (
	"id" text PRIMARY KEY NOT NULL,
	"barber_id" text NOT NULL,
	"date" text NOT NULL,
	CONSTRAINT "unavailable_dates_barber_id_date_unique" UNIQUE("barber_id","date")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"password_hash" text,
	"role" "role" DEFAULT 'CUSTOMER' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"full_name" text NOT NULL,
	"phone" text,
	"photo_url" text,
	"address" text,
	"city" text,
	"password_reset_token" text,
	"password_reset_expires" timestamp with time zone,
	"refresh_token_hash" text,
	"refresh_token_expires" timestamp with time zone,
	"google_id" text,
	"last_active_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_google_id_unique" UNIQUE("google_id")
);
--> statement-breakpoint
CREATE TABLE "walk_ins" (
	"id" text PRIMARY KEY NOT NULL,
	"barber_id" text NOT NULL,
	"customer_name" text NOT NULL,
	"phone" text,
	"notes" text,
	"service_name" text NOT NULL,
	"duration" integer NOT NULL,
	"status" "walk_in_status" DEFAULT 'WAITING' NOT NULL,
	"added_at" timestamp with time zone DEFAULT now() NOT NULL,
	"started_at" timestamp with time zone,
	"completed_at" timestamp with time zone,
	"cancelled_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "working_hours" (
	"id" text PRIMARY KEY NOT NULL,
	"barber_id" text NOT NULL,
	"day" integer NOT NULL,
	"open_time" text,
	"close_time" text,
	"is_closed" boolean DEFAULT false NOT NULL,
	CONSTRAINT "working_hours_barber_id_day_unique" UNIQUE("barber_id","day")
);
--> statement-breakpoint
ALTER TABLE "appointment_activity" ADD CONSTRAINT "appointment_activity_appointment_id_appointments_id_fk" FOREIGN KEY ("appointment_id") REFERENCES "public"."appointments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appointment_modifications" ADD CONSTRAINT "appointment_modifications_appointment_id_appointments_id_fk" FOREIGN KEY ("appointment_id") REFERENCES "public"."appointments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appointment_original_services" ADD CONSTRAINT "appointment_original_services_appointment_id_appointments_id_fk" FOREIGN KEY ("appointment_id") REFERENCES "public"."appointments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appointment_services" ADD CONSTRAINT "appointment_services_appointment_id_appointments_id_fk" FOREIGN KEY ("appointment_id") REFERENCES "public"."appointments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appointment_services" ADD CONSTRAINT "appointment_services_service_id_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_customer_id_users_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_barber_id_barber_profiles_id_fk" FOREIGN KEY ("barber_id") REFERENCES "public"."barber_profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "barber_profiles" ADD CONSTRAINT "barber_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "barber_profiles" ADD CONSTRAINT "barber_profiles_shop_id_shops_id_fk" FOREIGN KEY ("shop_id") REFERENCES "public"."shops"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "barber_requests" ADD CONSTRAINT "barber_requests_barber_id_barber_profiles_id_fk" FOREIGN KEY ("barber_id") REFERENCES "public"."barber_profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "barber_services" ADD CONSTRAINT "barber_services_barber_id_barber_profiles_id_fk" FOREIGN KEY ("barber_id") REFERENCES "public"."barber_profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "barber_services" ADD CONSTRAINT "barber_services_service_id_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "barber_specialties" ADD CONSTRAINT "barber_specialties_barber_id_barber_profiles_id_fk" FOREIGN KEY ("barber_id") REFERENCES "public"."barber_profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "break_slots" ADD CONSTRAINT "break_slots_barber_id_barber_profiles_id_fk" FOREIGN KEY ("barber_id") REFERENCES "public"."barber_profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chairs" ADD CONSTRAINT "chairs_barber_id_barber_profiles_id_fk" FOREIGN KEY ("barber_id") REFERENCES "public"."barber_profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contact_messages" ADD CONSTRAINT "contact_messages_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "favorite_barbers" ADD CONSTRAINT "favorite_barbers_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "favorite_barbers" ADD CONSTRAINT "favorite_barbers_barber_id_barber_profiles_id_fk" FOREIGN KEY ("barber_id") REFERENCES "public"."barber_profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "favorite_shops" ADD CONSTRAINT "favorite_shops_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "favorite_shops" ADD CONSTRAINT "favorite_shops_shop_id_shops_id_fk" FOREIGN KEY ("shop_id") REFERENCES "public"."shops"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gallery_images" ADD CONSTRAINT "gallery_images_barber_id_barber_profiles_id_fk" FOREIGN KEY ("barber_id") REFERENCES "public"."barber_profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_appointment_id_appointments_id_fk" FOREIGN KEY ("appointment_id") REFERENCES "public"."appointments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "queue_entries" ADD CONSTRAINT "queue_entries_barber_id_barber_profiles_id_fk" FOREIGN KEY ("barber_id") REFERENCES "public"."barber_profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "queue_entries" ADD CONSTRAINT "queue_entries_appointment_id_appointments_id_fk" FOREIGN KEY ("appointment_id") REFERENCES "public"."appointments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "queue_entries" ADD CONSTRAINT "queue_entries_chair_id_chairs_id_fk" FOREIGN KEY ("chair_id") REFERENCES "public"."chairs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "request_documents" ADD CONSTRAINT "request_documents_request_id_barber_requests_id_fk" FOREIGN KEY ("request_id") REFERENCES "public"."barber_requests"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_appointment_id_appointments_id_fk" FOREIGN KEY ("appointment_id") REFERENCES "public"."appointments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_customer_id_users_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_barber_id_barber_profiles_id_fk" FOREIGN KEY ("barber_id") REFERENCES "public"."barber_profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service_change_items" ADD CONSTRAINT "service_change_items_request_id_service_change_requests_id_fk" FOREIGN KEY ("request_id") REFERENCES "public"."service_change_requests"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service_change_items" ADD CONSTRAINT "service_change_items_service_id_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service_change_requests" ADD CONSTRAINT "service_change_requests_appointment_id_appointments_id_fk" FOREIGN KEY ("appointment_id") REFERENCES "public"."appointments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "unavailable_dates" ADD CONSTRAINT "unavailable_dates_barber_id_barber_profiles_id_fk" FOREIGN KEY ("barber_id") REFERENCES "public"."barber_profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "walk_ins" ADD CONSTRAINT "walk_ins_barber_id_barber_profiles_id_fk" FOREIGN KEY ("barber_id") REFERENCES "public"."barber_profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "working_hours" ADD CONSTRAINT "working_hours_barber_id_barber_profiles_id_fk" FOREIGN KEY ("barber_id") REFERENCES "public"."barber_profiles"("id") ON DELETE cascade ON UPDATE no action;