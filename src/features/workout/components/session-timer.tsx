"use client";

import { useState, useEffect, useMemo } from "react";
import { Clock } from "lucide-react";

function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

interface SessionTimerProps {
  startedAt: Date;
}

function calculateElapsed(startedAt: Date): number {
  const now = new Date();
  const start = new Date(startedAt);
  return Math.floor((now.getTime() - start.getTime()) / 1000);
}

export function SessionTimer({ startedAt }: SessionTimerProps) {
  const initialElapsed = useMemo(() => calculateElapsed(startedAt), [startedAt]);
  const [elapsed, setElapsed] = useState(initialElapsed);

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed(calculateElapsed(startedAt));
    }, 1000);

    return () => clearInterval(interval);
  }, [startedAt]);

  return (
    <div className="flex items-center gap-2 text-muted-foreground">
      <Clock className="size-4" />
      <span className="font-mono text-lg tabular-nums">
        {formatDuration(elapsed)}
      </span>
    </div>
  );
}

export function formatSessionDuration(
  startedAt: Date,
  endedAt: Date | null
): string {
  const end = endedAt ? new Date(endedAt) : new Date();
  const start = new Date(startedAt);
  const seconds = Math.floor((end.getTime() - start.getTime()) / 1000);
  return formatDuration(seconds);
}
