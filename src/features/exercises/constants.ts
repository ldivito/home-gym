import type { ExerciseCategory, ExerciseTrackingMode, EquipmentType, ExerciseFormData } from './types'

// Category display labels
export const CATEGORY_LABELS: Record<ExerciseCategory, string> = {
  strength: 'Fuerza',
  cardio: 'Cardio',
  core: 'Core',
  mobility: 'Movilidad'
}

// Tracking mode display labels
export const TRACKING_MODE_LABELS: Record<ExerciseTrackingMode, string> = {
  reps: 'Repeticiones',
  time: 'Tiempo',
  both: 'Ambos'
}

// Equipment display labels
export const EQUIPMENT_LABELS: Record<EquipmentType, string> = {
  bench: 'Banco',
  rack: 'Rack',
  barbell: 'Barra',
  dumbbells: 'Mancuernas',
  elliptical: 'Elíptica',
  sandbag: 'Sandbag',
  abwheel: 'Rueda abdominal',
  mat: 'Colchoneta',
  bodyweight: 'Peso corporal'
}

// All categories for filters
export const CATEGORIES: ExerciseCategory[] = ['strength', 'cardio', 'core', 'mobility']

// All tracking modes for filters
export const TRACKING_MODES: ExerciseTrackingMode[] = ['reps', 'time', 'both']

// All equipment types for filters
export const EQUIPMENT_TYPES: EquipmentType[] = [
  'bench',
  'rack',
  'barbell',
  'dumbbells',
  'elliptical',
  'sandbag',
  'abwheel',
  'mat',
  'bodyweight'
]

// Default exercise form values
export const DEFAULT_EXERCISE_FORM: ExerciseFormData = {
  name: '',
  category: 'strength',
  trackingMode: 'reps',
  requiredEquipment: [],
  setsDefault: 3,
  repsDefault: 10,
  timeSecDefault: null,
  restSecDefault: 60,
  notes: null
}

