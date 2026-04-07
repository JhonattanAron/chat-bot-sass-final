"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, ArrowUp, ArrowDown } from "lucide-react";

interface TokenCounterGlobalProps {
  inputTokens: number;
  outputTokens: number;
}

export function TokenCounterGlobal({
  inputTokens,
  outputTokens,
}: TokenCounterGlobalProps) {
  const totalTokens = inputTokens + outputTokens;

  return (
    <Card className="glass-effect border-border/50 p-3 min-w-[200px]">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80">
            <Zap className="h-3 w-3 text-primary-foreground" />
          </div>
          <span className="text-sm font-medium">Token Usage</span>
        </div>

        <Badge variant="outline" className="border-primary/30 text-primary">
          Live
        </Badge>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1">
            <ArrowUp className="h-3 w-3 text-blue-500" />
            <span>Input: {inputTokens.toLocaleString()}</span>
          </div>

          <div className="flex items-center gap-1">
            <ArrowDown className="h-3 w-3 text-green-500" />
            <span>Output: {outputTokens.toLocaleString()}</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Total used</span>
          <span className="font-medium text-foreground">
            {totalTokens.toLocaleString()}
          </span>
        </div>
      </div>
    </Card>
  );
}
