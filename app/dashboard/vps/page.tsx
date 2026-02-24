"use client";

import { useServerStore } from "@/store/vpsStore";
import { useRouter } from "next/navigation";
import Header from "@/components/header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Server } from "lucide-react";
import { DashboardLayout } from "@/components/pages/dashboard/dashboard-layout";

const statusConfig = {
  running: {
    bg: "bg-green-500/10",
    text: "text-green-400",
    label: "En ejecución",
    dot: "bg-green-500",
  },
  stopped: {
    bg: "bg-red-500/10",
    text: "text-red-400",
    label: "Detenido",
    dot: "bg-red-500",
  },
  maintenance: {
    bg: "bg-yellow-500/10",
    text: "text-yellow-400",
    label: "Mantenimiento",
    dot: "bg-yellow-500",
  },
};

export default function VPSListPage() {
  const { servers, setSelectedServer } = useServerStore();
  const router = useRouter();

  const handleSelectServer = (id: string) => {
    const server = servers.find((s) => s.id === id);
    if (server) {
      setSelectedServer(server);
      router.push(`vps/${id}`);
    }
  };

  const totalCost = servers.reduce((sum, server) => sum + server.price, 0);
  const runningCount = servers.filter((s) => s.status === "running").length;

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-background text-foreground ">
        <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground flex items-center gap-3">
              <Server className="w-10 h-10 text-primary" />
              Servidores VPS
            </h1>
            <p className="text-muted-foreground mt-2">
              Administra y monitorea todos tus servidores
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card className="bg-card/50 border-border p-6">
              <p className="text-sm text-muted-foreground mb-2">
                Servidores Activos
              </p>
              <p className="text-3xl font-bold text-primary">{runningCount}</p>
              <p className="text-xs text-muted-foreground mt-2">
                de {servers.length} totales
              </p>
            </Card>

            <Card className="bg-card/50 border-border p-6">
              <p className="text-sm text-muted-foreground mb-2">
                Costo Total Mensual
              </p>
              <p className="text-3xl font-bold text-primary">
                ${totalCost.toFixed(2)}
              </p>
              <p className="text-xs text-muted-foreground mt-2">USD / mes</p>
            </Card>

            <Card className="bg-card/50 border-border p-6">
              <p className="text-sm text-muted-foreground mb-2">CPU Promedio</p>
              <p className="text-3xl font-bold text-primary">
                {(
                  servers.reduce((sum, s) => sum + s.cpu, 0) / servers.length
                ).toFixed(0)}
                %
              </p>
              <p className="text-xs text-muted-foreground mt-2">uso promedio</p>
            </Card>
          </div>

          {/* Servers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {servers.map((server) => {
              const status = statusConfig[server.status];

              return (
                <Card
                  key={server.id}
                  className="bg-card/50 border-border p-6 hover:border-primary/50 transition-all cursor-pointer group"
                  onClick={() => handleSelectServer(server.id)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                        {server.name}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1 font-mono">
                        {server.ip}
                      </p>
                    </div>
                    <div className={`w-3 h-3 rounded-full ${status.dot}`} />
                  </div>

                  <Badge
                    className={`${status.bg} ${status.text} border-0 mb-4`}
                  >
                    {status.label}
                  </Badge>

                  <div className="space-y-3 mb-4">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-muted-foreground">
                          CPU
                        </span>
                        <span className="text-xs font-semibold">
                          {server.cpu}%
                        </span>
                      </div>
                      <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full bg-chart-1 rounded-full"
                          style={{ width: `${server.cpu}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-muted-foreground">
                          Memoria
                        </span>
                        <span className="text-xs font-semibold">
                          {server.memory}%
                        </span>
                      </div>
                      <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full bg-chart-2 rounded-full"
                          style={{ width: `${server.memory}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-muted-foreground">
                          Almacenamiento
                        </span>
                        <span className="text-xs font-semibold">
                          {server.storage}%
                        </span>
                      </div>
                      <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full bg-chart-3 rounded-full"
                          style={{ width: `${server.storage}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-border pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground">
                          {server.region}
                        </p>
                        <p className="text-sm font-semibold text-primary">
                          ${server.price.toFixed(2)}/mes
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Ver Detalles →
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </main>
      </div>
    </DashboardLayout>
  );
}
