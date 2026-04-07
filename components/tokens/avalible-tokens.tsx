"use client";

import { useEffect } from "react";
import { useResourcesStore } from "@/store/resourses-store";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Zap, ArrowUp, ArrowDown } from "lucide-react";

export function AvaliableTokens() {
  const tokens = useResourcesStore((state) => state.resources.tokens);

  const fetchResources = useResourcesStore((state) => state.fetchResources);

  const loading = useResourcesStore((state) => state.loading);

  useEffect(() => {
    if (!tokens) {
      fetchResources();
    }
  }, []);

  if (loading || !tokens) return null;

  const totalTokens = tokens.used ?? 0;
  const maxTokens = tokens.total ?? 0;

  const percentage = maxTokens > 0 ? (totalTokens / maxTokens) * 100 : 0;

  const getStatusColor = () => {
    if (percentage >= 90) return "from-red-500 to-red-600";
    if (percentage >= 70) return "from-yellow-500 to-yellow-600";
    return "from-green-500 to-green-600";
  };

  const getStatusText = () => {
    if (percentage >= 90) return "Critical";
    if (percentage >= 70) return "Warning";
    return "Good";
  };

  return (
    <Card className="glass-effect border-border/50 p-3 min-w-[200px] mt-3">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80">
            <Zap className="h-3 w-3 text-primary-foreground" />
          </div>
          <span className="text-sm font-medium">Tokens Limit</span>
        </div>

        <Badge
          variant="outline"
          className={`bg-gradient-to-r ${getStatusColor()} text-white border-0`}
        >
          {getStatusText()}
        </Badge>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1">
            <ArrowUp className="h-3 w-3 text-blue-500" />
            <span>Used: {tokens.used?.toLocaleString() ?? 0}</span>
          </div>

          <div className="flex items-center gap-1">
            <ArrowDown className="h-3 w-3 text-green-500" />
            <span>Available: {tokens.available?.toLocaleString() ?? 0}</span>
          </div>
        </div>

        <Progress value={percentage} className="h-2 bg-muted/50" />

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            {(tokens.used ?? 0).toLocaleString()} /{" "}
            {(tokens.total ?? 0).toLocaleString()}
          </span>
          <span>{percentage.toFixed(1)}%</span>
        </div>
      </div>
    </Card>
  );
}
