"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Users, Zap, MessageSquare } from "lucide-react";

interface Campaign {
  id: string;
  name: string;
  aiModel: string;
  contactCount: number;
  status: "draft" | "scheduled" | "sending" | "completed";
  createdAt: string;
}

interface CampaignListProps {
  campaigns: Campaign[];
}

const statusConfig = {
  draft: {
    label: "Borrador",
    color: "bg-gray-100 text-gray-800",
    icon: "🔄",
  },
  scheduled: {
    label: "Programada",
    color: "bg-blue-100 text-blue-800",
    icon: "⏰",
  },
  sending: {
    label: "Enviando",
    color: "bg-yellow-100 text-yellow-800",
    icon: "📤",
  },
  completed: {
    label: "Completada",
    color: "bg-green-100 text-green-800",
    icon: "✓",
  },
};

export function CampaignList({ campaigns }: CampaignListProps) {
  if (campaigns.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-12">
            <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
            <p className="text-muted-foreground">No hay campañas creadas</p>
            <p className="text-sm text-muted-foreground/70">
              Crea tu primera campaña para comenzar
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      {campaigns.map((campaign) => {
        const status = statusConfig[campaign.status as keyof typeof statusConfig];

        return (
          <Card key={campaign.id} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-lg">{campaign.name}</h3>
                    <Badge className={status.color}>{status.label}</Badge>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mt-4">
                    <div className="flex items-center gap-2 text-sm">
                      <div className="p-2 rounded bg-primary/10 text-primary">
                        <Users className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">Contactos</p>
                        <p className="font-semibold">{campaign.contactCount}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <div className="p-2 rounded bg-purple-100 text-purple-600">
                        <Zap className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">Modelo IA</p>
                        <p className="font-semibold text-xs">
                          {campaign.aiModel.split("-")[1]?.toUpperCase()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <div className="p-2 rounded bg-green-100 text-green-600">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">Creada</p>
                        <p className="font-semibold text-xs">
                          {new Date(campaign.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
