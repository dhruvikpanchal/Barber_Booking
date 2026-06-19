DO $$ BEGIN
  CREATE TYPE "contact_workflow_status" AS ENUM('NEW', 'IN_PROGRESS', 'REPLIED', 'CLOSED');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "contact_messages" ADD COLUMN IF NOT EXISTS "workflow_status" "contact_workflow_status" NOT NULL DEFAULT 'NEW';
--> statement-breakpoint
UPDATE "contact_messages"
SET "workflow_status" = 'REPLIED'
WHERE "reply_status" = 'REPLIED';
