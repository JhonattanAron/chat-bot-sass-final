"use client";

import { useCreditStore } from "@/store/credit-store";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function CreditDashboard() {
  const { credits, addCredits, removeCredits, setCredits } = useCreditStore();

  const status = credits > 500 ? "Óptimo" : credits > 100 ? "Bajo" : "Crítico";
  const percentage = Math.round((credits / 1000) * 100);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border border-border bg-card p-8">
          <p className="text-xs font-medium text-muted-foreground mb-3">
            Saldo
          </p>
          <p className="text-4xl font-semibold text-foreground mb-1">
            {credits}
          </p>
          <p className="text-xs text-muted-foreground">{percentage}% de 1000</p>
        </Card>

        <Card className="border border-border bg-card p-8">
          <p className="text-xs font-medium text-muted-foreground mb-3">
            Estado
          </p>
          <div className="flex items-center gap-3">
            <div
              className={`h-3 w-3 rounded-full ${
                credits > 500
                  ? "bg-accent"
                  : credits > 100
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
