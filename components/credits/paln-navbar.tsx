"use client";

import { Badge } from "@/components/ui/badge";
import { Crown } from "lucide-react";

export function PlanNavbar() {
  const plan = "basic"; // cambia aquí: free | basic | standard | pro

  const planConfig = {
    free: {
      label: "Free",
      class: "bg-muted text-muted-foreground",
    },
    basic: {
      label: "Basic",
      class: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    },
    standard: {
      label: "Standard",
      class: "bg-purple-500/10 text-purple-600 border-purple-500/20",
    },
    pro: {
      label: "Pro",
      class: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
    },
  } as const;

  const current = planConfig[plan as keyof typeof planConfig];

  return (
    <div className="flex items-center gap-2 rounded-md border bg-muted/40 px-3 py-1.5">
      <Crown className="h-4 w-4 text-primary" />

      <span className="text-xs text-muted-foreground">Plan</span>

      <Badge className={`text-xs px-2 py-0 h-5 font-semibold ${current.class}`}>
        {current.label}
      </Badge>
    </div>
  );
}