// Default exercises for seed
export const DEFAULT_EXERCISES: ExerciseFormData[] = [
  // Strength - Barbell
  {
    name: 'Press Banca',
    category: 'strength',
    trackingMode: 'reps',
    requiredEquipment: ['bench', 'barbell'],
    setsDefault: 4,
    repsDefault: 8,
    restSecDefault: 90,
    notes: 'Ejercicio principal para pectoral'
  },
  {
    name: 'Press Militar',
    category: 'strength',
    trackingMode: 'reps',
    requiredEquipment: ['rack', 'barbell'],
    setsDefault: 4,
    repsDefault: 8,
    restSecDefault: 90,
    notes: 'Press de hombros con barra'
  },
  {
    name: 'Remo con Barra',
    category: 'strength',
    trackingMode: 'reps',
    requiredEquipment: ['barbell'],
    setsDefault: 4,
    repsDefault: 10,
    restSecDefault: 90,
    notes: 'Remo inclinado para espalda'
  },
  {
    name: 'Peso Muerto',
    category: 'strength',
    trackingMode: 'reps',
    requiredEquipment: ['barbell'],
    setsDefault: 4,
    repsDefault: 6,
    restSecDefault: 120,
    notes: 'Ejercicio compuesto para posterior'
  },
  {
    name: 'Sentadilla',
    category: 'strength',
    trackingMode: 'reps',
    requiredEquipment: ['rack', 'barbell'],
    setsDefault: 4,
    repsDefault: 8,
    restSecDefault: 120,
    notes: 'Sentadilla trasera con barra'
  },
  {
    name: 'Peso Muerto Rumano',
    category: 'strength',
    trackingMode: 'reps',
    requiredEquipment: ['barbell'],
    setsDefault: 3,
    repsDefault: 10,
    restSecDefault: 90,
    notes: 'Variante para isquiotibiales'
  },
  // Strength - Dumbbells
  {
    name: 'Curl con Mancuernas',
    category: 'strength',
    trackingMode: 'reps',
    requiredEquipment: ['dumbbells'],
    setsDefault: 3,
    repsDefault: 12,
    restSecDefault: 60,
    notes: 'Curl de bíceps alternado'
  },
  {
    name: 'Extensión de Tríceps',
    category: 'strength',
    trackingMode: 'reps',
    requiredEquipment: ['dumbbells'],
    setsDefault: 3,
    repsDefault: 12,
    restSecDefault: 60,
    notes: 'Extensión overhead con mancuerna'
  },
  {
    name: 'Goblet Squat',
    category: 'strength',
    trackingMode: 'reps',
    requiredEquipment: ['dumbbells'],
    setsDefault: 3,
    repsDefault: 12,
    restSecDefault: 60,
    notes: 'Sentadilla con mancuerna frontal'
  },
  {
    name: 'Elevaciones Laterales',
    category: 'strength',
    trackingMode: 'reps',
    requiredEquipment: ['dumbbells'],
    setsDefault: 3,
    repsDefault: 15,
    restSecDefault: 45,
    notes: 'Aislamiento de deltoides lateral'
  },
  {
    name: 'Zancadas',
    category: 'strength',
    trackingMode: 'reps',
    requiredEquipment: ['dumbbells'],
    setsDefault: 3,
    repsDefault: 10,
    restSecDefault: 60,
    notes: 'Zancadas caminando con mancuernas'
  },
  {
    name: 'Press Inclinado con Mancuernas',
    category: 'strength',
    trackingMode: 'reps',
    requiredEquipment: ['bench', 'dumbbells'],
    setsDefault: 3,
    repsDefault: 10,
    restSecDefault: 90,
    notes: 'Press en banco inclinado'
  },
  {
    name: 'Remo con Mancuerna',
    category: 'strength',
    trackingMode: 'reps',
    requiredEquipment: ['bench', 'dumbbells'],
    setsDefault: 3,
    repsDefault: 10,
    restSecDefault: 60,
    notes: 'Remo unilateral apoyado'
  },
  // Strength - Sandbag
  {
    name: 'Clean con Sandbag',
    category: 'strength',
    trackingMode: 'reps',
    requiredEquipment: ['sandbag'],
    setsDefault: 4,
    repsDefault: 8,
    restSecDefault: 90,
    notes: 'Cargada de sandbag'
  },
  {
    name: 'Carry con Sandbag',
    category: 'strength',
    trackingMode: 'time',
    requiredEquipment: ['sandbag'],
    setsDefault: 3,
    timeSecDefault: 60,
    restSecDefault: 60,
    notes: 'Acarreo frontal de sandbag'
  },
  // Bodyweight
  {
    name: 'Flexiones',
    category: 'strength',
    trackingMode: 'reps',
    requiredEquipment: ['bodyweight'],
    setsDefault: 3,
    repsDefault: 15,
    restSecDefault: 60,
    notes: 'Push-ups clásicas'
  },
  {
    name: 'Dominadas',
    category: 'strength',
    trackingMode: 'reps',
    requiredEquipment: ['rack', 'bodyweight'],
    setsDefault: 3,
    repsDefault: 8,
    restSecDefault: 90,
    notes: 'Pull-ups en rack'
  },
  {
    name: 'Hip Hinge',
    category: 'mobility',
    trackingMode: 'reps',
    requiredEquipment: ['bodyweight'],
    setsDefault: 2,
    repsDefault: 10,
    restSecDefault: 30,
    notes: 'Patrón de bisagra de cadera'
  },
  // Core
  {
    name: 'Ab Wheel Rollout',
    category: 'core',
    trackingMode: 'reps',
    requiredEquipment: ['abwheel', 'mat'],
    setsDefault: 3,
    repsDefault: 10,
    restSecDefault: 60,
    notes: 'Rueda abdominal desde rodillas'
  },
  {
    name: 'Plancha',
    category: 'core',
    trackingMode: 'time',
    requiredEquipment: ['mat', 'bodyweight'],
    setsDefault: 3,
    timeSecDefault: 45,
    restSecDefault: 45,
    notes: 'Plancha frontal isométrica'
  },
  {
    name: 'Plancha Lateral',
    category: 'core',
    trackingMode: 'time',
    requiredEquipment: ['mat', 'bodyweight'],
    setsDefault: 3,
    timeSecDefault: 30,
    restSecDefault: 30,
    notes: 'Cada lado'
  },
  {
    name: 'Dead Bug',
    category: 'core',
    trackingMode: 'reps',
    requiredEquipment: ['mat', 'bodyweight'],
    setsDefault: 3,
    repsDefault: 10,
    restSecDefault: 45,
    notes: 'Alternando brazos y piernas'
  },
  {
    name: 'Bird Dog',
    category: 'core',
    trackingMode: 'reps',
    requiredEquipment: ['mat', 'bodyweight'],
    setsDefault: 3,
    repsDefault: 10,
    restSecDefault: 30,
    notes: 'Estabilización alternada'
  },
  // Cardio
  {
    name: 'Elíptica',
    category: 'cardio',
    trackingMode: 'time',
    requiredEquipment: ['elliptical'],
    setsDefault: 1,
    timeSecDefault: 1800,
    restSecDefault: 0,
    notes: 'Cardio de bajo impacto'
  },
  {
    name: 'Elíptica HIIT',
    category: 'cardio',
    trackingMode: 'both',
    requiredEquipment: ['elliptical'],
    setsDefault: 8,
    repsDefault: 1,
    timeSecDefault: 30,
    restSecDefault: 30,
    notes: 'Intervalos de alta intensidad'
  },
  {
    name: 'Burpees',
    category: 'cardio',
    trackingMode: 'reps',
    requiredEquipment: ['bodyweight'],
    setsDefault: 3,
    repsDefault: 10,
    restSecDefault: 60,
    notes: 'Ejercicio compuesto cardio'
  },
  // Mobility
  {
    name: 'Estiramiento de Cadera',
    category: 'mobility',
    trackingMode: 'time',
    requiredEquipment: ['mat', 'bodyweight'],
    setsDefault: 2,
    timeSecDefault: 60,
    restSecDefault: 15,
    notes: 'Hip flexor stretch cada lado'
  },
  {
    name: 'Cat-Cow',
    category: 'mobility',
    trackingMode: 'reps',
    requiredEquipment: ['mat', 'bodyweight'],
    setsDefault: 2,
    repsDefault: 10,
    restSecDefault: 15,
    notes: 'Movilidad de columna'
  },
  {
    name: 'World\'s Greatest Stretch',
    category: 'mobility',
    trackingMode: 'reps',
    requiredEquipment: ['mat', 'bodyweight'],
    setsDefault: 2,
    repsDefault: 5,
    restSecDefault: 15,
    notes: 'Cada lado, movilidad completa'
  }
]
