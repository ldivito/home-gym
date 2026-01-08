"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChevronUp,
  ChevronDown,
  Trash2,
  Plus,
  Check,
  X,
  GripVertical,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { WorkoutExerciseWithSets, WorkoutSet } from "@/db/schema";
import {
  useToggleExerciseComplete,
  useDeleteExercise,
  useReorderExercise,
  useAddSet,
  useUpdateSet,
  useDeleteSet,
} from "../hooks";

interface ExerciseCardProps {
  exercise: WorkoutExerciseWithSets;
  sessionId: string;
  isFirst: boolean;
  isLast: boolean;
}

export function ExerciseCard({
  exercise,
  sessionId,
  isFirst,
  isLast,
}: ExerciseCardProps) {
  const toggleComplete = useToggleExerciseComplete();
  const deleteExercise = useDeleteExercise();
  const reorderExercise = useReorderExercise();
  const addSet = useAddSet();

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleToggleComplete = () => {
    toggleComplete.mutate({ id: exercise.id, sessionId });
  };

  const handleDelete = () => {
    deleteExercise.mutate({ id: exercise.id, sessionId });
    setShowDeleteConfirm(false);
  };

  const handleReorder = (direction: "up" | "down") => {
    reorderExercise.mutate({ id: exercise.id, sessionId, direction });
  };

  const handleAddSet = () => {
    addSet.mutate({ exerciseId: exercise.id, sessionId });
  };

  const isCompleted = !!exercise.completedAt;

  return (
    <Card className={cn(isCompleted && "opacity-60")}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GripVertical className="size-4 text-muted-foreground" />
            <div className="flex flex-col">
              <CardTitle
                className={cn("text-lg", isCompleted && "line-through")}
              >
                {exercise.name}
              </CardTitle>
              <span className="text-xs text-muted-foreground capitalize">
                {exercise.trackingMode === "both"
                  ? "reps + time"
                  : exercise.trackingMode}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => handleReorder("up")}
              disabled={isFirst}
            >
              <ChevronUp className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => handleReorder("down")}
              disabled={isLast}
            >
              <ChevronDown className="size-4" />
            </Button>
            <Button
              variant={isCompleted ? "secondary" : "outline"}
              size="icon-sm"
              onClick={handleToggleComplete}
            >
              <Check className="size-4" />
            </Button>
            {!showDeleteConfirm ? (
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => setShowDeleteConfirm(true)}
              >
                <Trash2 className="size-4 text-destructive" />
              </Button>
            ) : (
              <div className="flex gap-1">
                <Button
                  variant="destructive"
                  size="icon-sm"
                  onClick={handleDelete}
                >
                  <Check className="size-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon-sm"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  <X className="size-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {exercise.sets.length > 0 && (
            <div className="space-y-1">
              <div className="grid grid-cols-12 gap-2 text-xs text-muted-foreground font-medium px-2">
                <div className="col-span-1">#</div>
                {(exercise.trackingMode === "reps" ||
                  exercise.trackingMode === "both") && (
                  <div className="col-span-2">Reps</div>
                )}
                {(exercise.trackingMode === "time" ||
                  exercise.trackingMode === "both") && (
                  <div className="col-span-2">Time(s)</div>
                )}
                <div className="col-span-2">Load(kg)</div>
                <div className="col-span-2">RPE</div>
                <div className="col-span-2">Notes</div>
                <div className="col-span-1"></div>
              </div>
              {exercise.sets.map((set, index) => (
                <SetRow
                  key={set.id}
                  set={set}
                  index={index}
                  sessionId={sessionId}
                  trackingMode={exercise.trackingMode}
                />
              ))}
            </div>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handleAddSet}
            className="w-full"
            disabled={addSet.isPending}
          >
            <Plus className="size-4" />
            Add Set
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

interface SetRowProps {
  set: WorkoutSet;
  index: number;
  sessionId: string;
  trackingMode: "reps" | "time" | "both";
}

function SetRow({ set, index, sessionId, trackingMode }: SetRowProps) {
  const updateSet = useUpdateSet();
  const deleteSet = useDeleteSet();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleUpdate = (field: string, value: string) => {
    const data: Record<string, number | string | null> = {};

    if (field === "repsActual" || field === "timeSecActual") {
      data[field] = value ? parseInt(value, 10) : null;
    } else {
      data[field] = value || null;
    }

    updateSet.mutate({ id: set.id, sessionId, data });
  };

  const handleDelete = () => {
    deleteSet.mutate({ id: set.id, sessionId });
    setShowDeleteConfirm(false);
  };

  return (
    <div className="grid grid-cols-12 gap-2 items-center text-sm">
      <div className="col-span-1 text-muted-foreground">{index + 1}</div>
      {(trackingMode === "reps" || trackingMode === "both") && (
        <div className="col-span-2">
          <Input
            type="number"
            className="h-8 text-xs"
            placeholder="0"
            defaultValue={set.repsActual ?? ""}
            onBlur={(e) => handleUpdate("repsActual", e.target.value)}
          />
        </div>
      )}
      {(trackingMode === "time" || trackingMode === "both") && (
        <div className="col-span-2">
          <Input
            type="number"
            className="h-8 text-xs"
            placeholder="0"
            defaultValue={set.timeSecActual ?? ""}
            onBlur={(e) => handleUpdate("timeSecActual", e.target.value)}
          />
        </div>
      )}
      <div className="col-span-2">
        <Input
          type="number"
          step="0.5"
          className="h-8 text-xs"
          placeholder="0"
          defaultValue={set.loadKgActual ?? ""}
          onBlur={(e) => handleUpdate("loadKgActual", e.target.value)}
        />
      </div>
      <div className="col-span-2">
        <Input
          type="number"
          step="0.5"
          min="1"
          max="10"
          className="h-8 text-xs"
          placeholder="1-10"
          defaultValue={set.rpe ?? ""}
          onBlur={(e) => handleUpdate("rpe", e.target.value)}
        />
      </div>
      <div className="col-span-2">
        <Input
          type="text"
          className="h-8 text-xs"
          placeholder=""
          defaultValue={set.notes ?? ""}
          onBlur={(e) => handleUpdate("notes", e.target.value)}
        />
      </div>
      <div className="col-span-1">
        {!showDeleteConfirm ? (
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setShowDeleteConfirm(true)}
          >
            <Trash2 className="size-3 text-destructive" />
          </Button>
        ) : (
          <div className="flex gap-0.5">
            <Button
              variant="destructive"
              size="icon-sm"
              className="size-6"
              onClick={handleDelete}
            >
              <Check className="size-3" />
            </Button>
            <Button
              variant="outline"
              size="icon-sm"
              className="size-6"
              onClick={() => setShowDeleteConfirm(false)}
            >
              <X className="size-3" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
