"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AddItemForm } from "./add-item-form";
import { RoutineItemCard } from "./routine-item-card";
import { useExerciseSuggestions } from "../hooks";
import {
  useAddRoutineItem,
  useUpdateRoutineItem,
  useDeleteRoutineItem,
  useMoveRoutineItem,
} from "../hooks";
import type { RoutineTemplateItem, RoutineItemFormData } from "../types";
import { ListX } from "lucide-react";

interface RoutineBuilderProps {
  routineId: string;
  items: RoutineTemplateItem[];
}

export function RoutineBuilder({ routineId, items }: RoutineBuilderProps) {
  const addMutation = useAddRoutineItem();
  const updateMutation = useUpdateRoutineItem();
  const deleteMutation = useDeleteRoutineItem();
  const moveMutation = useMoveRoutineItem();

  // Get exercise names from current routine for autocomplete
  const currentExercises = items.map((item) => item.exerciseName);
  const { getSuggestions, addToRecent } = useExerciseSuggestions(currentExercises);

  const handleAddItem = (data: RoutineItemFormData) => {
    addMutation.mutate({ routineId, data });
    addToRecent(data.exerciseName);
  };

  const handleUpdateItem = (itemId: string, data: Partial<RoutineItemFormData>) => {
    updateMutation.mutate({ routineId, itemId, data });
    if (data.exerciseName) {
      addToRecent(data.exerciseName);
    }
  };

  const handleDeleteItem = (itemId: string) => {
    deleteMutation.mutate({ routineId, itemId });
  };

  const handleMoveItem = (itemId: string, direction: "up" | "down") => {
    moveMutation.mutate({ routineId, itemId, direction });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Exercises ({items.length})</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add item form */}
        <div className="p-3 border rounded-lg bg-muted/30">
          <AddItemForm
            onAdd={handleAddItem}
            suggestions={getSuggestions("")}
            isLoading={addMutation.isPending}
          />
        </div>

        {/* Items list */}
        {items.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <ListX className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No exercises yet</p>
            <p className="text-sm">Use the form above to add exercises to your routine</p>
          </div>
        ) : (
          <div className="space-y-2">
            {items.map((item, index) => (
              <RoutineItemCard
                key={item.id}
                item={item}
                index={index}
                totalItems={items.length}
                onUpdate={(data) => handleUpdateItem(item.id, data)}
                onDelete={() => handleDeleteItem(item.id)}
                onMoveUp={() => handleMoveItem(item.id, "up")}
                onMoveDown={() => handleMoveItem(item.id, "down")}
                isUpdating={
                  updateMutation.isPending &&
                  updateMutation.variables?.itemId === item.id
                }
                isDeleting={
                  deleteMutation.isPending &&
                  deleteMutation.variables?.itemId === item.id
                }
                isMoving={
                  moveMutation.isPending &&
                  moveMutation.variables?.itemId === item.id
                }
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
