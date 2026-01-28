import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Mail,
  QrCode,
  Facebook,
  MessageSquare,
  Bot,
  Sparkles,
  MessageCircleHeart,
} from "lucide-react";
import { DashboardLayout } from "@/components/pages/dashboard/dashboard-layout";

const campaigns = [
  {
    id: "whatsapp",
    name: "WhatsApp QR",
    description: "AI-powered bulk messaging via WhatsApp sessions",
    icon: QrCode,
    active: true,
    href: "campaign/whatsapp-qr",
  },
  {
    id: "email",
    name: "Email Campaigns",
    description: "Smart email campaigns optimized with AI",
    icon: Mail,
    active: true,
    href: "campaign/emails",
  },
  {
    id: "whatsapp-buisness",
    name: "WhatsApp Buisness API",
    description: "AI-powered bulk messaging via WhatsApp sessions",
    icon: MessageCircleHeart,
    active: false,
    href: "/campaigns/whatsapp",
  },
  {
    id: "meta",
    name: "Meta Ads",
    description: "AI-optimized ads for Facebook & Instagram",
    icon: Facebook,
    active: false,
  },
  {
    id: "sms",
    name: "SMS Marketing",
    description: "Automated SMS campaigns with AI targeting",
    icon: MessageSquare,
    active: false,
  },
];

export default function CampaignsPage() {
  return (
    <DashboardLayout>
      <div className="p-8 space-y-10">
        {/* ======================
          HERO / WELCOME WIDGET
          ====================== */}
        <div className="relative overflow-hidden rounded-2xl border bg-background/60 backdrop-blur-xl p-8 shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-cyan-500/10" />

          <div className="relative flex items-start gap-4">
            <div className="p-3 rounded-xl bg-primary/10 text-primary">
              <Sparkles className="w-6 h-6" />
            </div>

            <div>
              <h1 className="text-2xl font-bold">
                Bienvenido a tu sección de campañas 🚀
              </h1>
              <p className="text-muted-foreground mt-1 max-w-2xl">
                Lanza, automatiza y optimiza campañas inteligentes impulsadas
                por inteligencia artificial en múltiples canales.
              </p>
            </div>
          </div>
        </div>

        {/* ======================
          CAMPAIGNS GRID
          ====================== */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {campaigns.map((c) => {
            const Icon = c.icon;

            if (c.active) {
              return (
                <Link key={c.id} href={c.href || ""}>
                  <Card className="relative h-full cursor-pointer overflow-hidden border bg-background/50 backdrop-blur-xl transition-all hover:-translate-y-1 hover:shadow-xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-purple-500/5 to-cyan-500/10" />

                    <CardContent className="relative p-6 flex flex-col gap-4">
                      <div className="flex items-center justify-between">
                        <div className="p-3 rounded-xl bg-primary/10 text-primary">
                          <Icon className="w-6 h-6" />
                        </div>

                        <Badge>Activo</Badge>
                      </div>

                      <div>
                        <h3 className="font-semibold text-lg">{c.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {c.description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            }

            // ⛔ DESHABILITADO
            return (
              <Card
                key={c.id}
                className="relative h-full cursor-not-allowed overflow-hidden border bg-background/50 backdrop-blur-xl opacity-60"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-purple-500/5 to-cyan-500/10" />

                <CardContent className="relative p-6 flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div className="p-3 rounded-xl bg-primary/10 text-primary">
                      <Icon className="w-6 h-6" />
                    </div>

                    <Badge variant="secondary">Próximamente</Badge>
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg">{c.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {c.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
