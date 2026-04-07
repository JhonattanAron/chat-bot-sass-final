"use client";

import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Zap } from "lucide-react";
import { useDashboardStore } from "../store/dashboard-store";
import { useResourcesStore } from "@/store/resourses-store";

export function TokenCounterCompact() {
  const tokenUsage = useDashboardStore((state) => state.tokenUsage);

  const tokens = useResourcesStore((state) => state.resources.tokens);

  const inputTokens = tokenUsage?.input_tokens ?? 0;
  const outputTokens = tokenUsage?.output_tokens ?? 0;

  const totalTokens = inputTokens + outputTokens;

  // 🔥 límite REAL del plan
  const maxTokens = tokens?.total ?? 0;

  const percentage = maxTokens > 0 ? (totalTokens / maxTokens) * 100 : 0;

  const getVariant = () => {
    if (percentage >= 90) return "destructive";
    if (percentage >= 70) return "outline";
    return "secondary";
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-2 rounded-md border bg-muted/40 px-3 py-1.5 cursor-help">
            <Zap className="h-4 w-4 text-primary" />
            <span className="text-xs text-muted-foreground">Tokens</span>
            <Badge
              variant={getVariant()}
              className="text-xs px-2 py-0 h-5 font-semibold"
            >
              {Math.round(percentage)}%
            </Badge>
          </div>
        </TooltipTrigger>

        <TooltipContent
          side="bottom"
          className="flex flex-col gap-1.5 p-3 bg-background border border-border rounded-md shadow-lg w-48"
        >
          <div className="text-xs font-medium">Uso de Tokens</div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
            <span>Input:</span>
            <span className="text-right">{inputTokens.toLocaleString()}</span>

            <span>Output:</span>
            <span className="text-right">{outputTokens.toLocaleString()}</span>

            <span>Total:</span>
            <span className="text-right">{totalTokens.toLocaleString()}</span>

            <span>Límite:</span>
            <span className="text-right">{maxTokens.toLocaleString()}</span>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
