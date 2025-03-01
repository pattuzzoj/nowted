ALTER TABLE "folders" ALTER COLUMN "user_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "notes" ALTER COLUMN "user_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "notes" ALTER COLUMN "folder_id" SET NOT NULL;