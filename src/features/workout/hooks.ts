"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getActiveSession,
  getSessionWithDetails,
  getSessionHistory,
  createSession,
  finishSession,
  updateSessionNotes,
  addExercise,
  updateExercise,
  toggleExerciseComplete,
  deleteExercise,
  reorderExercise,
  addSet,
  updateSet,
  deleteSet,
} from "./actions";

// Query keys
export const workoutKeys = {
  all: ["workout"] as const,
  activeSession: () => [...workoutKeys.all, "active"] as const,
  session: (id: string) => [...workoutKeys.all, "session", id] as const,
  history: () => [...workoutKeys.all, "history"] as const,
};

// Session hooks

export function useActiveSession() {
  return useQuery({
    queryKey: workoutKeys.activeSession(),
    queryFn: () => getActiveSession(),
  });
}

export function useSession(id: string) {
  return useQuery({
    queryKey: workoutKeys.session(id),
    queryFn: () => getSessionWithDetails(id),
    enabled: !!id,
  });
}

export function useCreateSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workoutKeys.activeSession() });
    },
  });
}

export function useFinishSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, notes }: { id: string; notes?: string }) =>
      finishSession(id, notes),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: workoutKeys.activeSession() });
      queryClient.invalidateQueries({ queryKey: workoutKeys.session(id) });
      queryClient.invalidateQueries({ queryKey: workoutKeys.history() });
    },
  });
}

export function useUpdateSessionNotes() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, notes }: { id: string; notes: string }) =>
      updateSessionNotes(id, notes),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: workoutKeys.session(id) });
    },
  });
}

// Exercise hooks

export function useAddExercise() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      sessionId,
      name,
      trackingMode,
    }: {
      sessionId: string;
      name: string;
      trackingMode: "reps" | "time" | "both";
    }) => addExercise(sessionId, name, trackingMode),
    onSuccess: (_, { sessionId }) => {
      queryClient.invalidateQueries({
        queryKey: workoutKeys.session(sessionId),
      });
    },
  });
}

export function useUpdateExercise() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      sessionId: string;
      data: { name?: string; trackingMode?: "reps" | "time" | "both" };
    }) => updateExercise(id, data),
    onSuccess: (_, { sessionId }) => {
      queryClient.invalidateQueries({
        queryKey: workoutKeys.session(sessionId),
      });
    },
  });
}

export function useToggleExerciseComplete() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: { id: string; sessionId: string }) =>
      toggleExerciseComplete(id),
    onSuccess: (_, { sessionId }) => {
      queryClient.invalidateQueries({
        queryKey: workoutKeys.session(sessionId),
      });
    },
  });
}

export function useDeleteExercise() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: { id: string; sessionId: string }) =>
      deleteExercise(id),
    onSuccess: (_, { sessionId }) => {
      queryClient.invalidateQueries({
        queryKey: workoutKeys.session(sessionId),
      });
    },
  });
}

export function useReorderExercise() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      sessionId,
      direction,
    }: {
      id: string;
      sessionId: string;
      direction: "up" | "down";
    }) => reorderExercise(id, sessionId, direction),
    onSuccess: (_, { sessionId }) => {
      queryClient.invalidateQueries({
        queryKey: workoutKeys.session(sessionId),
      });
    },
  });
}

// Set hooks

export function useAddSet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      exerciseId,
      data,
    }: {
      exerciseId: string;
      sessionId: string;
      data?: {
        repsActual?: number;
        timeSecActual?: number;
        loadKgActual?: string;
        rpe?: string;
        notes?: string;
      };
    }) => addSet(exerciseId, data),
    onSuccess: (_, { sessionId }) => {
      queryClient.invalidateQueries({
        queryKey: workoutKeys.session(sessionId),
      });
    },
  });
}

export function useUpdateSet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      sessionId: string;
      data: {
        repsActual?: number | null;
        timeSecActual?: number | null;
        loadKgActual?: string | null;
        rpe?: string | null;
        notes?: string | null;
      };
    }) => updateSet(id, data),
    onSuccess: (_, { sessionId }) => {
      queryClient.invalidateQueries({
        queryKey: workoutKeys.session(sessionId),
      });
    },
  });
}

export function useDeleteSet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: { id: string; sessionId: string }) =>
      deleteSet(id),
    onSuccess: (_, { sessionId }) => {
      queryClient.invalidateQueries({
        queryKey: workoutKeys.session(sessionId),
      });
    },
  });
}

// History hooks

export function useSessionHistory() {
  return useQuery({
    queryKey: workoutKeys.history(),
    queryFn: () => getSessionHistory(),
  });
}
