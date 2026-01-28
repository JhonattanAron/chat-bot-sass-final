import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Facebook, Sparkles } from "lucide-react";
import { DashboardLayout } from "@/components/pages/dashboard/dashboard-layout";

const scrapers = [
  {
    id: "google-search",
    name: "Google Search Scraper",
    description: "Extrae leads, negocios y datos desde Google Search con IA",
    icon: Search,
    active: true,
    href: "scraping/google-search",
  },
  {
    id: "google-maps",
    name: "Google Maps Scraper",
    description:
      "Obtén negocios locales, reviews y contactos desde Google Maps",
    icon: MapPin,
    active: true,
    href: "/scraping/google-maps",
  },
  {
    id: "meta",
    name: "Meta Scraper",
    description: "Scraping de Facebook & Instagram Ads y páginas públicas",
    icon: Facebook,
    active: false,
  },
];

export default function ScrapingPage() {
  return (
    <DashboardLayout>
      <div className="p-8 space-y-10">
        {/* ======================
          HERO / WELCOME
          ====================== */}
        <div className="relative overflow-hidden rounded-2xl border bg-background/60 backdrop-blur-xl p-8 shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-cyan-500/10" />

          <div className="relative flex items-start gap-4">
            <div className="p-3 rounded-xl bg-primary/10 text-primary">
              <Sparkles className="w-6 h-6" />
            </div>

            <div>
              <h1 className="text-2xl font-bold">Scraping inteligente 🔎</h1>
              <p className="text-muted-foreground mt-1 max-w-2xl">
                Extrae datos estratégicos desde buscadores y plataformas
                sociales usando automatización e inteligencia artificial.
              </p>
            </div>
          </div>
        </div>

        {/* ======================
          SCRAPING GRID
          ====================== */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {scrapers.map((s) => {
            const Icon = s.icon;

            if (s.active) {
              return (
                <Link key={s.id} href={s.href || ""}>
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
                        <h3 className="font-semibold text-lg">{s.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {s.description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            }

            // ⛔ PRÓXIMAMENTE
            return (
              <Card
                key={s.id}
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
                    <h3 className="font-semibold text-lg">{s.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {s.description}
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
