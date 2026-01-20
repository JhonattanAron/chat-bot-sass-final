"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Crown } from "lucide-react";

interface PlanLimitWarningProps {
  currentCount: number;
  maxLimit: number;
  planName: string;
  itemType: string;
  onUpgrade?: () => void;
}

export function PlanLimitWarning({
  currentCount,
  maxLimit,
  planName,
  itemType,
  onUpgrade,
}: PlanLimitWarningProps) {
  const isAtLimit = currentCount >= maxLimit;
  const isNearLimit = currentCount >= maxLimit * 0.8;

  if (!isNearLimit) return null;

  return (
    <Alert
      className={`mb-4 ${
        isAtLimit
          ? "border-red-500 bg-red-50"
          : "border-yellow-500 bg-yellow-50"
      }`}
    >
      <AlertTriangle
        className={`h-4 w-4 ${isAtLimit ? "text-red-600" : "text-yellow-600"}`}
      />
      <AlertDescription className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={isAtLimit ? "text-red-700" : "text-yellow-700"}>
            {isAtLimit
              ? `Has alcanzado el límite de ${itemType} para tu plan ${planName}`
              : `Te estás acercando al límite de ${itemType} (${currentCount}/${maxLimit})`}
          </span>
          <Badge variant="outline" className="text-xs">
            {planName}
          </Badge>
        </div>
        {onUpgrade && (
          <Button
            size="sm"
            variant={isAtLimit ? "destructive" : "outline"}
            onClick={onUpgrade}
            className="ml-4"
          >
            <Crown className="h-3 w-3 mr-1" />
            Actualizar Plan
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
}
