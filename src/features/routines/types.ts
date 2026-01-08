import type {
  RoutineTemplate,
  RoutineTemplateItem,
  BlockType,
} from "@/db/schema";

// Re-export from schema
export type { RoutineTemplate, RoutineTemplateItem, BlockType };

// Routine with items
export interface RoutineWithItems extends RoutineTemplate {
  items: RoutineTemplateItem[];
}

// Form data for creating/updating a routine
export interface RoutineFormData {
  name: string;
  description?: string;
}

// Form data for creating/updating an item
export interface RoutineItemFormData {
  exerciseName: string;
  blockType?: BlockType;
  setsPlanned: number;
  repsPlanned?: number;
  timeSecPlanned?: number;
  restSecPlanned?: number;
  targetLoadKg?: number;
  notes?: string;
}

// Item with temporary ID for client-side management
export interface RoutineItemWithTempId extends RoutineItemFormData {
  id?: string;
  tempId: string;
  order: number;
}

// Sort options for routine list
export type RoutineSortOption = "name-asc" | "name-desc" | "recent" | "oldest";

// Block type display info
export const BLOCK_TYPE_OPTIONS: {
  value: BlockType;
  label: string;
  color: string;
}[] = [
  { value: "warmup", label: "Warm-up", color: "bg-orange-500/20 text-orange-400" },
  { value: "main", label: "Main", color: "bg-blue-500/20 text-blue-400" },
  { value: "accessory", label: "Accessory", color: "bg-purple-500/20 text-purple-400" },
  { value: "cardio", label: "Cardio", color: "bg-green-500/20 text-green-400" },
  { value: "cooldown", label: "Cool-down", color: "bg-cyan-500/20 text-cyan-400" },
];

export function getBlockTypeInfo(blockType?: BlockType | null) {
  if (!blockType) return null;
  return BLOCK_TYPE_OPTIONS.find((opt) => opt.value === blockType) ?? null;
}
