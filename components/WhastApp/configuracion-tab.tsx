"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import QRCode from "react-qr-code";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { QrCode, CheckCircle, Zap, Bot, UploadCloud } from "lucide-react";
import { Input } from "@/components/ui/input";
import { AIModelSelector } from "./ai-model-selector";

interface ConfiguracionTabProps {
  connected: boolean;
  loadingQr: boolean;
  qr: string | null;
  selectedAIModel: string;
  onConnectWhatsapp: () => void;
  onModelChange: (model: string) => void;
  onCSV?: (file: File) => void;
  phones?: string[];
}

export function ConfiguracionTab({
  connected,
  loadingQr,
  qr,
  selectedAIModel,
  onConnectWhatsapp,
  onModelChange,
  onCSV,
  phones = [],
}: ConfiguracionTabProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Configuración</h1>
        <p className="text-muted-foreground mt-1">
          Configura tu conexión de WhatsApp y el asistente de IA
        </p>
      </div>

      {/* CONECTAR WHATSAPP */}
      <Card className="border bg-background/50 backdrop-blur-xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <QrCode className="w-5 h-5" />
              Conectar WhatsApp
            </CardTitle>
            <Badge
              variant="outline"
              className={
                connected
                  ? "bg-green-50 text-green-700 border-green-200"
                  : "bg-yellow-50 text-yellow-700 border-yellow-200"
              }
            >
              {connected ? (
                <>
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Conectado
                </>
              ) : (
                <>
                  <div className="w-2 h-2 rounded-full bg-yellow-500 mr-2" />
                  No conectado
                </>
              )}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {!connected && (
            <Button
              onClick={onConnectWhatsapp}
              disabled={loadingQr}
              size="lg"
              className="w-full"
            >
              {loadingQr ? (
                <>
                  <Zap className="w-4 h-4 mr-2 animate-spin" />
                  Generando QR...
                </>
              ) : (
                "Conectar WhatsApp"
              )}
            </Button>
          )}

          {qr && (
            <div className="flex flex-col items-center gap-4 p-6 bg-muted/50 rounded-lg border-2 border-dashed">
              <p className="text-sm font-medium">
                Escanea el QR con tu teléfono WhatsApp
              </p>
              <div className="p-4 bg-white rounded-xl shadow-sm">
                <QRCode value={qr} size={200} />
              </div>
              <p className="text-xs text-muted-foreground text-center">
                Esperando conexión... (Por favor escanea)
              </p>
            </div>
          )}

          {connected && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <div>
                <p className="font-medium text-green-900">WhatsApp conectado</p>
                <p className="text-sm text-green-700">
                  Listo para enviar campañas
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Separator />

      {/* ASISTENTE IA */}
      <Card className="border bg-background/50 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="w-5 h-5" />
            Selecciona el Asistente de IA
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <AIModelSelector
            selectedModel={selectedAIModel}
            onModelChange={onModelChange}
          />

          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-900">
              <strong>Asistente Seleccionado:</strong> {selectedAIModel}
            </p>
            <p className="text-xs text-blue-800 mt-2">
              Este asistente se utilizará para generar los mensajes inteligentes
              de la campaña. Elige el que mejor se adapte a tus necesidades.
            </p>
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* IMPORTAR NÚMEROS */}
      <Card className="border bg-background/50 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UploadCloud className="w-5 h-5" />
            Importar números adicionales
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Carga un archivo CSV con números de teléfono para importar contactos
            adicionales
          </p>
          <Input
            type="file"
            accept=".csv"
            onChange={(e) => e.target.files && onCSV?.(e.target.files[0])}
          />
          {phones.length > 0 && (
            <p className="text-sm text-green-700 font-medium">
              ✓ {phones.length} números cargados
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
