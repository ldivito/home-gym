import {
  boolean,
  doublePrecision,
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

export const equipmentProfile = pgTable("equipment_profile", {
  id: uuid("id").primaryKey().defaultRandom(),
  barbellWeightKg: doublePrecision("barbell_weight_kg").notNull(),
  dumbbellHandleWeightKg: doublePrecision("dumbbell_handle_weight_kg").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const plateInventory = pgTable(
  "plate_inventory",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    plateWeightKg: doublePrecision("plate_weight_kg").notNull(),
    count: integer("count").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    plateWeightUnique: uniqueIndex("plate_inventory_plate_weight_kg_unique").on(
      table.plateWeightKg,
    ),
  }),
);

export const availableEquipment = pgTable(
  "available_equipment",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    key: text("key").notNull(),
    enabled: boolean("enabled").notNull().default(false),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    keyUnique: uniqueIndex("available_equipment_key_unique").on(table.key),
  }),
);
