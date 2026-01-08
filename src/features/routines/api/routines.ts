"use server";

import { db } from "@/lib/db";
import {
  routineTemplates,
  routineTemplateItems,
  type NewRoutineTemplate,
} from "@/db/schema";
import { eq, asc, desc, ilike, and } from "drizzle-orm";
import type { RoutineWithItems, RoutineSortOption, RoutineItemFormData } from "../types";

// ============ ROUTINES ============

export async function getRoutines(options?: {
  search?: string;
  sort?: RoutineSortOption;
}) {
  const { search, sort = "recent" } = options ?? {};

  let orderBy;
  switch (sort) {
    case "name-asc":
      orderBy = asc(routineTemplates.name);
      break;
    case "name-desc":
      orderBy = desc(routineTemplates.name);
      break;
    case "oldest":
      orderBy = asc(routineTemplates.createdAt);
      break;
    case "recent":
    default:
      orderBy = desc(routineTemplates.createdAt);
  }

  const whereClause = search
    ? ilike(routineTemplates.name, `%${search}%`)
    : undefined;

  const routines = await db.query.routineTemplates.findMany({
    where: whereClause,
    orderBy: [orderBy],
    with: {
      items: {
        orderBy: [asc(routineTemplateItems.order)],
      },
    },
  });

  return routines as RoutineWithItems[];
}

export async function getRoutineById(id: string): Promise<RoutineWithItems | null> {
  const routine = await db.query.routineTemplates.findFirst({
    where: eq(routineTemplates.id, id),
    with: {
      items: {
        orderBy: [asc(routineTemplateItems.order)],
      },
    },
  });

  return routine as RoutineWithItems | null;
}

export async function createRoutine(data: NewRoutineTemplate) {
  const [routine] = await db
    .insert(routineTemplates)
    .values({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();

  return routine;
}

export async function updateRoutine(
  id: string,
  data: Partial<Pick<NewRoutineTemplate, "name" | "description">>
) {
  const [routine] = await db
    .update(routineTemplates)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(routineTemplates.id, id))
    .returning();

  return routine;
}

export async function deleteRoutine(id: string) {
  await db.delete(routineTemplates).where(eq(routineTemplates.id, id));
  return { success: true };
}

export async function duplicateRoutine(id: string): Promise<RoutineWithItems | null> {
  const original = await getRoutineById(id);
  if (!original) return null;

  // Create new routine with "(Copy)" suffix
  const [newRoutine] = await db
    .insert(routineTemplates)
    .values({
      name: `${original.name} (Copy)`,
      description: original.description,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();

  // Copy items
  if (original.items.length > 0) {
    const newItems = original.items.map((item) => ({
      routineId: newRoutine.id,
      exerciseName: item.exerciseName,
      blockType: item.blockType,
      setsPlanned: item.setsPlanned,
      repsPlanned: item.repsPlanned,
      timeSecPlanned: item.timeSecPlanned,
      restSecPlanned: item.restSecPlanned,
      targetLoadKg: item.targetLoadKg,
      notes: item.notes,
      order: item.order,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    await db.insert(routineTemplateItems).values(newItems);
  }

  return getRoutineById(newRoutine.id);
}

// ============ ROUTINE ITEMS ============

export async function addRoutineItem(
  routineId: string,
  data: RoutineItemFormData
) {
  // Get current max order
  const existingItems = await db.query.routineTemplateItems.findMany({
    where: eq(routineTemplateItems.routineId, routineId),
    orderBy: [desc(routineTemplateItems.order)],
    limit: 1,
  });

  const maxOrder = existingItems[0]?.order ?? -1;

  const [item] = await db
    .insert(routineTemplateItems)
    .values({
      routineId,
      exerciseName: data.exerciseName,
      blockType: data.blockType,
      setsPlanned: data.setsPlanned,
      repsPlanned: data.repsPlanned,
      timeSecPlanned: data.timeSecPlanned,
      restSecPlanned: data.restSecPlanned,
      targetLoadKg: data.targetLoadKg ? String(data.targetLoadKg) : null,
      notes: data.notes,
      order: maxOrder + 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();

  return item;
}

export async function updateRoutineItem(
  itemId: string,
  data: Partial<RoutineItemFormData>
) {
  const [item] = await db
    .update(routineTemplateItems)
    .set({
      ...(data.exerciseName !== undefined && { exerciseName: data.exerciseName }),
      ...(data.blockType !== undefined && { blockType: data.blockType }),
      ...(data.setsPlanned !== undefined && { setsPlanned: data.setsPlanned }),
      ...(data.repsPlanned !== undefined && { repsPlanned: data.repsPlanned }),
      ...(data.timeSecPlanned !== undefined && { timeSecPlanned: data.timeSecPlanned }),
      ...(data.restSecPlanned !== undefined && { restSecPlanned: data.restSecPlanned }),
      ...(data.targetLoadKg !== undefined && {
        targetLoadKg: data.targetLoadKg ? String(data.targetLoadKg) : null
      }),
      ...(data.notes !== undefined && { notes: data.notes }),
      updatedAt: new Date(),
    })
    .where(eq(routineTemplateItems.id, itemId))
    .returning();

  return item;
}

export async function deleteRoutineItem(itemId: string) {
  await db.delete(routineTemplateItems).where(eq(routineTemplateItems.id, itemId));
  return { success: true };
}

export async function reorderRoutineItems(
  routineId: string,
  itemIds: string[]
) {
  // Update order for each item
  await Promise.all(
    itemIds.map((id, index) =>
      db
        .update(routineTemplateItems)
        .set({ order: index, updatedAt: new Date() })
        .where(
          and(
            eq(routineTemplateItems.id, id),
            eq(routineTemplateItems.routineId, routineId)
          )
        )
    )
  );

  return { success: true };
}

export async function moveRoutineItem(
  routineId: string,
  itemId: string,
  direction: "up" | "down"
) {
  // Get all items for this routine
  const items = await db.query.routineTemplateItems.findMany({
    where: eq(routineTemplateItems.routineId, routineId),
    orderBy: [asc(routineTemplateItems.order)],
  });

  const currentIndex = items.findIndex((item) => item.id === itemId);
  if (currentIndex === -1) return { success: false };

  const newIndex =
    direction === "up"
      ? Math.max(0, currentIndex - 1)
      : Math.min(items.length - 1, currentIndex + 1);

  if (currentIndex === newIndex) return { success: true };

  // Swap orders
  const currentItem = items[currentIndex];
  const swapItem = items[newIndex];

  await Promise.all([
    db
      .update(routineTemplateItems)
      .set({ order: swapItem.order, updatedAt: new Date() })
      .where(eq(routineTemplateItems.id, currentItem.id)),
    db
      .update(routineTemplateItems)
      .set({ order: currentItem.order, updatedAt: new Date() })
      .where(eq(routineTemplateItems.id, swapItem.id)),
  ]);

  return { success: true };
}
