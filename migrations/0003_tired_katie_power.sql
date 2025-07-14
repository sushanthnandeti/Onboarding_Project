CREATE TABLE "onboarding_components" (
	"id" serial PRIMARY KEY NOT NULL,
	"component" text NOT NULL,
	"page" integer NOT NULL
);
--> statement-breakpoint
DROP TABLE "onboarding_page_components" CASCADE;--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN "onsite";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN "compensation";