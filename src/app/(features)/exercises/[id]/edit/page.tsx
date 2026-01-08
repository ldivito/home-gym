'use client'

import { use } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, AlertCircle } from 'lucide-react'
import { useExercise } from '@/features/exercises/hooks'
import { ExerciseForm } from '@/features/exercises/components'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

interface EditExercisePageProps {
  params: Promise<{ id: string }>
}

function EditExerciseSkeleton() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-10" />
            <Skeleton className="h-10" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            {Array.from({ length: 9 }).map((_, i) => (
              <Skeleton key={i} className="h-6" />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function EditExercisePage({ params }: EditExercisePageProps) {
  const { id } = use(params)
  const { data: exercise, isLoading, error } = useExercise(id)

  if (isLoading) {
    return (
      <div className="container mx-auto py-6 px-4 max-w-3xl">
        <Button variant="ghost" size="sm" asChild className="mb-4 -ml-2">
          <Link href="/exercises">
            <ArrowLeft className="size-4 mr-1" />
            Volver
          </Link>
        </Button>
        <Skeleton className="h-8 w-48 mb-6" />
        <EditExerciseSkeleton />
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
      <Button variant="ghost" size="sm" asChild className="mb-4 -ml-2">
        <Link href={`/exercises/${id}`}>
          <ArrowLeft className="size-4 mr-1" />
          Volver
        </Link>
      </Button>

      <h1 className="text-2xl font-bold mb-6">Editar Ejercicio</h1>

      <ExerciseForm exercise={exercise} mode="edit" />
    </div>
  )
}
