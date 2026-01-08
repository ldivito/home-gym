"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Play, History, ArrowRight } from "lucide-react";
import { useActiveSession, useCreateSession } from "@/features/workout/hooks";
import { formatSessionDuration } from "@/features/workout/components";

export default function WorkoutPage() {
  const router = useRouter();
  const { data: activeSession, isLoading } = useActiveSession();
  const createSession = useCreateSession();

  const handleStartWorkout = () => {
    createSession.mutate(undefined, {
      onSuccess: (session) => {
        router.push(`/workout/session/${session.id}`);
      },
    });
  };

  const handleResumeWorkout = () => {
    if (activeSession) {
      router.push(`/workout/session/${activeSession.id}`);
    }
  };

  return (
    <div className="container max-w-2xl mx-auto p-4 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Workout</h1>
        <p className="text-muted-foreground">
          Start a manual workout session or view your history.
        </p>
      </div>

      <div className="grid gap-4">
        {isLoading ? (
          <Card>
            <CardContent className="p-6">
              <div className="animate-pulse h-20 bg-muted rounded" />
            </CardContent>
          </Card>
        ) : activeSession ? (
          <Card className="border-primary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                </span>
                Active Workout
              </CardTitle>
              <CardDescription>
                Started{" "}
                {new Date(activeSession.startedAt).toLocaleTimeString()} -{" "}
                {formatSessionDuration(activeSession.startedAt, null)} elapsed
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={handleResumeWorkout} className="w-full">
                <ArrowRight className="size-4" />
                Resume Workout
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Start a New Workout</CardTitle>
              <CardDescription>
                Begin a manual workout session. Track exercises, sets, and rest
                times.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={handleStartWorkout}
                className="w-full"
                disabled={createSession.isPending}
              >
                <Play className="size-4" />
                {createSession.isPending ? "Starting..." : "Start Workout"}
              </Button>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="size-5" />
              Workout History
            </CardTitle>
            <CardDescription>
              View your past workouts and track progress.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/workout/history">
                View History
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
