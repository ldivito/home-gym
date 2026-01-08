"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Calendar, Dumbbell, Layers } from "lucide-react";
import { useSessionHistory } from "@/features/workout/hooks";
import { formatSessionDuration } from "@/features/workout/components";

export default function WorkoutHistoryPage() {
  const { data: sessions, isLoading } = useSessionHistory();

  return (
    <div className="container max-w-2xl mx-auto p-4 space-y-6">
      <div>
        <Link
          href="/workout"
          className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 mb-1"
        >
          <ArrowLeft className="size-3" />
          Back to Workout
        </Link>
        <h1 className="text-2xl font-bold">Workout History</h1>
        <p className="text-muted-foreground">
          View your past workouts and track progress.
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse h-16 bg-muted rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : !sessions || sessions.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground mb-4">
              No workout history yet. Start your first workout!
            </p>
            <Button asChild>
              <Link href="/workout">Start Workout</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {sessions.map((session) => {
            const totalSets = session.exercises.reduce(
              (acc, ex) => acc + ex.sets.length,
              0
            );
            const isActive = !session.endedAt;

            return (
              <Card key={session.id} className={isActive ? "border-primary" : ""}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Calendar className="size-4" />
                      {new Date(session.startedAt).toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}
                      {isActive && (
                        <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded">
                          Active
                        </span>
                      )}
                    </CardTitle>
                    <span className="text-sm text-muted-foreground">
                      {new Date(session.startedAt).toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <CardDescription>
                    Duration:{" "}
                    {formatSessionDuration(session.startedAt, session.endedAt)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Dumbbell className="size-4" />
                        {session.exercises.length} exercises
                      </span>
                      <span className="flex items-center gap-1">
                        <Layers className="size-4" />
                        {totalSets} sets
                      </span>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link
                        href={
                          isActive
                            ? `/workout/session/${session.id}`
                            : `/workout/history/${session.id}`
                        }
                      >
                        {isActive ? "Resume" : "View"}
                        <ArrowRight className="size-4" />
                      </Link>
                    </Button>
                  </div>
                  {session.notes && (
                    <p className="mt-2 text-sm text-muted-foreground border-t pt-2">
                      {session.notes}
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
