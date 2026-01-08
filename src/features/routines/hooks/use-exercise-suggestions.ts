"use client";

import { useState, useCallback } from "react";

const STORAGE_KEY = "home-gym-recent-exercises";
const MAX_RECENT = 10;

function loadFromStorage(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch {
    // Ignore parse errors
  }
  return [];
}

export function useExerciseSuggestions(currentRoutineExercises: string[] = []) {
  // Use lazy initialization to load from localStorage
  const [recentExercises, setRecentExercises] = useState<string[]>(loadFromStorage);

  // Add exercise to recent list
  const addToRecent = useCallback((exerciseName: string) => {
    if (!exerciseName.trim()) return;

    setRecentExercises((prev) => {
      // Remove if already exists, then add to front
      const filtered = prev.filter(
        (e) => e.toLowerCase() !== exerciseName.toLowerCase()
      );
      const updated = [exerciseName, ...filtered].slice(0, MAX_RECENT);

      // Save to localStorage
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // Ignore storage errors
      }

      return updated;
    });
  }, []);

  // Get suggestions based on input
  const getSuggestions = useCallback(
    (input: string): string[] => {
      if (!input.trim()) {
        // No input: show current routine exercises first, then recent
        const uniqueFromRoutine = [...new Set(currentRoutineExercises)];
        const uniqueRecent = recentExercises.filter(
          (e) => !uniqueFromRoutine.some((r) => r.toLowerCase() === e.toLowerCase())
        );
        return [...uniqueFromRoutine, ...uniqueRecent].slice(0, 10);
      }

      const searchLower = input.toLowerCase();

      // Combine current routine + recent, prioritize matches
      const allExercises = [
        ...new Set([...currentRoutineExercises, ...recentExercises]),
      ];

      return allExercises
        .filter((e) => e.toLowerCase().includes(searchLower))
        .slice(0, 8);
    },
    [currentRoutineExercises, recentExercises]
  );

  return {
    recentExercises,
    addToRecent,
    getSuggestions,
  };
}
