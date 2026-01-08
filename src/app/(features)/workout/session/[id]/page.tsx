"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, CheckCircle, X } from "lucide-react";
import { useSession, useFinishSession } from "@/features/workout/hooks";
import {
  RestTimer,
  SessionTimer,
  ExerciseCard,
  AddExerciseForm,
  formatSessionDuration,
} from "@/features/workout/components";

export default function WorkoutSessionPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.id as string;
  const { data: session, isLoading, error } = useSession(sessionId);
  const finishSession = useFinishSession();
  const [showFinishConfirm, setShowFinishConfirm] = useState(false);
  const [notes, setNotes] = useState("");

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
        <h1 className="text-2xl font-bold">Session Not Found</h1>
        <p className="text-muted-foreground">
          This workout session doesn&apos;t exist or has been deleted.
        </p>
        <Button asChild>
          <Link href="/workout">
            <ArrowLeft className="size-4" />
            Back to Workout
          </Link>
        </Button>
      </div>
    );
  }

  // If session is already finished, redirect to history detail
  if (session.endedAt) {
    return (
      <div className="container max-w-2xl mx-auto p-4 space-y-4">
        <h1 className="text-2xl font-bold">Workout Completed</h1>
        <p className="text-muted-foreground">
          This workout session has already been completed.
        </p>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/workout">
              <ArrowLeft className="size-4" />
              Back to Workout
            </Link>
          </Button>
          <Button asChild>
            <Link href={`/workout/history/${session.id}`}>View Details</Link>
          </Button>
        </div>
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

  const handleFinish = () => {
    finishSession.mutate(
      { id: sessionId, notes: notes || undefined },
      {
        onSuccess: () => {
          router.push(`/workout/history/${sessionId}`);
        },
      }
    );
  };

  return (
    <div className="container max-w-2xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/workout"
            className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 mb-1"
          >
            <ArrowLeft className="size-3" />
            Back
          </Link>
          <h1 className="text-2xl font-bold">Workout Session</h1>
        </div>
        <SessionTimer startedAt={session.startedAt} />
      </div>

      {/* Rest Timer */}
      <RestTimer />

      {/* Add Exercise Form */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Add Exercise</CardTitle>
        </CardHeader>
        <CardContent>
          <AddExerciseForm sessionId={sessionId} />
        </CardContent>
      </Card>

      {/* Exercises List */}
      <div className="space-y-4">
        {session.exercises.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              No exercises yet. Add your first exercise above.
            </CardContent>
          </Card>
        ) : (
          session.exercises.map((exercise, index) => (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              sessionId={sessionId}
              isFirst={index === 0}
              isLast={index === session.exercises.length - 1}
            />
          ))
        )}
      </div>

      {/* Finish Workout */}
      <Card>
        <CardHeader>
          <CardTitle>Finish Workout</CardTitle>
          <CardDescription>
            {session.exercises.length} exercises ({completedExercises}{" "}
            completed), {totalSets} sets
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!showFinishConfirm ? (
            <Button
              onClick={() => setShowFinishConfirm(true)}
              className="w-full"
              variant="default"
            >
              <CheckCircle className="size-4" />
              Finish Workout
            </Button>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg space-y-3">
                <h4 className="font-medium">Workout Summary</h4>
                <div className="text-sm space-y-1">
                  <p>
                    Duration:{" "}
                    {formatSessionDuration(session.startedAt, new Date())}
                  </p>
                  <p>
                    Exercises: {session.exercises.length} ({completedExercises}{" "}
                    completed)
                  </p>
                  <p>Total Sets: {totalSets}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">
                    Notes (optional)
                  </label>
                  <textarea
                    className="w-full mt-1 p-2 border rounded-md bg-background text-sm"
                    rows={2}
                    placeholder="How did your workout go?"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleFinish}
                  className="flex-1"
                  disabled={finishSession.isPending}
                >
                  <CheckCircle className="size-4" />
                  {finishSession.isPending ? "Saving..." : "Confirm Finish"}
                </Button>
                <Button
                  onClick={() => setShowFinishConfirm(false)}
                  variant="outline"
                >
                  <X className="size-4" />
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
