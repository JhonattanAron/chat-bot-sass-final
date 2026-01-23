"use client";

import { useState, useCallback, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  CheckCircle2,
  XCircle,
  Eye,
  Globe,
  Key,
  Bot,
  Calendar,
  Plus,
  Copy,
  Check,
  RefreshCw,
  Loader2,
} from "lucide-react";

// Types
type ClientKeyStatus = "pending" | "waiting_approval" | "approved" | "blocked";

type WebChatConfig = {
  id: string;
  clientKey: string;
  domain?: string;
  origin?: string;
  assistantId?: string;
  apiKeyId?: string;
  status: ClientKeyStatus;
  createdAt: string;
  firstUsedAt?: string;
};

// Props interface for the component
interface ChatbotWebConfigPanelProps {
  assistantId: string;
  userId: string;
}

// Status Badge Component
function StatusBadge({ status }: { status: ClientKeyStatus }) {
  const variants: Record<
    ClientKeyStatus,
    { className: string; label: string }
  > = {
    pending: {
      className: "bg-amber-100 text-amber-800 hover:bg-amber-100",
      label: "Pendiente",
    },
    waiting_approval: {
      className: "bg-blue-100 text-blue-800 hover:bg-blue-100",
      label: "Esperando Aprobación",
    },
    approved: {
      className: "bg-emerald-100 text-emerald-800 hover:bg-emerald-100",
      label: "Aprobado",
    },
    blocked: {
      className: "bg-red-100 text-red-800 hover:bg-red-100",
      label: "Bloqueado",
    },
  };

  const { className, label } = variants[status];

  return (
    <Badge variant="secondary" className={className}>
      {label}
    </Badge>
  );
}

// Copy to Clipboard Button Component
function CopyButton({ text, className }: { text: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      console.error("Failed to copy");
    }
  }, [text]);

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleCopy}
      className={className}
    >
      {copied ? (
        <>
          <Check className="h-4 w-4 text-emerald-600" />
          <span className="ml-1 text-emerald-600">¡Copiado!</span>
        </>
      ) : (
        <>
          <Copy className="h-4 w-4" />
          <span className="ml-1">Copiar</span>
        </>
      )}
    </Button>
  );
}

// Generate Key Modal Component (shows the generated key)
function GenerateKeyModal({
  isOpen,
  onClose,
  generatedKey,
}: {
  isOpen: boolean;
  onClose: () => void;
  generatedKey: string | null;
}) {
  if (!generatedKey) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Key className="h-5 w-5 text-emerald-600" />
            Client Key Generada
          </DialogTitle>
          <DialogDescription>
            Pega esta Client Key en tu frontend para activar el chat. La clave
            permanecerá en estado pendiente hasta que se use por primera vez.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Input
              value={generatedKey}
              readOnly
              className="font-mono text-sm bg-muted"
            />
            <CopyButton text={generatedKey} />
          </div>
          <div className="rounded-md bg-amber-50 p-3 text-sm text-amber-800">
            <p className="font-medium">Importante:</p>
            <ul className="mt-1 list-disc list-inside space-y-1">
              <li>Esta clave solo se muestra una vez</li>
              <li>Guárdala en un lugar seguro</li>
              <li>El chat se activará cuando un admin lo apruebe</li>
            </ul>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onClose}>Entendido</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Detail Sheet Component
