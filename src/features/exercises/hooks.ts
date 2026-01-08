'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getExercises,
  getExerciseById,
  createExercise,
  updateExercise,
  deleteExercise,
  seedDefaultExercises,
  isExercisesTableEmpty
} from './actions'
import type { ExerciseFilters, ExerciseFormData } from './types'

// Query keys
export const exerciseKeys = {
  all: ['exercises'] as const,
  lists: () => [...exerciseKeys.all, 'list'] as const,
  list: (filters?: ExerciseFilters) => [...exerciseKeys.lists(), filters] as const,
  details: () => [...exerciseKeys.all, 'detail'] as const,
  detail: (id: string) => [...exerciseKeys.details(), id] as const,
  isEmpty: () => [...exerciseKeys.all, 'isEmpty'] as const,
}

// Hook to get exercises list with filters
export function useExercises(filters?: ExerciseFilters) {
  return useQuery({
    queryKey: exerciseKeys.list(filters),
    queryFn: () => getExercises(filters),
  })
}

// Hook to get single exercise by ID
export function useExercise(id: string) {
  return useQuery({
    queryKey: exerciseKeys.detail(id),
    queryFn: () => getExerciseById(id),
    enabled: !!id,
  })
}

// Hook to check if exercises table is empty
export function useIsExercisesEmpty() {
  return useQuery({
    queryKey: exerciseKeys.isEmpty(),
    queryFn: () => isExercisesTableEmpty(),
  })
}

// Hook to create exercise
export function useCreateExercise() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: ExerciseFormData) => createExercise(data),
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: exerciseKeys.lists() })
        queryClient.invalidateQueries({ queryKey: exerciseKeys.isEmpty() })
      }
    },
  })
}

// Hook to update exercise
export function useUpdateExercise() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ExerciseFormData }) =>
      updateExercise(id, data),
    onSuccess: (result, { id }) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: exerciseKeys.lists() })
        queryClient.invalidateQueries({ queryKey: exerciseKeys.detail(id) })
      }
    },
  })
}

// Hook to delete exercise
export function useDeleteExercise() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteExercise(id),
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: exerciseKeys.lists() })
        queryClient.invalidateQueries({ queryKey: exerciseKeys.isEmpty() })
      }
    },
  })
}

// Hook to seed default exercises
export function useSeedExercises() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (force: boolean = false) => seedDefaultExercises(force),
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: exerciseKeys.all })
      }
    },
  })
}
