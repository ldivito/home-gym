'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'
import { useCreateExercise, useUpdateExercise } from '../hooks'
import {
  CATEGORIES,
  CATEGORY_LABELS,
  TRACKING_MODES,
  TRACKING_MODE_LABELS,
  EQUIPMENT_TYPES,
  EQUIPMENT_LABELS,
  DEFAULT_EXERCISE_FORM,
} from '../constants'
import type { ExerciseFormData, ExerciseDefinition, ExerciseCategory, ExerciseTrackingMode, EquipmentType } from '../types'

interface ExerciseFormProps {
  exercise?: ExerciseDefinition
  mode: 'create' | 'edit'
}

export function ExerciseForm({ exercise, mode }: ExerciseFormProps) {
  const router = useRouter()
  const createMutation = useCreateExercise()
  const updateMutation = useUpdateExercise()

  const [formData, setFormData] = useState<ExerciseFormData>(() => {
    if (exercise) {
      return {
        name: exercise.name,
        category: exercise.category as ExerciseCategory,
        trackingMode: exercise.trackingMode as ExerciseTrackingMode,
        requiredEquipment: exercise.requiredEquipment as EquipmentType[],
        setsDefault: exercise.setsDefault,
        repsDefault: exercise.repsDefault,
        timeSecDefault: exercise.timeSecDefault,
        restSecDefault: exercise.restSecDefault,
        notes: exercise.notes,
      }
    }
    return DEFAULT_EXERCISE_FORM
  })

  const [error, setError] = useState<string | null>(null)

  const handleEquipmentToggle = (equipment: EquipmentType) => {
    setFormData((prev) => ({
      ...prev,
      requiredEquipment: prev.requiredEquipment.includes(equipment)
        ? prev.requiredEquipment.filter((e) => e !== equipment)
        : [...prev.requiredEquipment, equipment],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    try {
      if (mode === 'create') {
        const result = await createMutation.mutateAsync(formData)
        if (!result.success) {
          setError(result.error || 'Error al crear el ejercicio')
          return
        }
        router.push('/exercises')
      } else if (exercise) {
        const result = await updateMutation.mutateAsync({
          id: exercise.id,
          data: formData,
        })
        if (!result.success) {
          setError(result.error || 'Error al actualizar el ejercicio')
          return
        }
        router.push(`/exercises/${exercise.id}`)
      }
    } catch (err) {
      setError('Error inesperado')
      console.error(err)
    }
  }

  const isPending = createMutation.isPending || updateMutation.isPending

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
          {error}
        </div>
      )}

      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle>Información básica</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ej: Press Banca"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Categoría *</Label>
              <Select
                value={formData.category}
                onValueChange={(value: ExerciseCategory) =>
                  setFormData({ ...formData, category: value })
                }
              >
                <SelectTrigger id="category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {CATEGORY_LABELS[category]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="trackingMode">Modo de tracking *</Label>
              <Select
                value={formData.trackingMode}
                onValueChange={(value: ExerciseTrackingMode) =>
                  setFormData({ ...formData, trackingMode: value })
                }
              >
                <SelectTrigger id="trackingMode">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TRACKING_MODES.map((mode) => (
                    <SelectItem key={mode} value={mode}>
                      {TRACKING_MODE_LABELS[mode]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Equipment */}
      <Card>
        <CardHeader>
          <CardTitle>Equipamiento requerido</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {EQUIPMENT_TYPES.map((equipment) => (
              <div key={equipment} className="flex items-center gap-2">
                <Checkbox
                  id={`equipment-${equipment}`}
                  checked={formData.requiredEquipment.includes(equipment)}
                  onCheckedChange={() => handleEquipmentToggle(equipment)}
                />
                <Label
                  htmlFor={`equipment-${equipment}`}
                  className="text-sm font-normal cursor-pointer"
                >
                  {EQUIPMENT_LABELS[equipment]}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Defaults */}
      <Card>
        <CardHeader>
          <CardTitle>Valores por defecto</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="setsDefault">Series</Label>
              <Input
                id="setsDefault"
                type="number"
                min="1"
                value={formData.setsDefault ?? ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    setsDefault: e.target.value ? parseInt(e.target.value) : null,
                  })
                }
                placeholder="3"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="repsDefault">Repeticiones</Label>
              <Input
                id="repsDefault"
                type="number"
                min="0"
                value={formData.repsDefault ?? ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    repsDefault: e.target.value ? parseInt(e.target.value) : null,
                  })
                }
                placeholder="10"
                disabled={formData.trackingMode === 'time'}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="timeSecDefault">Tiempo (seg)</Label>
              <Input
                id="timeSecDefault"
                type="number"
                min="0"
                value={formData.timeSecDefault ?? ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    timeSecDefault: e.target.value ? parseInt(e.target.value) : null,
                  })
                }
                placeholder="45"
                disabled={formData.trackingMode === 'reps'}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="restSecDefault">Descanso (seg)</Label>
              <Input
                id="restSecDefault"
                type="number"
                min="0"
                value={formData.restSecDefault ?? ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    restSecDefault: e.target.value ? parseInt(e.target.value) : null,
                  })
                }
                placeholder="60"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Notas</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={formData.notes ?? ''}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value || null })}
            placeholder="Instrucciones, tips, variantes..."
            rows={3}
          />
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-3 justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isPending}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 className="size-4 mr-2 animate-spin" />}
          {mode === 'create' ? 'Crear ejercicio' : 'Guardar cambios'}
        </Button>
      </div>
    </form>
  )
}
