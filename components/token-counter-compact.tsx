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

export function TokenCounterCompact() {
  const { tokenUsage } = useDashboardStore();

  const inputTokens = tokenUsage?.input_tokens || 0;
  const outputTokens = tokenUsage?.output_tokens || 0;
  const maxTokens = tokenUsage?.max_tokens || 10000;

  const totalTokens = inputTokens + outputTokens;
  const percentage = (totalTokens / maxTokens) * 100;

  const getVariant = () => {
    if (percentage >= 90) return "destructive";
    if (percentage >= 70) return "outline";
    return "secondary";
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-1 cursor-help">
            <Zap className="h-4 w-4 text-primary" />
            <Badge variant={getVariant()} className="text-xs px-2 py-0 h-5">
              {Math.round(percentage)}%
            </Badge>
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="flex flex-col gap-1 p-2">
          <div className="text-xs font-medium">Token Usage</div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
            <span className="text-muted-foreground">Input:</span>
            <span className="text-right">{inputTokens.toLocaleString()}</span>
            <span className="text-muted-foreground">Output:</span>
            <span className="text-right">{outputTokens.toLocaleString()}</span>
            <span className="text-muted-foreground">Total:</span>
            <span className="text-right">{totalTokens.toLocaleString()}</span>
            <span className="text-muted-foreground">Limit:</span>
            <span className="text-right">{maxTokens.toLocaleString()}</span>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
