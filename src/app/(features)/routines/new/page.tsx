"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { RoutineForm } from "@/features/routines/components";
import { ArrowLeft } from "lucide-react";

export default function NewRoutinePage() {
  return (
    <div className="container max-w-xl py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/routines">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">New Routine</h1>
          <p className="text-muted-foreground">
            Create a new workout template
          </p>
        </div>
      </div>

      {/* Form */}
      <RoutineForm />
    </div>
  );
}
