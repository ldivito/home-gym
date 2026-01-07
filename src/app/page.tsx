import Link from "next/link";
import { Header } from "@/components/header";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dumbbell, ListChecks, Play, Package } from "lucide-react";

const features = [
  {
    title: "Exercises",
    description: "Manage your exercise library",
    href: "/exercises",
    icon: Dumbbell,
  },
  {
    title: "Routines",
    description: "Create and manage workout routines",
    href: "/routines",
    icon: ListChecks,
  },
  {
    title: "Workout",
    description: "Start a workout session",
    href: "/workout",
    icon: Play,
  },
  {
    title: "Equipment",
    description: "Track your home gym equipment",
    href: "/equipment",
    icon: Package,
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Home Gym Tracker</h1>
          <p className="text-muted-foreground mt-2">
            Track your workouts and progress from home
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <Link key={feature.href} href={feature.href}>
              <Card className="h-full transition-colors hover:bg-accent">
                <CardHeader>
                  <feature.icon className="h-8 w-8 mb-2" />
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
