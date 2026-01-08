"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { ExerciseAutocomplete } from "./exercise-autocomplete";
import { BLOCK_TYPE_OPTIONS, type RoutineItemFormData, type BlockType } from "../types";

interface AddItemFormProps {
  onAdd: (data: RoutineItemFormData) => void;
  suggestions: string[];
  isLoading?: boolean;
}

const BLOCK_OPTIONS = [
  { value: "", label: "No block" },
  ...BLOCK_TYPE_OPTIONS.map((opt) => ({ value: opt.value, label: opt.label })),
];

export function AddItemForm({ onAdd, suggestions, isLoading }: AddItemFormProps) {
  const [exerciseName, setExerciseName] = useState("");
  const [blockType, setBlockType] = useState<BlockType | "">("");
  const [setsPlanned, setSetsPlanned] = useState("3");
  const [repsPlanned, setRepsPlanned] = useState("10");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!exerciseName.trim()) return;

    const sets = parseInt(setsPlanned) || 1;
    const reps = parseInt(repsPlanned) || undefined;

    onAdd({
      exerciseName: exerciseName.trim(),
      blockType: blockType || undefined,
      setsPlanned: Math.max(1, sets),
      repsPlanned: reps,
    });

    setExerciseName("");
    // Keep block type and sets/reps for quick successive adds
  };

  const canSubmit = exerciseName.trim().length > 0 && !isLoading;

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex gap-2">
        <ExerciseAutocomplete
          value={exerciseName}
          onChange={setExerciseName}
          suggestions={suggestions}
          placeholder="Exercise name *"
          className="flex-1"
        />
        <Select
          value={blockType}
          onChange={(e) => setBlockType(e.target.value as BlockType | "")}
          options={BLOCK_OPTIONS}
          className="w-32"
        />
      </div>
      <div className="flex gap-2 items-center">
        <div className="flex items-center gap-1">
          <Input
            type="number"
            min="1"
            value={setsPlanned}
            onChange={(e) => setSetsPlanned(e.target.value)}
            className="w-16 text-center"
            placeholder="Sets"
          />
          <span className="text-muted-foreground text-sm">sets</span>
        </div>
        <span className="text-muted-foreground">×</span>
        <div className="flex items-center gap-1">
          <Input
            type="number"
            min="0"
            value={repsPlanned}
            onChange={(e) => setRepsPlanned(e.target.value)}
            className="w-16 text-center"
            placeholder="Reps"
          />
          <span className="text-muted-foreground text-sm">reps</span>
        </div>
        <div className="flex-1" />
        <Button type="submit" disabled={!canSubmit} size="sm">
          <Plus className="h-4 w-4 mr-1" />
          Add
        </Button>
      </div>
    </form>
  );
}
