"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RoutineBuilder } from "@/features/routines/components";
import {
  useRoutine,
  useUpdateRoutine,
  useDeleteRoutine,
  useDuplicateRoutine,
} from "@/features/routines/hooks";
import {
  ArrowLeft,
  Copy,
  Trash2,
  Loader2,
  Edit2,
  Check,
  X,
  AlertTriangle,
} from "lucide-react";

export default function RoutineDetailPage() {
  const params = useParams();
  const router = useRouter();
  const routineId = params.id as string;

  const { data: routine, isLoading, error } = useRoutine(routineId);
  const updateMutation = useUpdateRoutine();
  const deleteMutation = useDeleteRoutine();
  const duplicateMutation = useDuplicateRoutine();

  const [isEditingHeader, setIsEditingHeader] = useState(false);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleStartEdit = () => {
    if (routine) {
      setEditName(routine.name);
      setEditDescription(routine.description ?? "");
      setIsEditingHeader(true);
    }
  };

  const handleSaveEdit = async () => {
    if (routine && editName.trim()) {
      await updateMutation.mutateAsync({
        id: routine.id,
        data: {
          name: editName.trim(),
          description: editDescription.trim() || undefined,
        },
      });
      setIsEditingHeader(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditingHeader(false);
    setEditName("");
    setEditDescription("");
  };

  const handleDelete = async () => {
    if (showDeleteConfirm && routine) {
      await deleteMutation.mutateAsync(routine.id);
      router.push("/routines");
    } else {
      setShowDeleteConfirm(true);
    }
  };

  const handleDuplicate = async () => {
    if (routine) {
      const newRoutine = await duplicateMutation.mutateAsync(routine.id);
      if (newRoutine) {
        router.push(`/routines/${newRoutine.id}`);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !routine) {
    return (
      <div className="container max-w-3xl py-6">
        <div className="text-center py-12">
          <AlertTriangle className="h-12 w-12 mx-auto mb-3 text-destructive" />
          <p className="text-destructive font-medium">Routine not found</p>
          <Button asChild className="mt-4">
            <Link href="/routines">Back to Routines</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-3xl py-6 space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Button variant="ghost" size="icon" asChild className="mt-1">
          <Link href="/routines">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>

        <div className="flex-1">
          {isEditingHeader ? (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Edit Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Routine name"
                  autoFocus
                />
                <Textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder="Description (optional)"
                  rows={2}
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={handleSaveEdit}
                    disabled={!editName.trim() || updateMutation.isPending}
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Save
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCancelEdit}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">{routine.name}</h1>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={handleStartEdit}
                  title="Edit details"
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
              </div>
              {routine.description && (
                <p className="text-muted-foreground mt-1">
                  {routine.description}
                </p>
              )}
              <p className="text-xs text-muted-foreground mt-2">
                Created {new Date(routine.createdAt).toLocaleDateString()} • Last
                updated {new Date(routine.updatedAt).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        {!isEditingHeader && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDuplicate}
              disabled={duplicateMutation.isPending || deleteMutation.isPending}
            >
              <Copy className="h-4 w-4 mr-1" />
              Duplicate
            </Button>

            {showDeleteConfirm ? (
              <div className="flex gap-1">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDelete}
                  disabled={deleteMutation.isPending}
                >
                  <Check className="h-4 w-4 mr-1" />
                  Confirm
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={handleDelete}
                disabled={duplicateMutation.isPending || deleteMutation.isPending}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Builder */}
      <RoutineBuilder routineId={routine.id} items={routine.items} />
    </div>
  );
}
