"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Dumbbell,
  Layers,
  Check,
} from "lucide-react";
import { useSession } from "@/features/workout/hooks";
import { formatSessionDuration } from "@/features/workout/components";
import { cn } from "@/lib/utils";

export default function WorkoutHistoryDetailPage() {
  const params = useParams();
  const sessionId = params.id as string;
  const { data: session, isLoading, error } = useSession(sessionId);

  if (isLoading) {
    return (
      <div className="container max-w-2xl mx-auto p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3" />
          <div className="h-32 bg-muted rounded" />
          <div className="h-48 bg-muted rounded" />
        </div>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="container max-w-2xl mx-auto p-4 space-y-4">
        <h1 className="text-2xl font-bold">Workout Not Found</h1>
        <p className="text-muted-foreground">
          This workout doesn&apos;t exist or has been deleted.
        </p>
        <Button asChild>
          <Link href="/workout/history">
            <ArrowLeft className="size-4" />
            Back to History
          </Link>
        </Button>
      </div>
    );
  }

  const totalSets = session.exercises.reduce(
    (acc, ex) => acc + ex.sets.length,
    0
  );
  const completedExercises = session.exercises.filter(
    (ex) => ex.completedAt
  ).length;

  // If session is still active, redirect to session runner
  if (!session.endedAt) {
    return (
      <div className="container max-w-2xl mx-auto p-4 space-y-4">
        <h1 className="text-2xl font-bold">Workout In Progress</h1>
        <p className="text-muted-foreground">
          This workout is still active.
        </p>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/workout/history">
              <ArrowLeft className="size-4" />
              Back to History
            </Link>
          </Button>
          <Button asChild>
            <Link href={`/workout/session/${session.id}`}>Resume Workout</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-2xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div>
        <Link
          href="/workout/history"
          className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 mb-1"
        >
          <ArrowLeft className="size-3" />
          Back to History
        </Link>
        <h1 className="text-2xl font-bold">Workout Details</h1>
      </div>

      {/* Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="size-5" />
            {new Date(session.startedAt).toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </CardTitle>
          <CardDescription>
            {new Date(session.startedAt).toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
            })}{" "}
            -{" "}
            {new Date(session.endedAt).toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
            })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-3 bg-muted rounded-lg">
              <Clock className="size-5 mx-auto mb-1 text-muted-foreground" />
              <div className="font-semibold">
                {formatSessionDuration(session.startedAt, session.endedAt)}
              </div>
              <div className="text-xs text-muted-foreground">Duration</div>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <Dumbbell className="size-5 mx-auto mb-1 text-muted-foreground" />
              <div className="font-semibold">
                {session.exercises.length}{" "}
                <span className="text-xs text-muted-foreground">
                  ({completedExercises})
                </span>
              </div>
              <div className="text-xs text-muted-foreground">Exercises</div>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <Layers className="size-5 mx-auto mb-1 text-muted-foreground" />
              <div className="font-semibold">{totalSets}</div>
              <div className="text-xs text-muted-foreground">Sets</div>
            </div>
          </div>
          {session.notes && (
            <div className="mt-4 p-3 bg-muted rounded-lg">
              <div className="text-sm font-medium mb-1">Notes</div>
              <p className="text-sm text-muted-foreground">{session.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Exercises */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Exercises</h2>
        {session.exercises.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              No exercises recorded in this workout.
            </CardContent>
          </Card>
        ) : (
          session.exercises.map((exercise) => (
            <Card key={exercise.id}>
              <CardHeader className="pb-2">
                <CardTitle
                  className={cn(
                    "text-lg flex items-center gap-2",
                    exercise.completedAt && "text-muted-foreground"
                  )}
                >
                  {exercise.completedAt && (
                    <Check className="size-4 text-green-500" />
                  )}
                  {exercise.name}
                </CardTitle>
                <CardDescription className="capitalize">
                  {exercise.trackingMode === "both"
                    ? "reps + time"
                    : exercise.trackingMode}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {exercise.sets.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No sets recorded</p>
                ) : (
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
                      <div className="col-span-3">Notes</div>
                    </div>
                    {exercise.sets.map((set, index) => (
                      <div
                        key={set.id}
                        className="grid grid-cols-12 gap-2 text-sm items-center px-2 py-1 hover:bg-muted/50 rounded"
                      >
                        <div className="col-span-1 text-muted-foreground">
                          {index + 1}
                        </div>
                        {(exercise.trackingMode === "reps" ||
                          exercise.trackingMode === "both") && (
                          <div className="col-span-2">
                            {set.repsActual ?? "-"}
                          </div>
                        )}
                        {(exercise.trackingMode === "time" ||
                          exercise.trackingMode === "both") && (
                          <div className="col-span-2">
                            {set.timeSecActual ?? "-"}
                          </div>
                        )}
                        <div className="col-span-2">
                          {set.loadKgActual ?? "-"}
                        </div>
                        <div className="col-span-2">{set.rpe ?? "-"}</div>
                        <div className="col-span-3 text-muted-foreground truncate">
                          {set.notes || "-"}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
