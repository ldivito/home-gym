CREATE TYPE "public"."exercise_category" AS ENUM('strength', 'cardio', 'core', 'mobility');--> statement-breakpoint
CREATE TYPE "public"."exercise_tracking_mode" AS ENUM('reps', 'time', 'both');--> statement-breakpoint
CREATE TABLE "exercise_definitions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"category" "exercise_category" NOT NULL,
	"tracking_mode" "exercise_tracking_mode" NOT NULL,
	"required_equipment" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"sets_default" integer,
	"reps_default" integer,
	"time_sec_default" integer,
	"rest_sec_default" integer,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "exercise_definitions_name_unique" UNIQUE("name")
);
