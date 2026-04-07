"use client";

import { useEffect } from "react";
import { useResourcesStore } from "@/store/resourses-store";
import { Badge } from "@/components/ui/badge";
import { Crown } from "lucide-react";

export function PlanNavbar() {
  const { plans, fetchResources } = useResourcesStore();

  useEffect(() => {
    fetchResources();
  }, []);

  const currentPlan = plans?.[0]; // primer plan activo

  return (
    <div className="flex items-center gap-2 rounded-md border bg-muted/40 px-3 py-1.5">
      <Crown className="h-4 w-4 text-primary" />

      <span className="text-xs text-muted-foreground">Plan</span>

      <Badge className="text-xs px-2 py-0 h-5 font-semibold bg-blue-500/10 text-blue-600 border-blue-500/20">
        {currentPlan?.planName || "Free"}
      </Badge>
    </div>
  );
}
