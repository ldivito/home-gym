'use client'

import { use } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, AlertCircle } from 'lucide-react'
import { useExercise } from '@/features/exercises/hooks'
import { ExerciseDetail, ExerciseDetailSkeleton } from '@/features/exercises/components'

interface ExerciseDetailPageProps {
  params: Promise<{ id: string }>
}

export default function ExerciseDetailPage({ params }: ExerciseDetailPageProps) {
  const { id } = use(params)
  const { data: exercise, isLoading, error } = useExercise(id)

  if (isLoading) {
    return (
      <div className="container mx-auto py-6 px-4 max-w-3xl">
        <ExerciseDetailSkeleton />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-6 px-4 max-w-3xl">
        <div className="text-center py-12">
          <AlertCircle className="size-12 mx-auto text-destructive mb-4" />
          <h1 className="text-xl font-semibold mb-2">Error</h1>
          <p className="text-muted-foreground mb-4">{error.message}</p>
          <Button asChild>
            <Link href="/exercises">Volver a ejercicios</Link>
          </Button>
        </div>
      </div>
    )
  }

  if (!exercise) {
    return (
      <div className="container mx-auto py-6 px-4 max-w-3xl">
        <div className="text-center py-12">
          <AlertCircle className="size-12 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-xl font-semibold mb-2">Ejercicio no encontrado</h1>
          <p className="text-muted-foreground mb-4">
            El ejercicio que buscás no existe o fue eliminado.
          </p>
          <Button asChild>
            <Link href="/exercises">
              <ArrowLeft className="size-4 mr-2" />
              Volver a ejercicios
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 px-4 max-w-3xl">
      <ExerciseDetail exercise={exercise} />
    </div>
  )
}
