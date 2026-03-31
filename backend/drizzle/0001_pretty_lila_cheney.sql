CREATE TYPE "public"."checkin_status" AS ENUM('done', 'missed');--> statement-breakpoint
CREATE TYPE "public"."frequency" AS ENUM('daily', 'weekly');--> statement-breakpoint
CREATE TYPE "public"."strictness" AS ENUM('normal', 'strict', 'brutal');--> statement-breakpoint
CREATE TABLE "goals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"title" text NOT NULL,
	"reason" text,
	"frequency" "frequency" DEFAULT 'daily' NOT NULL,
	"strictness" "strictness" DEFAULT 'strict' NOT NULL,
	"reminder_time" text,
	"archived_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "goals" ADD CONSTRAINT "goals_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "goals_user_id_idx" ON "goals" USING btree ("user_id");