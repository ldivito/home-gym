import {
  pgTable,
  text,
  timestamp,
  uuid,
  integer,
  decimal,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Block type enum for categorizing exercises within a routine
export const blockTypeEnum = pgEnum("block_type", [
  "warmup",
  "main",
  "accessory",
  "cardio",
  "cooldown",
]);

// Routine templates table
export const routineTemplates = pgTable("routine_templates", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Routine template items table (exercises within a routine)
export const routineTemplateItems = pgTable("routine_template_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  routineId: uuid("routine_id")
    .notNull()
    .references(() => routineTemplates.id, { onDelete: "cascade" }),
  exerciseName: text("exercise_name").notNull(),
  blockType: blockTypeEnum("block_type"),
  setsPlanned: integer("sets_planned").notNull().default(1),
  repsPlanned: integer("reps_planned"),
  timeSecPlanned: integer("time_sec_planned"),
  restSecPlanned: integer("rest_sec_planned"),
  targetLoadKg: decimal("target_load_kg", { precision: 6, scale: 2 }),
  notes: text("notes"),
  order: integer("order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Relations
export const routineTemplatesRelations = relations(
  routineTemplates,
  ({ many }) => ({
    items: many(routineTemplateItems),
  })
);

export const routineTemplateItemsRelations = relations(
  routineTemplateItems,
  ({ one }) => ({
    routine: one(routineTemplates, {
      fields: [routineTemplateItems.routineId],
      references: [routineTemplates.id],
    }),
  })
);

// Type inference
export type RoutineTemplate = typeof routineTemplates.$inferSelect;
export type NewRoutineTemplate = typeof routineTemplates.$inferInsert;
export type RoutineTemplateItem = typeof routineTemplateItems.$inferSelect;
export type NewRoutineTemplateItem = typeof routineTemplateItems.$inferInsert;

// Block type as TypeScript type
export type BlockType = "warmup" | "main" | "accessory" | "cardio" | "cooldown";
