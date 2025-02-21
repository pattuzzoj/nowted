CREATE TYPE "public"."account_status" AS ENUM('pending', 'active');--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "account_status" "account_status" DEFAULT 'pending' NOT NULL;