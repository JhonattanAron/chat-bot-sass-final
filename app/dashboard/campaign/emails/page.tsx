"use client";

import { DashboardLayout } from "@/components/pages/dashboard/dashboard-layout";
import { useSession } from "next-auth/react";
import { useEffect, useState, useRef } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";

type EmailsEnviados = {
  correctos: number;
  incorrectos: number;
};

type CampaignStatus = {
  id: string;
  status: string;
  scraping_exitoso: boolean;
  urls_procesadas: number;
  informacion_extraida: number;
  emails_encontrados: number;
  emails_normalizados: boolean;
  emails_enviados: EmailsEnviados | null;
  error: string | null;
  updatedAt: string;
};

export default function CampaignPage() {
  const { data: session } = useSession();
  const [searchQuery, setSearchQuery] = useState("");
  const [campaigns, setCampaigns] = useState<CampaignStatus[]>([]);
  const [loading, setLoading] = useState(false);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  const runCampaign = async () => {
    if (!searchQuery || !session?.binding_id) return;

    setLoading(true);
    try {
      const res = await fetch("/api/backend/campaign-automated/emails/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: session.binding_id,
          searchQuery,
        }),
      });

      const data = await res.json();
      setCampaigns((prev) => [data, ...prev]);
      startPolling();
    } finally {
      setLoading(false);
    }
  };

  const fetchCampaignStatus = async () => {
    if (!session?.binding_id) return;
    const res = await fetch(
      `/api/backend/campaign-automated/email/${session.binding_id}/status`,
    );
    const data = await res.json();
    setCampaigns(data);
  };

  const startPolling = () => {
    if (pollingRef.current) return;
    pollingRef.current = setInterval(fetchCampaignStatus, 5000);
  };

  useEffect(() => {
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, []);

  const statusColor = (
    status: string,
  ): "default" | "secondary" | "destructive" | "outline" => {
    if (status === "completed") return "default";
    if (status === "failed") return "destructive";
    return "secondary";
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* HEADER */}
        <div>
          <h1 className="text-3xl font-bold">📧 Campañas de Email</h1>
          <p className="text-muted-foreground">
            Scraping + extracción + envío automático
          </p>
        </div>

        {/* CREAR CAMPAÑA */}
        <Card>
          <CardHeader>
            <CardTitle>Crear nueva campaña</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-4">
            <Input
              placeholder="Ej: clínicas estéticas en Quito"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button onClick={runCampaign} disabled={loading}>
              {loading ? "Ejecutando..." : "🚀 Lanzar"}
            </Button>
          </CardContent>
        </Card>

        {/* TABLA */}
        <Card>
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle>Estado de campañas</CardTitle>
            <Button variant="outline" onClick={fetchCampaignStatus}>
              🔄 Actualizar
            </Button>
          </CardHeader>

          <CardContent>
            {campaigns.length === 0 ? (
              <p className="text-muted-foreground">No hay campañas aún.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Progreso</TableHead>
                    <TableHead>Emails</TableHead>
                    <TableHead>Envíos</TableHead>
                    <TableHead>Error</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {campaigns.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell className="text-xs">{c.id}</TableCell>

                      <TableCell>
                        <Badge variant={statusColor(c.status)}>
                          {c.status}
                        </Badge>
                      </TableCell>

                      <TableCell className="w-48">
                        <Progress
                          value={
                            c.emails_encontrados > 0
                              ? Math.min(
                                  (c.emails_encontrados /
                                    Math.max(c.urls_procesadas, 1)) *
                                    100,
                                  100,
                                )
                              : 10
                          }
                        />
                      </TableCell>

                      <TableCell>
                        <div className="text-xs">
                          📄 URLs: {c.urls_procesadas}
                          <br />
                          📧 Emails: {c.emails_encontrados}
                        </div>
                      </TableCell>

                      <TableCell className="text-xs">
                        {c.emails_enviados ? (
                          <>
                            ✅ {c.emails_enviados.correctos}
                            <br />❌ {c.emails_enviados.incorrectos}
                          </>
                        ) : (
                          "-"
                        )}
                      </TableCell>

                      <TableCell className="text-xs text-red-500">
                        {c.error || "-"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
