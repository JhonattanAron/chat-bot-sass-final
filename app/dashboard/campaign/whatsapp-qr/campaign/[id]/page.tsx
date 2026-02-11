"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  MessageSquare,
  Users,
  Zap,
  Send,
  Copy,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { DashboardLayout } from "@/components/pages/dashboard/dashboard-layout";

// Datos de campaña de ejemplo
const mockCampaigns: Record<string, any> = {};

const statusConfig = {
  draft: {
    label: "Borrador",
    color: "bg-gray-100 text-gray-800",
    description: "La campaña aún no ha sido enviada",
  },
  scheduled: {
    label: "Programada",
    color: "bg-blue-100 text-blue-800",
    description: "La campaña está programada para ser enviada",
  },
  sending: {
    label: "Enviando",
    color: "bg-yellow-100 text-yellow-800",
    description: "La campaña se encuentra en proceso de envío",
  },
  completed: {
    label: "Completada",
    color: "bg-green-100 text-green-800",
    description: "La campaña ha sido enviada con éxito",
  },
};

export default function CampaignDetailPage() {
  const params = useParams();
  const campaignId = params.id as string;

  const campaign = mockCampaigns[campaignId];

  if (!campaign) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/10 p-6">
          <div className="max-w-4xl mx-auto">
            <Link href="/whatsapp">
              <Button variant="outline" className="gap-2 mb-6 bg-transparent">
                <ArrowLeft className="w-4 h-4" />
                Volver a Campañas
              </Button>
            </Link>

            <Card className="border bg-background/50 backdrop-blur-xl">
              <CardContent className="pt-12 pb-12">
                <div className="text-center">
                  <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
                  <p className="text-muted-foreground">Campaña no encontrada</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const status = statusConfig[campaign.status as keyof typeof statusConfig];

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/10 p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header con botón volver */}
          <Link href="/dashboard/campaign/whatsapp-qr">
            <Button variant="outline" className="gap-2 bg-transparent">
              <ArrowLeft className="w-4 h-4" />
              Volver a Campañas
            </Button>
          </Link>

          {/* Información Principal */}
          <Card className="border bg-background/50 backdrop-blur-xl overflow-hidden">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h1 className="text-3xl font-bold">{campaign.name}</h1>
                      <Badge className={status.color}>{status.label}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {status.description}
                    </p>
                  </div>
                </div>

                <Separator />

                {/* Estadísticas principales */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <div className="p-4 bg-muted/50 rounded-lg border">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Enviados
                        </p>
                        <p className="text-2xl font-bold mt-1">
                          {campaign.sentCount}
                        </p>
                      </div>
                      <Send className="w-8 h-8 text-blue-500 opacity-50" />
                    </div>
                  </div>

                  <div className="p-4 bg-muted/50 rounded-lg border">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Entregados
                        </p>
                        <p className="text-2xl font-bold mt-1">
                          {campaign.deliveredCount}
                        </p>
                      </div>
                      <CheckCircle className="w-8 h-8 text-green-500 opacity-50" />
                    </div>
                  </div>

                  <div className="p-4 bg-muted/50 rounded-lg border">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Leídos</p>
                        <p className="text-2xl font-bold mt-1">
                          {campaign.readCount}
                        </p>
                      </div>
                      <Eye className="w-8 h-8 text-purple-500 opacity-50" />
                    </div>
                  </div>

                  <div className="p-4 bg-muted/50 rounded-lg border">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Respuestas
                        </p>
                        <p className="text-2xl font-bold mt-1">
                          {campaign.responseCount}
                        </p>
                      </div>
                      <MessageSquare className="w-8 h-8 text-orange-500 opacity-50" />
                    </div>
                  </div>
                </div>

                {/* Información general */}
                <div className="grid gap-4 md:grid-cols-3 pt-4">
                  <div>
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Fecha de creación
                    </p>
                    <p className="font-semibold mt-1">
                      {new Date(campaign.createdAt).toLocaleDateString("es-ES")}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <Zap className="w-4 h-4" />
                      Modelo IA
                    </p>
                    <Badge className="mt-1">{campaign.aiModel}</Badge>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Total de contactos
                    </p>
                    <p className="font-semibold mt-1">
                      {campaign.contactCount}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Mensaje de la campaña */}
          <Card className="border bg-background/50 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Mensaje de la Campaña
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-6 bg-muted/50 rounded-lg border border-dashed">
                <p className="text-base leading-relaxed whitespace-pre-wrap">
                  {campaign.message}
                </p>
              </div>

              <div className="flex gap-3 justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 bg-transparent"
                  onClick={() =>
                    navigator.clipboard.writeText(campaign.message)
                  }
                >
                  <Copy className="w-4 h-4" />
                  Copiar Mensaje
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Lista de contactos */}
          <Card className="border bg-background/50 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Contactos de la Campaña ({campaign.contactsList.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {campaign.contactsList.map((contact: any) => (
                  <div
                    key={contact.id}
                    className="p-4 bg-muted/30 rounded-lg border flex items-center justify-between hover:bg-muted/50 transition-colors"
                  >
                    <div>
                      <p className="font-medium">{contact.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {contact.phone}
                      </p>
                    </div>
                    <Badge variant="secondary">Enviado</Badge>
                  </div>
                ))}
              </div>

              {campaign.contactsList.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-6 gap-2 bg-transparent"
                >
                  <Download className="w-4 h-4" />
                  Descargar lista de contactos
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Estadísticas extendidas */}
          <Card className="border bg-background/50 backdrop-blur-xl">
            <CardHeader>
              <CardTitle>Estadísticas Detalladas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm">Tasa de entrega</p>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500"
                        style={{
                          width: `${(campaign.deliveredCount / campaign.sentCount) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="text-sm font-semibold">
                      {Math.round(
                        (campaign.deliveredCount / campaign.sentCount) * 100,
                      )}
                      %
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm">Tasa de lectura</p>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-purple-500"
                        style={{
                          width: `${(campaign.readCount / campaign.deliveredCount) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="text-sm font-semibold">
                      {Math.round(
                        (campaign.readCount / campaign.deliveredCount) * 100,
                      )}
                      %
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm">Tasa de respuesta</p>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-orange-500"
                        style={{
                          width: `${(campaign.responseCount / campaign.readCount) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="text-sm font-semibold">
                      {Math.round(
                        (campaign.responseCount / campaign.readCount) * 100,
                      )}
                      %
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

// Importar los iconos faltantes
import { CheckCircle, Eye } from "lucide-react";
