"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Server } from "@/store/vpsStore";
import {
  Power,
  RotateCw,
  Settings,
  Download,
  Trash2,
  Copy,
} from "lucide-react";

interface ServerDetailsProps {
  server: Server;
}

export default function ServerDetails({ server }: ServerDetailsProps) {
  const statusConfig = {
    running: {
      bg: "bg-green-500/10",
      text: "text-green-400",
      dot: "bg-green-500",
    },
    stopped: { bg: "bg-red-500/10", text: "text-red-400", dot: "bg-red-500" },
    maintenance: {
      bg: "bg-yellow-500/10",
      text: "text-yellow-400",
      dot: "bg-yellow-500",
    },
  };

  const status = statusConfig[server.status];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Header Section */}
      <div className="p-6 border-b border-border bg-card/50 backdrop-blur">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-foreground">
                {server.name}
              </h1>
              <Badge
                className={`${status.bg} ${status.text} border-0 text-sm px-3 py-1`}
              >
                {server.status === "running"
                  ? "● En ejecución"
                  : server.status === "stopped"
                    ? "● Detenido"
                    : "● Mantenimiento"}
              </Badge>
            </div>
            <p className="text-muted-foreground mt-1">
              Detalles de configuración y estado
            </p>
          </div>

          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="gap-2">
              <Power className="w-4 h-4" />
              {server.status === "running" ? "Detener" : "Iniciar"}
            </Button>
            <Button size="sm" variant="outline" className="gap-2">
              <Settings className="w-4 h-4" />
              Configurar
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 space-y-6">
        {/* IP Section */}
        <Card className="bg-card/50 border-border p-6">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">
            Información de Red
          </h3>
          <div className="space-y-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Dirección IP</p>
              <div className="flex items-center gap-2 bg-secondary/50 rounded-lg p-3">
                <code className="font-mono text-sm text-foreground flex-1">
                  {server.ip}
                </code>
                <button
                  onClick={() => copyToClipboard(server.ip)}
                  className="p-1 hover:bg-primary/20 rounded transition-colors"
                  title="Copiar IP"
                >
                  <Copy className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            </div>

            <div>
              <p className="text-xs text-muted-foreground mb-1">Región</p>
              <div className="bg-secondary/50 rounded-lg p-3">
                <p className="font-mono text-sm text-foreground">
                  {server.region}
                </p>
              </div>
            </div>

            <div>
              <p className="text-xs text-muted-foreground mb-1">
                Precio Mensual
              </p>
              <div className="bg-secondary/50 rounded-lg p-3">
                <p className="font-mono text-sm text-primary font-semibold">
                  ${server.price.toFixed(2)}/mes
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* System Information */}
        <Card className="bg-card/50 border-border p-6">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">
            Información del Sistema
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-secondary/50 rounded-lg p-4">
              <p className="text-xs text-muted-foreground mb-1">
                Sistema Operativo
              </p>
              <p className="text-sm font-semibold text-foreground">
                {server.os}
              </p>
            </div>
            <div className="bg-secondary/50 rounded-lg p-4">
              <p className="text-xs text-muted-foreground mb-1">Núcleos</p>
              <p className="text-sm font-semibold text-foreground">
                {server.cores} CPUs
              </p>
            </div>
            <div className="bg-secondary/50 rounded-lg p-4">
              <p className="text-xs text-muted-foreground mb-1">Memoria RAM</p>
              <p className="text-sm font-semibold text-foreground">
                {server.ram}
              </p>
            </div>
            <div className="bg-secondary/50 rounded-lg p-4">
              <p className="text-xs text-muted-foreground mb-1">
                Tiempo de Actividad
              </p>
              <p className="text-sm font-semibold text-foreground">
                {server.uptime}
              </p>
            </div>
          </div>
        </Card>

        {/* Resource Usage */}
        <Card className="bg-card/50 border-border p-6">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">
            Uso de Recursos
          </h3>
          <div className="space-y-4">
            {/* CPU */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-foreground">
                  Procesador (CPU)
                </span>
                <span className="text-sm font-semibold text-chart-1">
                  {server.cpu}%
                </span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-chart-1 to-chart-1/60 rounded-full"
                  style={{ width: `${server.cpu}%` }}
                />
              </div>
            </div>

            {/* Memory */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-foreground">Memoria</span>
                <span className="text-sm font-semibold text-chart-2">
                  {server.memory}%
                </span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-chart-2 to-chart-2/60 rounded-full"
                  style={{ width: `${server.memory}%` }}
                />
              </div>
            </div>

            {/* Storage */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-foreground">Almacenamiento</span>
                <span className="text-sm font-semibold text-chart-3">
                  {server.storage}%
                </span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-chart-3 to-chart-3/60 rounded-full"
                  style={{ width: `${server.storage}%` }}
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Advanced Actions */}
        <Card className="bg-card/50 border-border p-6">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">
            Acciones
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="gap-2 justify-center">
              <RotateCw className="w-4 h-4" />
              Reiniciar
            </Button>
            <Button variant="outline" className="gap-2 justify-center">
              <Download className="w-4 h-4" />
              Respaldar
            </Button>
            <Button variant="outline" className="gap-2 justify-center">
              <Settings className="w-4 h-4" />
              Configuración
            </Button>
            <Button
              variant="outline"
              className="gap-2 justify-center text-destructive hover:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
              Eliminar
            </Button>
          </div>
        </Card>

        {/* Update Info */}
        <div className="text-xs text-muted-foreground text-center py-4">
          Última actualización: {server.lastUpdate}
        </div>
      </div>
    </div>
  );
}
