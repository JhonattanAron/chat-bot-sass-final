"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Send, Eye, Plus } from "lucide-react";
import { Badge } from "../ui/badge";

interface Campaign {
  id: string;
  name: string;
  message: string;
  aiModel: string;
  contactCount: number;
  status: "draft" | "scheduled" | "sending" | "completed";
  createdAt: string;
}

interface HomeTabProps {
  campaigns: Campaign[];
  onNewCampaign: () => void;
  connected: boolean;
  contactsCount: number;
}

export function HomeTab({
  campaigns,
  onNewCampaign,
  connected,
  contactsCount,
}: HomeTabProps) {
  const statusConfig = {
    draft: { label: "Borrador", color: "bg-gray-100 text-gray-800" },
    scheduled: { label: "Programada", color: "bg-blue-100 text-blue-800" },
    sending: { label: "Enviando", color: "bg-yellow-100 text-yellow-800" },
    completed: { label: "Completada", color: "bg-green-100 text-green-800" },
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">Campañas WhatsApp</h1>
          <p className="text-muted-foreground mt-1">
            Gestiona todas tus campañas de WhatsApp en un solo lugar
          </p>
        </div>
        <Button
          onClick={onNewCampaign}
          disabled={!connected}
          size="lg"
          className="gap-2"
        >
          <Plus className="w-4 h-4" />
          Nueva Campaña
        </Button>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-background/50 backdrop-blur-xl border">
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground mb-1">Total Campañas</p>
            <p className="text-3xl font-bold">{campaigns.length}</p>
          </CardContent>
        </Card>
        <Card className="bg-background/50 backdrop-blur-xl border">
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground mb-1">Completadas</p>
            <p className="text-3xl font-bold">
              {campaigns.filter((c) => c.status === "completed").length}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-background/50 backdrop-blur-xl border">
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground mb-1">En proceso</p>
            <p className="text-3xl font-bold">
              {campaigns.filter((c) => c.status === "sending").length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* CAMPAIGNS LIST */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Todas las Campañas</h2>
        {campaigns.length === 0 ? (
          <Card className="border bg-background/50 backdrop-blur-xl">
            <CardContent className="pt-12 pb-12">
              <div className="text-center">
                <Send className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
                <p className="text-muted-foreground">
                  No hay campañas creadas aún
                </p>
                <p className="text-sm text-muted-foreground/70">
                  Crea tu primera campaña para comenzar
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {campaigns.map((campaign) => {
              const status =
                statusConfig[campaign.status as keyof typeof statusConfig];
              return (
                <Card
                  key={campaign.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow bg-background/50 backdrop-blur-xl border"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-3">
                          <h3 className="font-semibold text-lg">
                            {campaign.name}
                          </h3>
                          <Badge className={status.color}>{status.label}</Badge>
                        </div>

                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                          {campaign.message}
                        </p>

                        <div className="grid grid-cols-4 gap-4">
                          <div className="p-3 bg-muted/50 rounded-lg">
                            <p className="text-xs text-muted-foreground">
                              Contactos
                            </p>
                            <p className="font-bold text-lg mt-1">
                              {campaign.contactCount}
                            </p>
                          </div>
                          <div className="p-3 bg-muted/50 rounded-lg">
                            <p className="text-xs text-muted-foreground">
                              Modelo IA
                            </p>
                            <p className="font-bold text-sm mt-1">
                              {campaign.aiModel}
                            </p>
                          </div>
                          <div className="p-3 bg-muted/50 rounded-lg">
                            <p className="text-xs text-muted-foreground">
                              Creada
                            </p>
                            <p className="font-bold text-sm mt-1">
                              {new Date(
                                campaign.createdAt,
                              ).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-end">
                            <Link href={`whatsapp-qr/campaign/${campaign.id}`}>
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-full gap-2 bg-transparent"
                              >
                                <Eye className="w-4 h-4" />
                                Ver Detalles
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
