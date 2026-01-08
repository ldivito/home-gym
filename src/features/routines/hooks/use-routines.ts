"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getRoutines,
  getRoutineById,
  createRoutine,
  updateRoutine,
  deleteRoutine,
  duplicateRoutine,
  addRoutineItem,
  updateRoutineItem,
  deleteRoutineItem,
  moveRoutineItem,
  reorderRoutineItems,
} from "../api/routines";
import type {
  RoutineSortOption,
  RoutineFormData,
  RoutineItemFormData,
} from "../types";

// Query keys
export const routineKeys = {
  all: ["routines"] as const,
  lists: () => [...routineKeys.all, "list"] as const,
  list: (filters: { search?: string; sort?: RoutineSortOption }) =>
    [...routineKeys.lists(), filters] as const,
  details: () => [...routineKeys.all, "detail"] as const,
  detail: (id: string) => [...routineKeys.details(), id] as const,
};

// ============ QUERIES ============

export function useRoutines(options?: {
  search?: string;
  sort?: RoutineSortOption;
}) {
  return useQuery({
    queryKey: routineKeys.list({ search: options?.search, sort: options?.sort }),
    queryFn: () => getRoutines(options),
  });
}

export function useRoutine(id: string) {
  return useQuery({
    queryKey: routineKeys.detail(id),
    queryFn: () => getRoutineById(id),
    enabled: !!id,
  });
}

// ============ MUTATIONS ============

export function useCreateRoutine() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RoutineFormData) => createRoutine(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: routineKeys.lists() });
    },
  });
}

export function useUpdateRoutine() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<RoutineFormData> }) =>
      updateRoutine(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: routineKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: routineKeys.detail(variables.id),
      });
    },
  });
}

export function useDeleteRoutine() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteRoutine(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: routineKeys.lists() });
    },
  });
}

export function useDuplicateRoutine() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => duplicateRoutine(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: routineKeys.lists() });
    },
  });
}

// ============ ITEM MUTATIONS ============

export function useAddRoutineItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      routineId,
      data,
    }: {
      routineId: string;
      data: RoutineItemFormData;
    }) => addRoutineItem(routineId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: routineKeys.detail(variables.routineId),
      });
    },
  });
}

export function useUpdateRoutineItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: {
      routineId: string;
      itemId: string;
      data: Partial<RoutineItemFormData>;
    }) => updateRoutineItem(params.itemId, params.data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: routineKeys.detail(variables.routineId),
      });
    },
  });
}

export function useDeleteRoutineItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: {
      routineId: string;
      itemId: string;
    }) => deleteRoutineItem(params.itemId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: routineKeys.detail(variables.routineId),
      });
    },
  });
}

export function useMoveRoutineItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      routineId,
      itemId,
      direction,
    }: {
      routineId: string;
      itemId: string;
      direction: "up" | "down";
    }) => moveRoutineItem(routineId, itemId, direction),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: routineKeys.detail(variables.routineId),
      });
    },
  });
}

export function useReorderRoutineItems() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      routineId,
      itemIds,
    }: {
      routineId: string;
      itemIds: string[];
    }) => reorderRoutineItems(routineId, itemIds),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: routineKeys.detail(variables.routineId),
      });
    },
  });
}
