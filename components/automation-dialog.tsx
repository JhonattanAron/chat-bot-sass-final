"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import {
  AlertCircle,
  Brain,
  Sparkles,
  Zap,
  Search,
  HelpCircle,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface AutomationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAutomate: (config: AutomationConfig) => void;
}

export interface AutomationConfig {
  topics: string;
  frequency: string;
  dailyLimit: number;
  useAI: boolean;
}

export function AutomationDialog({
  open,
  onOpenChange,
  onAutomate,
}: AutomationDialogProps) {
  const USER_PLAN_LIMIT = 50;
  const [config, setConfig] = useState<AutomationConfig>({
    topics: "",
    frequency: "daily",
    dailyLimit: 10,
    useAI: true,
  });

  const [usagePercentage, setUsagePercentage] = useState(0);

  useEffect(() => {
    setUsagePercentage((config.dailyLimit / USER_PLAN_LIMIT) * 100);
  }, [config.dailyLimit]);

  const handleLimitChange = (value: string) => {
    const num = Math.min(Number.parseInt(value) || 0, USER_PLAN_LIMIT);
    setConfig({ ...config, dailyLimit: num });
  };

  const isValid = config.useAI || config.topics.trim().length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-500 fill-yellow-500" />
            Automatización Total con IA
          </DialogTitle>
          <DialogDescription>
            La IA buscará leads, generará temas y gestionará tus envíos
            automáticamente.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-5 py-4">
          {/* Opción IA - Automatización de Búsqueda y Temas */}
          <div className="flex items-center justify-between rounded-xl border-2 border-primary/20 bg-primary/5 p-4 shadow-sm">
            <div className="space-y-1">
              <Label className="text-base flex items-center gap-2 font-bold">
                <Brain className="h-4 w-4 text-primary" />
                Búsqueda y Temas con IA
              </Label>
              <p className="text-xs text-muted-foreground leading-tight">
                La IA analizará el mercado para encontrar lotes (batches) y
                temas relevantes automáticamente.
              </p>
            </div>
            <Switch
              checked={config.useAI}
              onCheckedChange={(val) => setConfig({ ...config, useAI: val })}
            />
          </div>

          {/* Input de Temas Manuales (si IA está desactivada) */}
          {!config.useAI && (
            <div className="grid gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="flex items-center gap-2">
                <Label htmlFor="topics">Temas o Nichos de búsqueda</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs text-xs">
                        Ej: Restaurantes en Quito, Clínicas dentales, Empresas
                        de logística que usen HubSpot.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Textarea
                id="topics"
                placeholder="Ingresa los temas separados por comas..."
                value={config.topics}
                onChange={(e) =>
                  setConfig({ ...config, topics: e.target.value })
                }
                className="h-24 resize-none"
              />
              <p className="text-[10px] text-muted-foreground italic">
                La IA usará estos temas para buscar nuevos lotes de contactos.
              </p>
            </div>
          )}

          {/* Indicador de Búsqueda Automática (si IA está activada) */}
          {config.useAI && (
            <div className="flex items-start gap-3 rounded-lg bg-secondary/50 p-3 border border-dashed animate-pulse">
              <Search className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div className="space-y-1">
                <p className="text-xs font-medium">
                  Búsqueda Automática Activada
                </p>
                <p className="text-[10px] text-muted-foreground">
                  La IA detectará oportunidades en nichos como clínicas,
                  hospitales y empresas de tecnología.
                </p>
              </div>
            </div>
          )}

          {/* Frecuencia */}
          <div className="grid gap-2">
            <Label htmlFor="frequency">Frecuencia de envío</Label>
            <Select
              value={config.frequency}
              onValueChange={(val) => setConfig({ ...config, frequency: val })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Diario</SelectItem>
                <SelectItem value="weekly">Semanal</SelectItem>
                <SelectItem value="biweekly">Quincenal</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Capacidad / Límite */}
          <div className="grid gap-3">
            <div className="flex justify-between items-end">
              <Label htmlFor="limit">Correos por día</Label>
              <span className="text-xs font-medium text-muted-foreground">
                Plan: {USER_PLAN_LIMIT} envíos/día
              </span>
            </div>
            <Input
              id="limit"
              type="number"
              max={USER_PLAN_LIMIT}
              min={1}
              value={config.dailyLimit}
              onChange={(e) => handleLimitChange(e.target.value)}
              className={
                config.dailyLimit >= USER_PLAN_LIMIT ? "border-orange-500" : ""
              }
            />

            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span>Capacidad utilizada</span>
                <span
                  className={
                    usagePercentage > 90 ? "text-orange-600 font-bold" : ""
                  }
                >
                  {usagePercentage.toFixed(0)}%
                </span>
              </div>
              <Progress
                value={usagePercentage}
                className={`h-2 ${
                  usagePercentage > 90 ? "[&>div]:bg-orange-500" : ""
                }`}
              />
            </div>
          </div>

          {config.dailyLimit >= USER_PLAN_LIMIT && (
            <Alert className="bg-orange-50 border-orange-200 text-orange-800">
              <AlertCircle className="h-4 w-4 text-orange-600" />
              <AlertTitle className="text-xs font-bold uppercase tracking-wider">
                Límite alcanzado
              </AlertTitle>
              <AlertDescription className="text-xs">
                Has alcanzado el límite diario de tu plan actual.
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            disabled={!isValid}
            onClick={() => onAutomate(config)}
            className="bg-primary hover:bg-primary/90 gap-2 shadow-md"
          >
            <Sparkles className="h-4 w-4" />
            Lanzar Piloto Automático
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
