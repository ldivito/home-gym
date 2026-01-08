'use client'

import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardAction } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Pencil, Trash2 } from 'lucide-react'
import { CATEGORY_LABELS, TRACKING_MODE_LABELS, EQUIPMENT_LABELS } from '../constants'
import type { ExerciseDefinition } from '../types'

interface ExerciseCardProps {
  exercise: ExerciseDefinition
  onDelete: (id: string) => void
}

export function ExerciseCard({ exercise, onDelete }: ExerciseCardProps) {
  const formatDefaults = () => {
    const parts = []
    if (exercise.setsDefault) {
      parts.push(`${exercise.setsDefault} series`)
    }
    if (exercise.repsDefault) {
      parts.push(`${exercise.repsDefault} reps`)
    }
    if (exercise.timeSecDefault) {
      const mins = Math.floor(exercise.timeSecDefault / 60)
      const secs = exercise.timeSecDefault % 60
      if (mins > 0) {
        parts.push(`${mins}:${secs.toString().padStart(2, '0')}`)
      } else {
        parts.push(`${secs}s`)
      }
    }
    if (exercise.restSecDefault) {
      parts.push(`${exercise.restSecDefault}s descanso`)
    }
    return parts.join(' · ')
  }

  return (
    <Card className="group">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <Link href={`/exercises/${exercise.id}`} className="flex-1">
            <CardTitle className="hover:text-primary transition-colors cursor-pointer">
              {exercise.name}
            </CardTitle>
          </Link>
          <CardAction className="opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex gap-1">
              <Button variant="ghost" size="icon-sm" asChild>
                <Link href={`/exercises/${exercise.id}/edit`}>
                  <Pencil className="size-4" />
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => onDelete(exercise.id)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          </CardAction>
        </div>
        <CardDescription className="flex flex-wrap gap-2 mt-2">
          <Badge variant="secondary">{CATEGORY_LABELS[exercise.category]}</Badge>
          <Badge variant="outline">{TRACKING_MODE_LABELS[exercise.trackingMode]}</Badge>
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Equipment */}
        {exercise.requiredEquipment.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {exercise.requiredEquipment.map((eq) => (
              <span
                key={eq}
                className="text-xs px-2 py-0.5 bg-muted rounded-full text-muted-foreground"
              >
                {EQUIPMENT_LABELS[eq]}
              </span>
            ))}
          </div>
        )}

        {/* Defaults */}
        {formatDefaults() && (
          <p className="text-sm text-muted-foreground">{formatDefaults()}</p>
        )}

        {/* Notes */}
        {exercise.notes && (
          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
            {exercise.notes}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
