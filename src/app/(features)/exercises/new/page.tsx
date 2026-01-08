'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { ExerciseForm } from '@/features/exercises/components'

export default function NewExercisePage() {
  return (
    <div className="container mx-auto py-6 px-4 max-w-3xl">
      <Button variant="ghost" size="sm" asChild className="mb-4 -ml-2">
        <Link href="/exercises">
          <ArrowLeft className="size-4 mr-1" />
          Volver
        </Link>
      </Button>

      <h1 className="text-2xl font-bold mb-6">Nuevo Ejercicio</h1>

      <ExerciseForm mode="create" />
    </div>
  )
}
