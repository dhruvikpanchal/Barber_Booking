CREATE TABLE IF NOT EXISTS "barber_nav_seen" (
	"id" text PRIMARY KEY NOT NULL,
	"barber_user_id" text NOT NULL,
	"section" text NOT NULL,
	"last_seen_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "barber_nav_seen_barber_user_id_section_unique" UNIQUE("barber_user_id","section")
);
--> statement-breakpoint
ALTER TABLE "barber_nav_seen" ADD CONSTRAINT "barber_nav_seen_barber_user_id_users_id_fk" FOREIGN KEY ("barber_user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "barber_nav_seen_barber_user_id_idx" ON "barber_nav_seen" USING btree ("barber_user_id");
