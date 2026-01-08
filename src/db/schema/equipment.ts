import {
  pgTable,
  text,
  timestamp,
  uuid,
  boolean,
  integer,
  real,
} from "drizzle-orm/pg-core";

// Equipment profile - stores base weights for barbell and dumbbells
export const equipmentProfile = pgTable("equipment_profile", {
  id: uuid("id").primaryKey().defaultRandom(),
  barbellWeightKg: real("barbell_weight_kg").notNull().default(20),
  dumbbellHandleWeightKg: real("dumbbell_handle_weight_kg").notNull().default(2.5),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Plate inventory - stores count of each plate weight
export const plateInventory = pgTable("plate_inventory", {
  id: uuid("id").primaryKey().defaultRandom(),
  plateWeightKg: real("plate_weight_kg").notNull(), // 2.5 or 5
  count: integer("count").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Available equipment - toggles for what equipment user has
export const availableEquipment = pgTable("available_equipment", {
  id: uuid("id").primaryKey().defaultRandom(),
  key: text("key").notNull().unique(), // bench, rack, barbell, etc.
  enabled: boolean("enabled").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Type exports
export type EquipmentProfile = typeof equipmentProfile.$inferSelect;
export type NewEquipmentProfile = typeof equipmentProfile.$inferInsert;

export type PlateInventory = typeof plateInventory.$inferSelect;
export type NewPlateInventory = typeof plateInventory.$inferInsert;

export type AvailableEquipment = typeof availableEquipment.$inferSelect;
export type NewAvailableEquipment = typeof availableEquipment.$inferInsert;

// Equipment keys constant for type safety
export const EQUIPMENT_KEYS = [
  "bench",
  "rack",
  "barbell",
  "dumbbells",
  "elliptical",
  "sandbag",
  "abwheel",
  "mat_board",
  "bodyweight",
] as const;

export type EquipmentKey = (typeof EQUIPMENT_KEYS)[number];
