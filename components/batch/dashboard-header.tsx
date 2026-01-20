import { Button } from "@/components/ui/button";
import { Database, LogOut } from "lucide-react";
import Link from "next/link";

export async function DashboardHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Database className="h-6 w-6 text-primary" />
          <span className="text-xl font-semibold">LeadScraper Pro</span>
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground hidden sm:inline">
            hola
          </span>
        </div>
      </div>
    </header>
  );
}
