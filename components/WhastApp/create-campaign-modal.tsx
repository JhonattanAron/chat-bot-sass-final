"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { CheckCircle2, Loader2 } from "lucide-react";

interface Contact {
  id: string;
  name: string;
  phone: string;
  email?: string;
}

interface CreateCampaignModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contacts: Contact[];
  aiModel: string;
  userId: string;
  onCampaignCreated?: (campaign: any) => void;
}

export function CreateCampaignModal({
  open,
  onOpenChange,
  contacts,
  aiModel,
  userId,
  onCampaignCreated,
}: CreateCampaignModalProps) {
  const [campaignName, setCampaignName] = useState("");
  const [campaignMessage, setCampaignMessage] = useState("");
  const [isAutomatic, setIsAutomatic] = useState(true);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleCreate = async () => {
    if (!campaignName || !campaignMessage) {
      alert("Por favor completa todos los campos");
      return;
    }

    if (contacts.length === 0) {
      alert("Debes agregar al menos 1 contacto");
      return;
    }

    setLoading(true);
    try {
      const campaignData = {
        name: campaignName,
        message: campaignMessage,
        aiModel: aiModel,
        contacts: contacts.map((c) => c.phone),
        isAutomatic: isAutomatic,
        userId: userId,
        createdAt: new Date().toISOString(),
      };

      // Simular llamada a API
      await new Promise((resolve) => setTimeout(resolve, 2000));

      console.log("[v0] Campaign created:", campaignData);
      setSuccess(true);

      if (onCampaignCreated) {
        onCampaignCreated(campaignData);
      }

      // Resetear después de 2 segundos
      setTimeout(() => {
        setCampaignName("");
        setCampaignMessage("");
        setSuccess(false);
        onOpenChange(false);
      }, 2000);
    } catch (error) {
      console.error("[v0] Error creating campaign:", error);
      alert("Error al crear la campaña");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Crear Nueva Campaña WhatsApp</DialogTitle>
          <DialogDescription>
            Configura tu campaña con IA automática
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="flex flex-col items-center justify-center gap-4 py-8">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-lg">¡Campaña creada!</h3>
              <p className="text-sm text-muted-foreground">
                La campaña se lanzará en breve
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Información de la campaña */}
            <div className="space-y-2">
              <Label htmlFor="campaign-name">Nombre de la campaña</Label>
              <Input
                id="campaign-name"
                placeholder="Ej: Promoción de Verano 2024"
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
                disabled={loading}
              />
            </div>

            {/* Mensaje */}
            <div className="space-y-2">
              <Label htmlFor="campaign-message">Mensaje a enviar</Label>
              <Textarea
                id="campaign-message"
                placeholder="Escribe el mensaje que se enviará por WhatsApp..."
                rows={5}
                value={campaignMessage}
                onChange={(e) => setCampaignMessage(e.target.value)}
                disabled={loading}
              />
            </div>

            {/* Resumen */}
            <div className="grid gap-3 md:grid-cols-2 p-4 bg-muted/50 rounded-lg border">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Contactos
                </p>
                <p className="text-2xl font-bold">{contacts.length}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Modelo IA
                </p>
                <Badge className="mt-1">{aiModel}</Badge>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm font-medium text-muted-foreground mb-2">
                  Modo
                </p>
                <Badge variant={isAutomatic ? "default" : "secondary"}>
                  {isAutomatic ? "Automático (IA)" : "Manual"}
                </Badge>
              </div>
            </div>

            {/* Toggle Automático */}
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <input
                type="checkbox"
                id="auto-ai"
                checked={isAutomatic}
                onChange={(e) => setIsAutomatic(e.target.checked)}
                disabled={loading}
                className="w-4 h-4 cursor-pointer"
              />
              <label htmlFor="auto-ai" className="text-sm cursor-pointer flex-1">
                Responder automáticamente con IA ({aiModel})
              </label>
            </div>
          </div>
        )}

        {!success && (
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button onClick={handleCreate} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creando...
                </>
              ) : (
                "Crear Campaña"
              )}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
