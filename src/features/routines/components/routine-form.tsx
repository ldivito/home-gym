"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCreateRoutine, useUpdateRoutine } from "../hooks";
import type { RoutineFormData, RoutineTemplate } from "../types";

interface RoutineFormProps {
  routine?: RoutineTemplate;
  onSuccess?: (routine: RoutineTemplate) => void;
}

export function RoutineForm({ routine, onSuccess }: RoutineFormProps) {
  const router = useRouter();
  const isEditing = !!routine;

  const [name, setName] = useState(routine?.name ?? "");
  const [description, setDescription] = useState(routine?.description ?? "");

  const createMutation = useCreateRoutine();
  const updateMutation = useUpdateRoutine();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data: RoutineFormData = {
      name: name.trim(),
      description: description.trim() || undefined,
    };

    if (isEditing) {
      const result = await updateMutation.mutateAsync({ id: routine.id, data });
      onSuccess?.(result);
    } else {
      const result = await createMutation.mutateAsync(data);
      router.push(`/routines/${result.id}`);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;
  const canSubmit = name.trim().length > 0 && !isPending;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? "Edit Routine" : "Create Routine"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" required>
              Routine Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Upper Body Strength"
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description..."
              rows={3}
            />
          </div>

          <div className="flex gap-2 pt-2">
            {!isEditing && (
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={!canSubmit}>
              {isPending
                ? "Saving..."
                : isEditing
                ? "Save Changes"
                : "Create Routine"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
