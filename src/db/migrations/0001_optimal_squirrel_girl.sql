CREATE TYPE "public"."block_type" AS ENUM('warmup', 'main', 'accessory', 'cardio', 'cooldown');--> statement-breakpoint
CREATE TABLE "routine_template_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"routine_id" uuid NOT NULL,
	"exercise_name" text NOT NULL,
	"block_type" "block_type",
	"sets_planned" integer DEFAULT 1 NOT NULL,
	"reps_planned" integer,
	"time_sec_planned" integer,
	"rest_sec_planned" integer,
	"target_load_kg" numeric(6, 2),
	"notes" text,
	"order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "routine_templates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "routine_template_items" ADD CONSTRAINT "routine_template_items_routine_id_routine_templates_id_fk" FOREIGN KEY ("routine_id") REFERENCES "public"."routine_templates"("id") ON DELETE cascade ON UPDATE no action;