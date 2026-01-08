"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  ChevronUp,
  ChevronDown,
  Trash2,
  Edit2,
  Check,
  X,
  Clock,
  Dumbbell,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  BLOCK_TYPE_OPTIONS,
  getBlockTypeInfo,
  type RoutineTemplateItem,
  type RoutineItemFormData,
  type BlockType,
} from "../types";

interface RoutineItemCardProps {
  item: RoutineTemplateItem;
  index: number;
  totalItems: number;
  onUpdate: (data: Partial<RoutineItemFormData>) => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  isUpdating?: boolean;
  isDeleting?: boolean;
  isMoving?: boolean;
}

const BLOCK_OPTIONS = [
  { value: "", label: "No block" },
  ...BLOCK_TYPE_OPTIONS.map((opt) => ({ value: opt.value, label: opt.label })),
];

export function RoutineItemCard({
  item,
  index,
  totalItems,
  onUpdate,
  onDelete,
  onMoveUp,
  onMoveDown,
  isUpdating,
  isDeleting,
  isMoving,
}: RoutineItemCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [editData, setEditData] = useState<Partial<RoutineItemFormData>>({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const blockInfo = getBlockTypeInfo(item.blockType);
  const hasRepsOrTime = item.repsPlanned || item.timeSecPlanned;
  const isDisabled = isUpdating || isDeleting || isMoving;

  const handleSave = () => {
    if (Object.keys(editData).length > 0) {
      onUpdate(editData);
    }
    setEditData({});
    setIsExpanded(false);
  };

  const handleCancel = () => {
    setEditData({});
    setIsExpanded(false);
  };

  const handleDelete = () => {
    if (showDeleteConfirm) {
      onDelete();
      setShowDeleteConfirm(false);
    } else {
      setShowDeleteConfirm(true);
    }
  };

  const formatTime = (seconds: number) => {
    if (seconds >= 60) {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`;
    }
    return `${seconds}s`;
  };

  return (
    <div
      className={cn(
        "border rounded-lg bg-card transition-all",
        isExpanded && "ring-2 ring-ring"
      )}
    >
      {/* Collapsed view */}
      <div className="flex items-center gap-2 p-3">
        <span className="text-muted-foreground text-sm font-mono w-6">
          {index + 1}.
        </span>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium truncate">{item.exerciseName}</span>
            {blockInfo && (
              <Badge variant="outline" className={cn("text-xs", blockInfo.color)}>
                {blockInfo.label}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-3 text-sm text-muted-foreground mt-0.5">
            <span>
              {item.setsPlanned} sets
              {item.repsPlanned && ` × ${item.repsPlanned} reps`}
            </span>
            {item.timeSecPlanned && (
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formatTime(item.timeSecPlanned)}
              </span>
            )}
            {item.targetLoadKg && (
              <span className="flex items-center gap-1">
                <Dumbbell className="h-3 w-3" />
                {item.targetLoadKg}kg
              </span>
            )}
            {!hasRepsOrTime && (
              <span className="flex items-center gap-1 text-yellow-500">
                <AlertTriangle className="h-3 w-3" />
                No reps/time
              </span>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onMoveUp}
            disabled={index === 0 || isDisabled}
            title="Move up"
          >
            <ChevronUp className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onMoveDown}
            disabled={index === totalItems - 1 || isDisabled}
            title="Move down"
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setIsExpanded(!isExpanded)}
            disabled={isDisabled}
            title="Edit"
          >
            <Edit2 className="h-4 w-4" />
          </Button>
          {showDeleteConfirm ? (
            <>
              <Button
                variant="destructive"
                size="icon-sm"
                onClick={handleDelete}
                disabled={isDisabled}
                title="Confirm delete"
              >
                <Check className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDisabled}
                title="Cancel"
              >
                <X className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={handleDelete}
              disabled={isDisabled}
              className="text-destructive hover:text-destructive"
              title="Delete"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Expanded edit form */}
      {isExpanded && (
        <div className="px-3 pb-3 pt-0 border-t space-y-3">
          <div className="grid grid-cols-2 gap-3 pt-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">
                Exercise Name
              </label>
              <Input
                value={editData.exerciseName ?? item.exerciseName}
                onChange={(e) =>
                  setEditData({ ...editData, exerciseName: e.target.value })
                }
                placeholder="Exercise name"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">
                Block Type
              </label>
              <Select
                value={editData.blockType ?? item.blockType ?? ""}
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    blockType: (e.target.value as BlockType) || undefined,
                  })
                }
                options={BLOCK_OPTIONS}
              />
            </div>
          </div>

          <div className="grid grid-cols-4 gap-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">
                Sets
              </label>
              <Input
                type="number"
                min="1"
                value={editData.setsPlanned ?? item.setsPlanned}
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    setsPlanned: parseInt(e.target.value) || 1,
                  })
                }
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">
                Reps
              </label>
              <Input
                type="number"
                min="0"
                value={editData.repsPlanned ?? item.repsPlanned ?? ""}
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    repsPlanned: parseInt(e.target.value) || undefined,
                  })
                }
                placeholder="—"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">
                Time (sec)
              </label>
              <Input
                type="number"
                min="0"
                value={editData.timeSecPlanned ?? item.timeSecPlanned ?? ""}
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    timeSecPlanned: parseInt(e.target.value) || undefined,
                  })
                }
                placeholder="—"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">
                Rest (sec)
              </label>
              <Input
                type="number"
                min="0"
                value={editData.restSecPlanned ?? item.restSecPlanned ?? ""}
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    restSecPlanned: parseInt(e.target.value) || undefined,
                  })
                }
                placeholder="—"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">
                Target Load (kg)
              </label>
              <Input
                type="number"
                min="0"
                step="0.5"
                value={
                  editData.targetLoadKg ?? (item.targetLoadKg ? Number(item.targetLoadKg) : "")
                }
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    targetLoadKg: parseFloat(e.target.value) || undefined,
                  })
                }
                placeholder="—"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">
                Notes
              </label>
              <Textarea
                value={editData.notes ?? item.notes ?? ""}
                onChange={(e) =>
                  setEditData({ ...editData, notes: e.target.value || undefined })
                }
                placeholder="Optional notes..."
                className="min-h-[60px]"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={handleCancel}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleSave} disabled={isUpdating}>
              {isUpdating ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
