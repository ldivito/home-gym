"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { useAddExercise } from "../hooks";

interface AddExerciseFormProps {
  sessionId: string;
}

export function AddExerciseForm({ sessionId }: AddExerciseFormProps) {
  const [name, setName] = useState("");
  const [trackingMode, setTrackingMode] = useState<"reps" | "time" | "both">(
    "reps"
  );
  const addExercise = useAddExercise();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addExercise.mutate(
      { sessionId, name: name.trim(), trackingMode },
      {
        onSuccess: () => {
          setName("");
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 items-end">
      <div className="flex-1">
        <label className="text-sm font-medium mb-1 block">Exercise name</label>
        <Input
          type="text"
          placeholder="e.g. Bench Press"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={addExercise.isPending}
        />
      </div>
      <div>
        <label className="text-sm font-medium mb-1 block">Track</label>
        <select
          value={trackingMode}
          onChange={(e) =>
            setTrackingMode(e.target.value as "reps" | "time" | "both")
          }
          className="h-9 rounded-md border bg-background px-3 text-sm"
          disabled={addExercise.isPending}
        >
          <option value="reps">Reps</option>
          <option value="time">Time</option>
          <option value="both">Both</option>
        </select>
      </div>
      <Button type="submit" disabled={!name.trim() || addExercise.isPending}>
        <Plus className="size-4" />
        Add
      </Button>
    </form>
  );
}