function ConfigDetailSheet({
  config,
  isOpen,
  onClose,
}: {
  config: WebChatConfig | null;
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!config) return null;

  const formattedCreatedDate = new Date(config.createdAt).toLocaleDateString(
    "es-ES",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    },
  );
  const formattedFirstUsedDate = config.firstUsedAt
    ? new Date(config.firstUsedAt).toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Detalles de Configuración
          </SheetTitle>
          <SheetDescription>
            Información detallada de la configuración del chatbot web.
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-6">
          {/* Client Key Section */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-muted-foreground">
              <Key className="h-4 w-4" />
              Client Key
            </Label>
            <div className="flex items-center gap-2">
              <Input
                value={config.clientKey}
                readOnly
                className="bg-muted font-mono text-sm"
              />
              <CopyButton text={config.clientKey} className="shrink-0" />
            </div>
          </div>

          {/* Origin */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-muted-foreground">
              <Globe className="h-4 w-4" />
              Origin
            </Label>
            <Input
              value={config.origin || config.domain || "Sin origin registrado"}
              readOnly
              className="bg-muted"
            />
            {!config.origin && !config.domain && (
              <p className="text-xs text-muted-foreground">
                El origin se detectará automáticamente cuando la clave se use en
                el frontend.
              </p>
            )}
          </div>

          {/* Assistant ID */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-muted-foreground">
              <Bot className="h-4 w-4" />
              Assistant ID
            </Label>
            <Input
              value={config.assistantId || "Sin asignar"}
              readOnly
              className="bg-muted font-mono text-sm"
            />
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label className="text-muted-foreground">Estado Actual</Label>
            <div>
              <StatusBadge status={config.status} />
            </div>
          </div>

          {/* Created At */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              Fecha de Creación
            </Label>
            <Input value={formattedCreatedDate} readOnly className="bg-muted" />
          </div>

          {/* First Used At */}
          {formattedFirstUsedDate && (
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Primer Uso en Frontend
              </Label>
              <Input
                value={formattedFirstUsedDate}
                readOnly
                className="bg-muted"
              />
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

// Main Component
export function ChatbotWebConfigPanel({
  assistantId,
  userId,
}: ChatbotWebConfigPanelProps) {
  const [configs, setConfigs] = useState<WebChatConfig[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedConfig, setSelectedConfig] = useState<WebChatConfig | null>(
    null,
  );
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [refreshingConfigId, setRefreshingConfigId] = useState<string | null>(
    null,
  );

  // Fetch initial data
  const fetchConfigs = useCallback(async () => {
    try {
      const configsRes = await fetch(
        `/api/backend/web-configs?user_id=${userId}&assistant_id=${assistantId}`,
      );

      if (configsRes.ok) {
        const data = await configsRes.json();
        setConfigs(data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [userId, assistantId]);

  useEffect(() => {
    if (userId && assistantId) {
      fetchConfigs();
    }
  }, [userId, assistantId, fetchConfigs]);

  // Handle refresh single config
  const handleRefreshConfig = async (configId: string) => {
    setRefreshingConfigId(configId);
    try {
      const response = await fetch(
        `/api/backend/web-configs/${configId}?user_id=${userId}`,
      );

      if (response.ok) {
        const updatedConfig: WebChatConfig = await response.json();
        setConfigs((prev) =>
          prev.map((config) =>
            config.id === configId ? updatedConfig : config,
          ),
        );
        // Update selected config if it's the same one
        if (selectedConfig?.id === configId) {
          setSelectedConfig(updatedConfig);
        }
      }
    } catch (error) {
      console.error("Error refreshing config:", error);
    } finally {
      setRefreshingConfigId(null);
    }
  };

  // Handle request submission (simplified - no modal needed)
  const handleSubmitRequest = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/backend/web-configs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assistantId,
          userId,
        }),
      });

      if (response.ok) {
        const newConfig: WebChatConfig = await response.json();
        setConfigs((prev) => [newConfig, ...prev]);
        setGeneratedKey(newConfig.clientKey);
        setIsGenerateModalOpen(true);
      }
    } catch (error) {
      console.error("Error creating config:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Approve
  const handleApprove = async (configId: string) => {
    try {
      const response = await fetch(
        `/api/backend/web-configs/${configId}/approve`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        },
      );

      if (response.ok) {
        const updatedConfig: WebChatConfig = await response.json();
        setConfigs((prev) =>
          prev.map((config) =>
            config.id === configId ? updatedConfig : config,
          ),
        );
      }
    } catch (error) {
      console.error("Error approving config:", error);
    }
  };

  // Handle Block
  const handleBlock = async (configId: string) => {
    try {
      const response = await fetch(
        `/api/backend/web-configs/${configId}/block`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        },
      );

      if (response.ok) {
        const updatedConfig: WebChatConfig = await response.json();
        setConfigs((prev) =>
          prev.map((config) =>
            config.id === configId ? updatedConfig : config,
          ),
        );
      }
    } catch (error) {
      console.error("Error blocking config:", error);
    }
  };

  // Open detail sheet
  const handleViewDetails = (config: WebChatConfig) => {
    setSelectedConfig(config);
    setIsSheetOpen(true);
  };

  // Mask client key for display
  const maskClientKey = (key: string) => {
    if (key.length <= 12) return key;
    return `${key.slice(0, 12)}...${key.slice(-4)}`;
  };

  // Check if approve button should be enabled
  const canApprove = (config: WebChatConfig) => {
    return config.status === "waiting_approval" && !!config.assistantId;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Configuración de Chatbot Web (SDK)
            </CardTitle>
            <CardDescription className="mt-1.5">
              Genera Client Keys y aprueba o bloquea configuraciones.
            </CardDescription>
          </div>
          <Button
            onClick={handleSubmitRequest}
            className="gap-2"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generando...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                Generar Solicitud
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Origin</TableHead>
                <TableHead>Client Key</TableHead>
                <TableHead>Assistant ID</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="h-24 text-center text-muted-foreground"
                  >
                    Cargando configuraciones...
                  </TableCell>
                </TableRow>
              ) : (
                configs.map((config) => (
                  <TableRow key={config.id}>
                    <TableCell className="font-medium">
                      {config.origin || config.domain || (
                        <span className="text-muted-foreground italic">
                          Sin origin
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="font-mono text-sm text-muted-foreground">
                      {maskClientKey(config.clientKey)}
                    </TableCell>
                    <TableCell>
                      <span className="flex items-center gap-1.5">
                        <Bot className="h-3 w-3 text-muted-foreground" />
                        <span className="font-mono text-xs">
                          {config.assistantId?.slice(0, 12)}...
                        </span>
                      </span>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={config.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRefreshConfig(config.id)}
                          disabled={refreshingConfigId === config.id}
                          title="Actualizar datos"
                        >
                          {refreshingConfigId === config.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <RefreshCw className="h-4 w-4" />
                          )}
                          <span className="sr-only">Actualizar</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewDetails(config)}
                        >
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">Ver detalles</span>
                        </Button>
                        {config.status !== "approved" &&
                          config.status !== "pending" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleApprove(config.id)}
                              disabled={!canApprove(config)}
                              className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 disabled:opacity-50"
                            >
                              <CheckCircle2 className="mr-1 h-4 w-4" />
                              Aprobar
                            </Button>
                          )}
                        {config.status !== "blocked" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleBlock(config.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <XCircle className="mr-1 h-4 w-4" />
                            Bloquear
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
              {!isLoading && configs.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No hay configuraciones de chatbot web registradas.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      {/* Generate Key Modal */}
      <GenerateKeyModal
        isOpen={isGenerateModalOpen}
        onClose={() => {
          setIsGenerateModalOpen(false);
          setGeneratedKey(null);
        }}
        generatedKey={generatedKey}
      />

      {/* Detail Sheet */}
      <ConfigDetailSheet
        config={selectedConfig}
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
      />
    </Card>
  );
}
