"use client";

import { useEffect } from "react";
import { useResourcesStore } from "@/store/resourses-store";
import { Card } from "@/components/ui/card";

export function CreditDashboard() {
  const credits = useResourcesStore((state) => state.resources.credits);

  const fetchResources = useResourcesStore((state) => state.fetchResources);

  const loading = useResourcesStore((state) => state.loading);

  useEffect(() => {
    if (!credits) {
      fetchResources();
    }
  }, []);

  if (loading || !credits) return null;

  const total = credits.total ?? 0;
  const available = credits.available ?? 0;

  const percentage = total > 0 ? Math.round((available / total) * 100) : 0;

  const status =
    available > total * 0.5
      ? "Óptimo"
      : available > total * 0.1
        ? "Bajo"
        : "Crítico";

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border border-border bg-card p-8">
          <p className="text-xs font-medium text-muted-foreground mb-3">
            Saldo
          </p>
          <p className="text-4xl font-semibold text-foreground mb-1">
            {available.toLocaleString()}
          </p>
          <p className="text-xs text-muted-foreground">
            {percentage}% de {total.toLocaleString()}
          </p>
        </Card>

        <Card className="border border-border bg-card p-8">
          <p className="text-xs font-medium text-muted-foreground mb-3">
            Estado
          </p>
          <div className="flex items-center gap-3">
            <div
              className={`h-3 w-3 rounded-full ${
                percentage > 50
                  ? "bg-accent"
                  : percentage > 10
                    ? "bg-yellow-500"
                    : "bg-destructive"
              }`}
            />
            <p className="text-xl font-semibold text-foreground">{status}</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
