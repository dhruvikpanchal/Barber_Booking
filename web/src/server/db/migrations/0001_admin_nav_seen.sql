CREATE TABLE IF NOT EXISTS "admin_nav_seen" (
	"id" text PRIMARY KEY NOT NULL,
	"admin_user_id" text NOT NULL,
	"section" text NOT NULL,
	"last_seen_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "admin_nav_seen_admin_user_id_section_unique" UNIQUE("admin_user_id","section")
);
--> statement-breakpoint
ALTER TABLE "admin_nav_seen" ADD CONSTRAINT "admin_nav_seen_admin_user_id_users_id_fk" FOREIGN KEY ("admin_user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "admin_nav_seen_admin_user_id_idx" ON "admin_nav_seen" USING btree ("admin_user_id");
