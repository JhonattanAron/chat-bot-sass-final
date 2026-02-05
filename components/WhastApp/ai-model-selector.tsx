"use client";

import { Check, ChevronDown, Zap } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

export interface AIModel {
  id: string;
  name: string;
  description: string;
  speed: "fast" | "balanced" | "powerful";
}

export const AI_MODELS: AIModel[] = [
  {
    id: "gpt-3.5-turbo",
    name: "GPT-3.5 Turbo",
    description: "Rápido y eficiente",
    speed: "fast",
  },
  {
    id: "gpt-4",
    name: "GPT-4",
    description: "Potente y preciso",
    speed: "balanced",
  },
  {
    id: "gpt-4-turbo",
    name: "GPT-4 Turbo",
    description: "Máxima potencia",
    speed: "powerful",
  },
];

interface AIModelSelectorProps {
  selectedModel: string;
  onModelChange: (model: string) => void;
}

const speedConfig = {
  fast: { label: "Rápido", color: "bg-green-100 text-green-700" },
  balanced: { label: "Balanceado", color: "bg-blue-100 text-blue-700" },
  powerful: { label: "Potente", color: "bg-red-100 text-red-700" },
};

export function AIModelSelector({
  selectedModel,
  onModelChange,
}: AIModelSelectorProps) {
  const selectedModelData = AI_MODELS.find((m) => m.id === selectedModel);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-between px-4 py-2.5 h-auto bg-background hover:bg-muted/50 border border-input hover:border-ring transition-colors"
        >
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="flex flex-col items-start gap-0.5 flex-1 min-w-0">
              <span className="font-medium text-sm leading-tight">
                {selectedModelData?.name || "Seleccionar modelo"}
              </span>
              <span className="text-xs text-muted-foreground truncate">
                {selectedModelData?.description}
              </span>
            </div>
          </div>
          <ChevronDown className="w-4 h-4 ml-2 opacity-50 flex-shrink-0" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-72 p-2">
        {AI_MODELS.map((model) => (
          <DropdownMenuItem
            key={model.id}
            onClick={() => onModelChange(model.id)}
            className="flex items-center justify-between gap-2 px-3 py-2.5 cursor-pointer rounded-md hover:bg-muted/80 transition-colors"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-sm">{model.name}</span>
                <Badge
                  variant="secondary"
                  className={`text-xs py-0.5 px-2 ${
                    speedConfig[model.speed].color
                  }`}
                >
                  <Zap className="w-3 h-3 mr-1" />
                  {speedConfig[model.speed].label}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                {model.description}
              </p>
            </div>
            {selectedModel === model.id && (
              <Check className="w-4 h-4 text-primary flex-shrink-0" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
