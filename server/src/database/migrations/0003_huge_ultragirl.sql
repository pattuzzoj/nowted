ALTER TABLE "pending_changes" DROP CONSTRAINT "pending_changes_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "pending_changes" ADD CONSTRAINT "pending_changes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;