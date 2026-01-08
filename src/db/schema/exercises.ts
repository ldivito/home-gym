import { pgTable, text, uuid, timestamp, integer, jsonb, pgEnum } from 'drizzle-orm/pg-core'

// Enums for exercise properties
export const exerciseCategoryEnum = pgEnum('exercise_category', [
  'strength',
  'cardio',
  'core',
  'mobility'
])

export const exerciseTrackingModeEnum = pgEnum('exercise_tracking_mode', [
  'reps',
  'time',
  'both'
])

// Equipment types as a constant (stored as JSON array in DB)
export const EQUIPMENT_TYPES = [
  'bench',
  'rack',
  'barbell',
  'dumbbells',
  'elliptical',
  'sandbag',
  'abwheel',
  'mat',
  'bodyweight'
] as const

export type EquipmentType = typeof EQUIPMENT_TYPES[number]

// Exercise definitions table
export const exerciseDefinitions = pgTable('exercise_definitions', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull().unique(),
  category: exerciseCategoryEnum('category').notNull(),
  trackingMode: exerciseTrackingModeEnum('tracking_mode').notNull(),
  requiredEquipment: jsonb('required_equipment').$type<EquipmentType[]>().notNull().default([]),

  // Default values for workout sets
  setsDefault: integer('sets_default'),
  repsDefault: integer('reps_default'),
  timeSecDefault: integer('time_sec_default'),
  restSecDefault: integer('rest_sec_default'),

  // Notes
  notes: text('notes'),

  // Timestamps
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
})

// Type exports
export type ExerciseDefinition = typeof exerciseDefinitions.$inferSelect
export type NewExerciseDefinition = typeof exerciseDefinitions.$inferInsert
