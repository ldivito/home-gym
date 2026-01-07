import Link from "next/link";
import { Dumbbell } from "lucide-react";

export function Header() {
  return (
    <header className="border-b bg-background">
      <div className="container mx-auto flex h-16 items-center px-4">
        <Link href="/" className="flex items-center gap-2">
          <Dumbbell className="h-6 w-6" />
          <span className="font-bold">Home Gym</span>
        </Link>
      </div>
    </header>
  );
}
