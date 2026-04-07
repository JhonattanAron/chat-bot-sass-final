"use client";

import { useEffect } from "react";
import { useResourcesStore } from "@/store/resourses-store";
import { Coins } from "lucide-react";

export function CreditsNavbar() {
  const { resources, fetchResources } = useResourcesStore();

  const credits = resources?.credits;

  useEffect(() => {
    if (!credits) {
      fetchResources();
    }
  }, []);

  return (
    <div className="flex items-center gap-2 rounded-md border bg-muted/40 px-3 py-1.5">
      <Coins className="h-4 w-4 text-accent" />

      <span className="text-xs text-muted-foreground">Créditos</span>

      <span className="text-sm font-semibold text-foreground">
        {credits?.available?.toLocaleString() ?? 0}
      </span>
    </div>
  );
}
