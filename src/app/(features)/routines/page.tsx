"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useRoutines } from "@/features/routines/hooks";
import { RoutineCard } from "@/features/routines/components";
import type { RoutineSortOption } from "@/features/routines/types";
import { Plus, Search, Loader2, FolderOpen } from "lucide-react";

const SORT_OPTIONS = [
  { value: "recent", label: "Most Recent" },
  { value: "oldest", label: "Oldest First" },
  { value: "name-asc", label: "Name A-Z" },
  { value: "name-desc", label: "Name Z-A" },
];

export default function RoutinesPage() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<RoutineSortOption>("recent");

  const { data: routines, isLoading, error } = useRoutines({ search, sort });

  return (
    <div className="container max-w-3xl py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Routines</h1>
          <p className="text-muted-foreground">
            Create and manage your workout templates
          </p>
        </div>
        <Button asChild>
          <Link href="/routines/new">
            <Plus className="h-4 w-4 mr-2" />
            New Routine
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search routines..."
            className="pl-9"
          />
        </div>
        <Select
          value={sort}
          onChange={(e) => setSort(e.target.value as RoutineSortOption)}
          options={SORT_OPTIONS}
          className="w-40"
        />
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : error ? (
        <div className="text-center py-12 text-destructive">
          Error loading routines. Please try again.
        </div>
      ) : routines && routines.length > 0 ? (
        <div className="grid gap-3">
          {routines.map((routine) => (
            <RoutineCard key={routine.id} routine={routine} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          <FolderOpen className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p className="font-medium">No routines found</p>
          <p className="text-sm">
            {search
              ? "Try a different search term"
              : "Create your first routine to get started"}
          </p>
          {!search && (
            <Button asChild className="mt-4">
              <Link href="/routines/new">
                <Plus className="h-4 w-4 mr-2" />
                Create Routine
              </Link>
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
