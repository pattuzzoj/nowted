ALTER TABLE "notes" ALTER COLUMN "name" SET DEFAULT 'note';--> statement-breakpoint
ALTER TABLE "notes" ALTER COLUMN "preview" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "notes" ALTER COLUMN "preview" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "notes" ALTER COLUMN "content" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "notes" ALTER COLUMN "content" SET NOT NULL;