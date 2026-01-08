import type { ExerciseDefinition, EquipmentType } from '@/db/schema/exercises'

// Re-export types from schema
export type { ExerciseDefinition, EquipmentType }

// Category type
export type ExerciseCategory = 'strength' | 'cardio' | 'core' | 'mobility'

// Tracking mode type
export type ExerciseTrackingMode = 'reps' | 'time' | 'both'

// Form data type for creating/updating exercises
export interface ExerciseFormData {
  name: string
  category: ExerciseCategory
  trackingMode: ExerciseTrackingMode
  requiredEquipment: EquipmentType[]
  setsDefault?: number | null
  repsDefault?: number | null
  timeSecDefault?: number | null
  restSecDefault?: number | null
  notes?: string | null
}

// Filters for listing exercises
export interface ExerciseFilters {
  search?: string
  categories?: ExerciseCategory[]
  trackingModes?: ExerciseTrackingMode[]
  equipment?: EquipmentType[]
  sortBy?: 'name' | 'createdAt'
  sortOrder?: 'asc' | 'desc'
}

// API response types
export interface ExerciseListResponse {
  exercises: ExerciseDefinition[]
  total: number
}

export interface ExerciseMutationResult {
  success: boolean
  data?: ExerciseDefinition
  error?: string
}
