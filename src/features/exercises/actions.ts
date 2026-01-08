'use server'

import { db } from '@/lib/db'
import { exerciseDefinitions } from '@/db/schema/exercises'
import { eq, ilike, asc, desc, and, sql } from 'drizzle-orm'
import type { ExerciseFormData, ExerciseFilters, ExerciseMutationResult, ExerciseListResponse } from './types'
import { DEFAULT_EXERCISES } from './constants'

// Get all exercises with optional filters
export async function getExercises(filters?: ExerciseFilters): Promise<ExerciseListResponse> {
  const conditions = []

  // Search by name
  if (filters?.search) {
    conditions.push(ilike(exerciseDefinitions.name, `%${filters.search}%`))
  }

  // Filter by categories
  if (filters?.categories && filters.categories.length > 0) {
    conditions.push(
      sql`${exerciseDefinitions.category} = ANY(${filters.categories})`
    )
  }

  // Filter by tracking modes
  if (filters?.trackingModes && filters.trackingModes.length > 0) {
    conditions.push(
      sql`${exerciseDefinitions.trackingMode} = ANY(${filters.trackingModes})`
    )
  }

  // Filter by equipment (exercises that require any of the selected equipment)
  if (filters?.equipment && filters.equipment.length > 0) {
    conditions.push(
      sql`${exerciseDefinitions.requiredEquipment} ?| ${filters.equipment}`
    )
  }

  // Build order by
  const orderBy = filters?.sortBy === 'createdAt'
    ? (filters?.sortOrder === 'asc' ? asc(exerciseDefinitions.createdAt) : desc(exerciseDefinitions.createdAt))
    : (filters?.sortOrder === 'desc' ? desc(exerciseDefinitions.name) : asc(exerciseDefinitions.name))

  const exercises = await db
    .select()
    .from(exerciseDefinitions)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(orderBy)

  return {
    exercises,
    total: exercises.length
  }
}

// Get single exercise by ID
export async function getExerciseById(id: string) {
  const [exercise] = await db
    .select()
    .from(exerciseDefinitions)
    .where(eq(exerciseDefinitions.id, id))
    .limit(1)

  return exercise || null
}

// Create new exercise
export async function createExercise(data: ExerciseFormData): Promise<ExerciseMutationResult> {
  try {
    // Validate name
    if (!data.name || data.name.trim() === '') {
      return { success: false, error: 'El nombre es requerido' }
    }

    // Validate defaults
    if (data.setsDefault !== null && data.setsDefault !== undefined && data.setsDefault < 1) {
      return { success: false, error: 'Las series deben ser al menos 1' }
    }
    if (data.repsDefault !== null && data.repsDefault !== undefined && data.repsDefault < 0) {
      return { success: false, error: 'Las repeticiones no pueden ser negativas' }
    }
    if (data.timeSecDefault !== null && data.timeSecDefault !== undefined && data.timeSecDefault < 0) {
      return { success: false, error: 'El tiempo no puede ser negativo' }
    }
    if (data.restSecDefault !== null && data.restSecDefault !== undefined && data.restSecDefault < 0) {
      return { success: false, error: 'El descanso no puede ser negativo' }
    }

    const [exercise] = await db
      .insert(exerciseDefinitions)
      .values({
        name: data.name.trim(),
        category: data.category,
        trackingMode: data.trackingMode,
        requiredEquipment: data.requiredEquipment,
        setsDefault: data.setsDefault,
        repsDefault: data.repsDefault,
        timeSecDefault: data.timeSecDefault,
        restSecDefault: data.restSecDefault,
        notes: data.notes?.trim() || null
      })
      .returning()

    return { success: true, data: exercise }
  } catch (error) {
    // Handle unique constraint violation
    if (error instanceof Error && error.message.includes('unique')) {
      return { success: false, error: 'Ya existe un ejercicio con ese nombre' }
    }
    console.error('Error creating exercise:', error)
    return { success: false, error: 'Error al crear el ejercicio' }
  }
}

