'use client'

import { useState, useEffect, useCallback } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search, X, SlidersHorizontal } from 'lucide-react'
import {
  CATEGORIES,
  CATEGORY_LABELS,
  TRACKING_MODES,
  TRACKING_MODE_LABELS,
  EQUIPMENT_TYPES,
  EQUIPMENT_LABELS,
} from '../constants'
import type { ExerciseFilters, ExerciseCategory, ExerciseTrackingMode, EquipmentType } from '../types'

interface ExerciseFiltersProps {
  filters: ExerciseFilters
  onFiltersChange: (filters: ExerciseFilters) => void
}

export function ExerciseFiltersComponent({ filters, onFiltersChange }: ExerciseFiltersProps) {
  const [search, setSearch] = useState(filters.search || '')
  const [showFilters, setShowFilters] = useState(false)

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (search !== filters.search) {
        onFiltersChange({ ...filters, search })
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [search, filters, onFiltersChange])

  const handleCategoryToggle = useCallback((category: ExerciseCategory) => {
    const current = filters.categories || []
    const updated = current.includes(category)
      ? current.filter(c => c !== category)
      : [...current, category]
    onFiltersChange({ ...filters, categories: updated.length > 0 ? updated : undefined })
  }, [filters, onFiltersChange])

  const handleTrackingModeToggle = useCallback((mode: ExerciseTrackingMode) => {
    const current = filters.trackingModes || []
    const updated = current.includes(mode)
      ? current.filter(m => m !== mode)
      : [...current, mode]
    onFiltersChange({ ...filters, trackingModes: updated.length > 0 ? updated : undefined })
  }, [filters, onFiltersChange])

  const handleEquipmentToggle = useCallback((equipment: EquipmentType) => {
    const current = filters.equipment || []
    const updated = current.includes(equipment)
      ? current.filter(e => e !== equipment)
      : [...current, equipment]
    onFiltersChange({ ...filters, equipment: updated.length > 0 ? updated : undefined })
  }, [filters, onFiltersChange])

  const handleSortChange = useCallback((value: string) => {
    const [sortBy, sortOrder] = value.split('-') as ['name' | 'createdAt', 'asc' | 'desc']
    onFiltersChange({ ...filters, sortBy, sortOrder })
  }, [filters, onFiltersChange])

  const clearFilters = useCallback(() => {
    setSearch('')
    onFiltersChange({})
  }, [onFiltersChange])

  const hasActiveFilters = search || filters.categories?.length || filters.trackingModes?.length || filters.equipment?.length

  const sortValue = `${filters.sortBy || 'name'}-${filters.sortOrder || 'asc'}`

  return (
    <div className="space-y-4">
      {/* Search and Sort Row */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Buscar ejercicios..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
        <div className="flex gap-2">
          <Select value={sortValue} onValueChange={handleSortChange}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Ordenar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name-asc">A-Z</SelectItem>
              <SelectItem value="name-desc">Z-A</SelectItem>
              <SelectItem value="createdAt-desc">Recientes</SelectItem>
              <SelectItem value="createdAt-asc">Antiguos</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant={showFilters ? 'secondary' : 'outline'}
            size="icon"
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal className="size-4" />
          </Button>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Limpiar
            </Button>
          )}
        </div>
      </div>

      {/* Expandable Filters */}
      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 bg-muted/50 rounded-lg">
          {/* Categories */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Categoría</Label>
            <div className="space-y-2">
              {CATEGORIES.map((category) => (
                <div key={category} className="flex items-center gap-2">
                  <Checkbox
                    id={`category-${category}`}
                    checked={filters.categories?.includes(category) ?? false}
                    onCheckedChange={() => handleCategoryToggle(category)}
                  />
                  <Label
                    htmlFor={`category-${category}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {CATEGORY_LABELS[category]}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Tracking Mode */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Modo de tracking</Label>
            <div className="space-y-2">
              {TRACKING_MODES.map((mode) => (
                <div key={mode} className="flex items-center gap-2">
                  <Checkbox
                    id={`mode-${mode}`}
                    checked={filters.trackingModes?.includes(mode) ?? false}
                    onCheckedChange={() => handleTrackingModeToggle(mode)}
                  />
                  <Label
                    htmlFor={`mode-${mode}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {TRACKING_MODE_LABELS[mode]}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Equipment */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Equipamiento</Label>
            <div className="grid grid-cols-2 gap-2">
              {EQUIPMENT_TYPES.map((equipment) => (
                <div key={equipment} className="flex items-center gap-2">
                  <Checkbox
                    id={`equipment-${equipment}`}
                    checked={filters.equipment?.includes(equipment) ?? false}
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
          </div>
        </div>
      )}
    </div>
  )
}
