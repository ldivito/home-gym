"use server";

import { db } from "@/lib/db";
import {
  workoutSessions,
  workoutExercises,
  workoutSets,
  type NewWorkoutExercise,
  type NewWorkoutSet,
} from "@/db/schema";
import { eq, isNull, desc, asc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// Session actions

export async function createSession() {
  const [session] = await db.insert(workoutSessions).values({}).returning();
  revalidatePath("/workout");
  return session;
}

export async function getActiveSession() {
  const sessions = await db
    .select()
    .from(workoutSessions)
    .where(isNull(workoutSessions.endedAt))
    .orderBy(desc(workoutSessions.startedAt))
    .limit(1);
  return sessions[0] ?? null;
}

export async function getSessionById(id: string) {
  const sessions = await db
    .select()
    .from(workoutSessions)
    .where(eq(workoutSessions.id, id))
    .limit(1);
  return sessions[0] ?? null;
}

export async function getSessionWithDetails(id: string) {
  const session = await db.query.workoutSessions.findFirst({
    where: eq(workoutSessions.id, id),
    with: {
      exercises: {
        orderBy: asc(workoutExercises.order),
        with: {
          sets: {
            orderBy: asc(workoutSets.order),
          },
        },
      },
    },
  });
  return session ?? null;
}

export async function finishSession(id: string, notes?: string) {
  const [session] = await db
    .update(workoutSessions)
    .set({
      endedAt: new Date(),
      notes: notes ?? null,
      updatedAt: new Date(),
    })
    .where(eq(workoutSessions.id, id))
    .returning();
  revalidatePath("/workout");
  revalidatePath("/workout/history");
  return session;
}

export async function updateSessionNotes(id: string, notes: string) {
  const [session] = await db
    .update(workoutSessions)
    .set({
      notes,
      updatedAt: new Date(),
    })
    .where(eq(workoutSessions.id, id))
    .returning();
  return session;
}

// Exercise actions

export async function addExercise(
  sessionId: string,
  name: string,
  trackingMode: "reps" | "time" | "both"
) {
  // Get max order for this session
  const exercises = await db
    .select({ order: workoutExercises.order })
    .from(workoutExercises)
    .where(eq(workoutExercises.sessionId, sessionId))
    .orderBy(desc(workoutExercises.order))
    .limit(1);

  const nextOrder = exercises.length > 0 ? exercises[0].order + 1 : 0;

  const [exercise] = await db
    .insert(workoutExercises)
    .values({
      sessionId,
      name,
      trackingMode,
      order: nextOrder,
    } as NewWorkoutExercise)
    .returning();

  return exercise;
}

export async function updateExercise(
  id: string,
  data: { name?: string; trackingMode?: "reps" | "time" | "both" }
) {
  const [exercise] = await db
    .update(workoutExercises)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(workoutExercises.id, id))
    .returning();
  return exercise;
}

export async function toggleExerciseComplete(id: string) {
  const [existing] = await db
    .select()
    .from(workoutExercises)
    .where(eq(workoutExercises.id, id))
    .limit(1);

  if (!existing) return null;

  const [exercise] = await db
    .update(workoutExercises)
    .set({
      completedAt: existing.completedAt ? null : new Date(),
      updatedAt: new Date(),
    })
    .where(eq(workoutExercises.id, id))
    .returning();
  return exercise;
}

export async function deleteExercise(id: string) {
  await db.delete(workoutExercises).where(eq(workoutExercises.id, id));
}

export async function reorderExercise(
  id: string,
  sessionId: string,
  direction: "up" | "down"
) {
  const exercises = await db
    .select()
    .from(workoutExercises)
    .where(eq(workoutExercises.sessionId, sessionId))
    .orderBy(asc(workoutExercises.order));

  const currentIndex = exercises.findIndex((e) => e.id === id);
  if (currentIndex === -1) return;

  const targetIndex =
    direction === "up" ? currentIndex - 1 : currentIndex + 1;
  if (targetIndex < 0 || targetIndex >= exercises.length) return;

  const current = exercises[currentIndex];
  const target = exercises[targetIndex];

  await Promise.all([
    db
      .update(workoutExercises)
      .set({ order: target.order, updatedAt: new Date() })
      .where(eq(workoutExercises.id, current.id)),
    db
      .update(workoutExercises)
      .set({ order: current.order, updatedAt: new Date() })
      .where(eq(workoutExercises.id, target.id)),
  ]);
}

// Set actions

export async function addSet(
  exerciseId: string,
  data?: Partial<Omit<NewWorkoutSet, "exerciseId" | "order">>
) {
  // Get max order for this exercise
  const sets = await db
    .select({ order: workoutSets.order })
    .from(workoutSets)
    .where(eq(workoutSets.exerciseId, exerciseId))
    .orderBy(desc(workoutSets.order))
    .limit(1);

  const nextOrder = sets.length > 0 ? sets[0].order + 1 : 0;

  const [set] = await db
    .insert(workoutSets)
    .values({
      exerciseId,
      order: nextOrder,
      ...data,
    } as NewWorkoutSet)
    .returning();

  return set;
}

export async function updateSet(
  id: string,
  data: {
    repsActual?: number | null;
    timeSecActual?: number | null;
    loadKgActual?: string | null;
    rpe?: string | null;
    notes?: string | null;
  }
) {
  const [set] = await db
    .update(workoutSets)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(workoutSets.id, id))
    .returning();
  return set;
}

export async function deleteSet(id: string) {
  await db.delete(workoutSets).where(eq(workoutSets.id, id));
}

// History actions

export async function getSessionHistory() {
  const sessions = await db.query.workoutSessions.findMany({
    orderBy: desc(workoutSessions.startedAt),
    with: {
      exercises: {
        with: {
          sets: true,
        },
      },
    },
  });
  return sessions;
}

export async function getCompletedSessions() {
  const sessions = await db
    .select()
    .from(workoutSessions)
    .orderBy(desc(workoutSessions.startedAt));
  return sessions;
}