// Update existing exercise
export async function updateExercise(id: string, data: ExerciseFormData): Promise<ExerciseMutationResult> {
  try {
    // Validate name
    if (!data.name || data.name.trim() === '') {
      return { success: false, error: 'El nombre es requerido' }
    }

    // Validate defaults
    if (data.setsDefault !== null && data.setsDefault !== undefined && data.setsDefault < 1) {
      return { success: false, error: 'Las series deben ser al menos 1' }
    }
    if (data.repsDefault !== null && data.repsDefault !== undefined && data.repsDefault < 0) {
      return { success: false, error: 'Las repeticiones no pueden ser negativas' }
    }
    if (data.timeSecDefault !== null && data.timeSecDefault !== undefined && data.timeSecDefault < 0) {
      return { success: false, error: 'El tiempo no puede ser negativo' }
    }
    if (data.restSecDefault !== null && data.restSecDefault !== undefined && data.restSecDefault < 0) {
      return { success: false, error: 'El descanso no puede ser negativo' }
    }

    const [exercise] = await db
      .update(exerciseDefinitions)
      .set({
        name: data.name.trim(),
        category: data.category,
        trackingMode: data.trackingMode,
        requiredEquipment: data.requiredEquipment,
        setsDefault: data.setsDefault,
        repsDefault: data.repsDefault,
        timeSecDefault: data.timeSecDefault,
        restSecDefault: data.restSecDefault,
        notes: data.notes?.trim() || null,
        updatedAt: new Date()
      })
      .where(eq(exerciseDefinitions.id, id))
      .returning()

    if (!exercise) {
      return { success: false, error: 'Ejercicio no encontrado' }
    }

    return { success: true, data: exercise }
  } catch (error) {
    // Handle unique constraint violation
    if (error instanceof Error && error.message.includes('unique')) {
      return { success: false, error: 'Ya existe un ejercicio con ese nombre' }
    }
    console.error('Error updating exercise:', error)
    return { success: false, error: 'Error al actualizar el ejercicio' }
  }
}

// Delete exercise
export async function deleteExercise(id: string): Promise<ExerciseMutationResult> {
  try {
    const [exercise] = await db
      .delete(exerciseDefinitions)
      .where(eq(exerciseDefinitions.id, id))
      .returning()

    if (!exercise) {
      return { success: false, error: 'Ejercicio no encontrado' }
    }

    return { success: true, data: exercise }
  } catch (error) {
    console.error('Error deleting exercise:', error)
    return { success: false, error: 'Error al eliminar el ejercicio' }
  }
}

// Check if exercises table is empty
export async function isExercisesTableEmpty(): Promise<boolean> {
  const [result] = await db
    .select({ count: sql<number>`count(*)` })
    .from(exerciseDefinitions)

  return result.count === 0
}

// Seed default exercises
export async function seedDefaultExercises(force: boolean = false): Promise<ExerciseMutationResult> {
  try {
    // Check if table is empty (unless force is true)
    if (!force) {
      const isEmpty = await isExercisesTableEmpty()
      if (!isEmpty) {
        return { success: false, error: 'La tabla de ejercicios no está vacía. Usa la opción forzar para sobrescribir.' }
      }
    }

    // If force, delete all existing exercises first
    if (force) {
      await db.delete(exerciseDefinitions)
    }

    // Insert all default exercises
    const insertData = DEFAULT_EXERCISES.map(exercise => ({
      name: exercise.name,
      category: exercise.category,
      trackingMode: exercise.trackingMode,
      requiredEquipment: exercise.requiredEquipment,
      setsDefault: exercise.setsDefault,
      repsDefault: exercise.repsDefault,
      timeSecDefault: exercise.timeSecDefault,
      restSecDefault: exercise.restSecDefault,
      notes: exercise.notes
    }))

    await db.insert(exerciseDefinitions).values(insertData)

    return { success: true }
  } catch (error) {
    console.error('Error seeding exercises:', error)
    return { success: false, error: 'Error al sembrar ejercicios por defecto' }
  }
}
