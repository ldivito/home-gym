'use client'

import { useState, useCallback } from 'react'
import { useExercises, useDeleteExercise } from '../hooks'
import { ExerciseFiltersComponent } from './exercise-filters'
import { ExerciseCard } from './exercise-card'
import { ExerciseListSkeleton } from './exercise-skeleton'
import { DeleteExerciseDialog } from './delete-exercise-dialog'
import { Button } from '@/components/ui/button'
import { Dumbbell, Plus } from 'lucide-react'
import Link from 'next/link'
import type { ExerciseFilters } from '../types'

export function ExerciseList() {
  const [filters, setFilters] = useState<ExerciseFilters>({})
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const { data, isLoading, error } = useExercises(filters)
  const deleteMutation = useDeleteExercise()

  const handleFiltersChange = useCallback((newFilters: ExerciseFilters) => {
    setFilters(newFilters)
  }, [])

  const handleDelete = useCallback((id: string) => {
    setDeleteId(id)
  }, [])

  const confirmDelete = useCallback(async () => {
    if (deleteId) {
      await deleteMutation.mutateAsync(deleteId)
      setDeleteId(null)
    }
  }, [deleteId, deleteMutation])

  const cancelDelete = useCallback(() => {
    setDeleteId(null)
  }, [])

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">Error al cargar ejercicios</p>
        <p className="text-muted-foreground text-sm mt-1">{error.message}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with filters */}
      <ExerciseFiltersComponent filters={filters} onFiltersChange={handleFiltersChange} />

      {/* Loading state */}
      {isLoading && <ExerciseListSkeleton />}

      {/* Empty state */}
      {!isLoading && data?.exercises.length === 0 && (
        <div className="text-center py-16 border rounded-lg bg-muted/30">
          <Dumbbell className="size-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No hay ejercicios</h3>
          {filters.search || filters.categories?.length || filters.trackingModes?.length || filters.equipment?.length ? (
            <p className="text-muted-foreground mb-4">
              No se encontraron ejercicios con los filtros aplicados.
            </p>
          ) : (
            <p className="text-muted-foreground mb-4">
              Empezá agregando tu primer ejercicio a la biblioteca.
            </p>
          )}
          <Button asChild>
            <Link href="/exercises/new">
              <Plus className="size-4 mr-2" />
              Nuevo ejercicio
            </Link>
          </Button>
        </div>
      )}

      {/* Exercise grid */}
      {!isLoading && data && data.exercises.length > 0 && (
        <>
          <p className="text-sm text-muted-foreground">
            {data.total} ejercicio{data.total !== 1 ? 's' : ''}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.exercises.map((exercise) => (
              <ExerciseCard
                key={exercise.id}
                exercise={exercise}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </>
      )}

      {/* Delete confirmation dialog */}
      <DeleteExerciseDialog
        isOpen={!!deleteId}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        isDeleting={deleteMutation.isPending}
      />
    </div>
  )
}
