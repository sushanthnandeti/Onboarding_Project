CREATE TYPE "public"."skill_level" AS ENUM('Beginner', 'Intermediate', 'Advanced', 'Expert', 'Master');--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"firstName" text,
	"lastName" text,
	"email" text NOT NULL,
	"password" text,
	"about_me" text,
	"street_address" text,
	"city" text,
	"state" text,
	"zip_code" text,
	"birthdate" text,
	"current_step" integer DEFAULT 1,
	"is_completed" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"skill_level" "skill_level" DEFAULT 'Beginner' NOT NULL
);
