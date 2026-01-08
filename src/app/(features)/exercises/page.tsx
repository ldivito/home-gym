'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { ExerciseList, SeedExercisesButton } from '@/features/exercises/components'

export default function ExercisesPage() {
  return (
    <div className="container mx-auto py-6 px-4 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Biblioteca de Ejercicios</h1>
          <p className="text-muted-foreground">
            Administrá tu colección de ejercicios
          </p>
        </div>
        <div className="flex gap-2">
          <SeedExercisesButton />
          <Button asChild>
            <Link href="/exercises/new">
              <Plus className="size-4 mr-2" />
              Nuevo ejercicio
            </Link>
          </Button>
        </div>
      </div>

      {/* Exercise List */}
      <ExerciseList />
    </div>
  )
}
