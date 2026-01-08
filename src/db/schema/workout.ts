import {
  pgTable,
  uuid,
  timestamp,
  text,
  integer,
  decimal,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Enum for tracking mode
export const trackingModeEnum = pgEnum("tracking_mode", [
  "reps",
  "time",
  "both",
]);

// Workout sessions table
export const workoutSessions = pgTable("workout_sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  startedAt: timestamp("started_at").defaultNow().notNull(),
  endedAt: timestamp("ended_at"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Workout exercises table
export const workoutExercises = pgTable("workout_exercises", {
  id: uuid("id").primaryKey().defaultRandom(),
  sessionId: uuid("session_id")
    .notNull()
    .references(() => workoutSessions.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  trackingMode: trackingModeEnum("tracking_mode").notNull().default("reps"),
  order: integer("order").notNull().default(0),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Workout sets table
export const workoutSets = pgTable("workout_sets", {
  id: uuid("id").primaryKey().defaultRandom(),
  exerciseId: uuid("exercise_id")
    .notNull()
    .references(() => workoutExercises.id, { onDelete: "cascade" }),
  repsActual: integer("reps_actual"),
  timeSecActual: integer("time_sec_actual"),
  loadKgActual: decimal("load_kg_actual", { precision: 6, scale: 2 }),
  rpe: decimal("rpe", { precision: 3, scale: 1 }),
  notes: text("notes"),
  order: integer("order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Relations
export const workoutSessionsRelations = relations(
  workoutSessions,
  ({ many }) => ({
    exercises: many(workoutExercises),
  })
);

export const workoutExercisesRelations = relations(
  workoutExercises,
  ({ one, many }) => ({
    session: one(workoutSessions, {
      fields: [workoutExercises.sessionId],
      references: [workoutSessions.id],
    }),
    sets: many(workoutSets),
  })
);

export const workoutSetsRelations = relations(workoutSets, ({ one }) => ({
  exercise: one(workoutExercises, {
    fields: [workoutSets.exerciseId],
    references: [workoutExercises.id],
  }),
}));

// Types
export type WorkoutSession = typeof workoutSessions.$inferSelect;
export type NewWorkoutSession = typeof workoutSessions.$inferInsert;

export type WorkoutExercise = typeof workoutExercises.$inferSelect;
export type NewWorkoutExercise = typeof workoutExercises.$inferInsert;

export type WorkoutSet = typeof workoutSets.$inferSelect;
export type NewWorkoutSet = typeof workoutSets.$inferInsert;

// Extended types with relations
export type WorkoutExerciseWithSets = WorkoutExercise & {
  sets: WorkoutSet[];
};

export type WorkoutSessionWithExercises = WorkoutSession & {
  exercises: WorkoutExerciseWithSets[];
};
