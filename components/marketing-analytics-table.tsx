"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mail, ArrowLeft, BarChart3 } from "lucide-react";

interface EmailLog {
  _id: string;
  messageId: string;
  to: string;
  subject: string;
  type: string;
  userId: string;
  status: "sent" | "opened" | "replied" | "failed";
  batch: string;
  createdAt: string;
  updatedAt: string;
}

interface Campaign {
  name: string;
  totalEmails: number;
  sent: number;
  opened: number;
  replied: number;
  failed: number;
  lastSentAt: string;
}

export function MarketingCampaignTracker({
  emailLogs = [],
}: {
  emailLogs?: EmailLog[];
}) {
  const [selectedBatch, setSelectedBatch] = useState<string | null>(null);

  // Agrupar y procesar datos por batch/campaña
  const campaigns: Record<string, Campaign> = emailLogs.reduce((acc, email) => {
    if (!acc[email.batch]) {
      acc[email.batch] = {
        name: email.batch,
        totalEmails: 0,
        sent: 0,
        opened: 0,
        replied: 0,
        failed: 0,
        lastSentAt: email.createdAt,
      };
    }

    acc[email.batch].totalEmails += 1;
    acc[email.batch][
      email.status as "sent" | "opened" | "replied" | "failed"
    ] += 1;

    // Actualizar fecha más reciente
    if (new Date(email.createdAt) > new Date(acc[email.batch].lastSentAt)) {
      acc[email.batch].lastSentAt = email.createdAt;
    }

    return acc;
  }, {} as Record<string, Campaign>);

  const campaignList = Object.values(campaigns);
  const selectedCampaignEmails = selectedBatch
    ? emailLogs.filter((email) => email.batch === selectedBatch)
    : [];

  const getStatusColor = (status: "sent" | "opened" | "replied" | "failed") => {
    switch (status) {
      case "replied":
        return "text-green-600 border-green-200";
      case "opened":
        return "text-blue-600 border-blue-200";
      case "sent":
        return "text-muted-foreground";
      case "failed":
        return "text-red-600 border-red-200";
      default:
        return "";
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      sent: "Enviado",
      opened: "Abierto",
      replied: "Respondido",
      failed: "Error",
    };
    return labels[status] || status;
  };

  // Vista de campañas
  if (!selectedBatch) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-6 w-6" />
          <h2 className="text-2xl font-bold">Campañas de Marketing</h2>
        </div>

        {campaignList.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">
              No hay campañas para mostrar
            </p>
          </Card>
        ) : (
          <div className="rounded-md border bg-white">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Campaña</TableHead>
                  <TableHead className="text-center">Total</TableHead>
                  <TableHead className="text-center">Enviados</TableHead>
                  <TableHead className="text-center">Abiertos</TableHead>
                  <TableHead className="text-center">Respondidos</TableHead>
                  <TableHead className="text-center">Errores</TableHead>
                  <TableHead>Última actividad</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {campaignList.map((campaign) => (
                  <TableRow key={campaign.name}>
                    <TableCell className="font-semibold">
                      {campaign.name}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline">{campaign.totalEmails}</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary">{campaign.sent}</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge className="bg-blue-100 text-blue-800">
                        {campaign.opened}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge className="bg-green-100 text-green-800">
                        {campaign.replied}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant={
                          campaign.failed > 0 ? "destructive" : "outline"
                        }
                      >
                        {campaign.failed}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(campaign.lastSentAt).toLocaleDateString(
                        "es-ES",
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedBatch(campaign.name)}
                      >
                        Ver
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Button
        variant="outline"
        onClick={() => setSelectedBatch(null)}
        className="gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a Campañas
      </Button>

      <div className="flex items-center gap-2">
        <Mail className="h-6 w-6" />
        <h2 className="text-2xl font-bold">Campaña: {selectedBatch}</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-5">
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">Total de correos</p>
          <p className="text-2xl font-bold">{selectedCampaignEmails.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">Enviados</p>
          <p className="text-2xl font-bold text-muted-foreground">
            {selectedCampaignEmails.filter((e) => e.status === "sent").length}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">Abiertos</p>
          <p className="text-2xl font-bold text-blue-600">
            {selectedCampaignEmails.filter((e) => e.status === "opened").length}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">Respondidos</p>
          <p className="text-2xl font-bold text-green-600">
            {
              selectedCampaignEmails.filter((e) => e.status === "replied")
                .length
            }
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">Errores</p>
          <p className="text-2xl font-bold text-red-600">
            {selectedCampaignEmails.filter((e) => e.status === "failed").length}
          </p>
        </Card>
      </div>

      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Destinatario</TableHead>
              <TableHead>Asunto</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Fecha de envío</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {selectedCampaignEmails.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  <p className="text-muted-foreground">
                    No hay correos en esta campaña
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              selectedCampaignEmails.map((email) => (
                <TableRow key={email._id}>
                  <TableCell>
                    <div className="font-semibold text-sm break-all">
                      {email.to}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-muted-foreground truncate max-w-xs">
                      {email.subject}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={getStatusColor(
                        email.status as "sent" | "opened" | "replied" | "failed"
                      )}
                    >
                      {getStatusLabel(email.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{email.type}</Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {new Date(email.createdAt).toLocaleDateString("es-ES", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
