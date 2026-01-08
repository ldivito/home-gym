'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Pencil, Trash2, ArrowLeft, Clock, Repeat, Timer, Coffee } from 'lucide-react'
import { useDeleteExercise } from '../hooks'
import { DeleteExerciseDialog } from './delete-exercise-dialog'
import { CATEGORY_LABELS, TRACKING_MODE_LABELS, EQUIPMENT_LABELS } from '../constants'
import type { ExerciseDefinition, ExerciseCategory, ExerciseTrackingMode, EquipmentType } from '../types'

interface ExerciseDetailProps {
  exercise: ExerciseDefinition
}

export function ExerciseDetail({ exercise }: ExerciseDetailProps) {
  const router = useRouter()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const deleteMutation = useDeleteExercise()

  const handleDelete = async () => {
    const result = await deleteMutation.mutateAsync(exercise.id)
    if (result.success) {
      router.push('/exercises')
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    if (mins > 0) {
      return `${mins}:${secs.toString().padStart(2, '0')}`
    }
    return `${secs}s`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <Button variant="ghost" size="sm" asChild className="mb-2 -ml-2">
            <Link href="/exercises">
              <ArrowLeft className="size-4 mr-1" />
              Volver
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">{exercise.name}</h1>
          <div className="flex flex-wrap gap-2 mt-2">
            <Badge variant="secondary">
              {CATEGORY_LABELS[exercise.category as ExerciseCategory]}
            </Badge>
            <Badge variant="outline">
              {TRACKING_MODE_LABELS[exercise.trackingMode as ExerciseTrackingMode]}
            </Badge>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/exercises/${exercise.id}/edit`}>
              <Pencil className="size-4 mr-2" />
              Editar
            </Link>
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowDeleteDialog(true)}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="size-4 mr-2" />
            Eliminar
          </Button>
        </div>
      </div>

      {/* Equipment */}
      {exercise.requiredEquipment.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Equipamiento requerido</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {exercise.requiredEquipment.map((eq) => (
                <Badge key={eq} variant="secondary">
                  {EQUIPMENT_LABELS[eq as EquipmentType]}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Defaults */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Valores por defecto</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {exercise.setsDefault && (
              <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                <Repeat className="size-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Series</p>
                  <p className="font-semibold">{exercise.setsDefault}</p>
                </div>
              </div>
            )}
            {exercise.repsDefault !== null && exercise.trackingMode !== 'time' && (
              <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                <Clock className="size-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Reps</p>
                  <p className="font-semibold">{exercise.repsDefault}</p>
                </div>
              </div>
            )}
            {exercise.timeSecDefault !== null && exercise.trackingMode !== 'reps' && (
              <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                <Timer className="size-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Tiempo</p>
                  <p className="font-semibold">{formatTime(exercise.timeSecDefault)}</p>
                </div>
              </div>
            )}
            {exercise.restSecDefault && (
              <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                <Coffee className="size-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Descanso</p>
                  <p className="font-semibold">{exercise.restSecDefault}s</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Notes */}
      {exercise.notes && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Notas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground whitespace-pre-wrap">{exercise.notes}</p>
          </CardContent>
        </Card>
      )}

      {/* Metadata */}
      <div className="text-sm text-muted-foreground">
        <p>Creado: {new Date(exercise.createdAt).toLocaleDateString('es-AR')}</p>
        <p>Actualizado: {new Date(exercise.updatedAt).toLocaleDateString('es-AR')}</p>
      </div>

      <DeleteExerciseDialog
        isOpen={showDeleteDialog}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteDialog(false)}
        isDeleting={deleteMutation.isPending}
      />
    </div>
  )
}
