'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Database, Loader2 } from 'lucide-react'
import { useSeedExercises, useIsExercisesEmpty } from '../hooks'
import { DEFAULT_EXERCISES } from '../constants'

export function SeedExercisesButton() {
  const [open, setOpen] = useState(false)
  const [force, setForce] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const seedMutation = useSeedExercises()
  const { data: isEmpty } = useIsExercisesEmpty()

  // Only show in development
  const isDev = process.env.NODE_ENV === 'development'

  const handleSeed = async () => {
    setError(null)
    const result = await seedMutation.mutateAsync(force)
    if (result.success) {
      setOpen(false)
      setForce(false)
    } else {
      setError(result.error || 'Error al sembrar ejercicios')
    }
  }

  // If not dev and table is not empty, don't show
  if (!isDev && !isEmpty) {
    return null
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Database className="size-4 mr-2" />
          Seed ejercicios
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sembrar ejercicios por defecto</DialogTitle>
          <DialogDescription>
            Esto agregará {DEFAULT_EXERCISES.length} ejercicios predefinidos a tu
            biblioteca. Incluye ejercicios para fuerza, cardio, core y movilidad.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
            {error}
          </div>
        )}

        {!isEmpty && (
          <div className="flex items-start gap-2 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
            <Checkbox
              id="force"
              checked={force}
              onCheckedChange={(checked) => setForce(checked === true)}
            />
            <div className="grid gap-1.5 leading-none">
              <Label htmlFor="force" className="text-sm font-medium cursor-pointer">
                Reemplazar ejercicios existentes
              </Label>
              <p className="text-xs text-muted-foreground">
                Esto eliminará todos los ejercicios actuales y los reemplazará con
                los predefinidos.
              </p>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSeed} disabled={seedMutation.isPending || (!isEmpty && !force)}>
            {seedMutation.isPending && (
              <Loader2 className="size-4 mr-2 animate-spin" />
            )}
            {force ? 'Reemplazar' : 'Sembrar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
