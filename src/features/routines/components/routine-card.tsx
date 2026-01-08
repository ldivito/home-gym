"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Trash2, Check, X, ChevronRight, Dumbbell } from "lucide-react";
import { useDeleteRoutine, useDuplicateRoutine } from "../hooks";
import type { RoutineWithItems } from "../types";

interface RoutineCardProps {
  routine: RoutineWithItems;
}

export function RoutineCard({ routine }: RoutineCardProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const deleteMutation = useDeleteRoutine();
  const duplicateMutation = useDuplicateRoutine();

  const handleDelete = () => {
    if (showDeleteConfirm) {
      deleteMutation.mutate(routine.id);
      setShowDeleteConfirm(false);
    } else {
      setShowDeleteConfirm(true);
    }
  };

  const handleDuplicate = () => {
    duplicateMutation.mutate(routine.id);
  };

  const isDeleting = deleteMutation.isPending;
  const isDuplicating = duplicateMutation.isPending;

  return (
    <Card className="group relative hover:border-primary/50 transition-colors">
      <Link href={`/routines/${routine.id}`} className="absolute inset-0 z-0" />

      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg group-hover:text-primary transition-colors">
              {routine.name}
            </CardTitle>
            {routine.description && (
              <CardDescription className="line-clamp-2">
                {routine.description}
              </CardDescription>
            )}
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Dumbbell className="h-3 w-3" />
              {routine.items.length} exercise{routine.items.length !== 1 && "s"}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {new Date(routine.createdAt).toLocaleDateString()}
            </span>
          </div>

          <div className="flex items-center gap-1 relative z-10">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={(e) => {
                e.preventDefault();
                handleDuplicate();
              }}
              disabled={isDuplicating || isDeleting}
              title="Duplicate"
            >
              <Copy className="h-4 w-4" />
            </Button>

            {showDeleteConfirm ? (
              <>
                <Button
                  variant="destructive"
                  size="icon-sm"
                  onClick={(e) => {
                    e.preventDefault();
                    handleDelete();
                  }}
                  disabled={isDeleting}
                  title="Confirm delete"
                >
                  <Check className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowDeleteConfirm(false);
                  }}
                  title="Cancel"
                >
                  <X className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={(e) => {
                  e.preventDefault();
                  handleDelete();
                }}
                disabled={isDeleting || isDuplicating}
                className="text-destructive hover:text-destructive"
                title="Delete"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
