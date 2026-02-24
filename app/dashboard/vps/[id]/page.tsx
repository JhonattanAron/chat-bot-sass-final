"use client";

import { useParams, useRouter } from "next/navigation";
import Header from "@/components/header";
import ServerDetails from "@/components/vps/vos-servers-details";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useEffect } from "react";
import { useServerStore } from "@/store/vpsStore";
import { DashboardLayout } from "@/components/pages/dashboard/dashboard-layout";

export default function ServerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { servers, selectedServer, setSelectedServer } = useServerStore();
  const serverId = params.id as string;

  useEffect(() => {
    const server = servers.find((s) => s.id === serverId);
    if (server && selectedServer?.id !== serverId) {
      setSelectedServer(server);
    }
  }, [serverId, servers, selectedServer, setSelectedServer]);

  const server =
    selectedServer && selectedServer.id === serverId
      ? selectedServer
      : servers.find((s) => s.id === serverId);

  if (!server) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-background text-foreground  flex flex-col">
          <main className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-2">
                Servidor no encontrado
              </h1>
              <p className="text-muted-foreground mb-4">
                El servidor que buscas no existe.
              </p>
              <Button onClick={() => router.push("vps")} className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Volver a la lista
              </Button>
            </div>
          </main>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-background text-foreground  flex flex-col">
        <div className="flex-1 overflow-hidden">
          <div className="h-full flex flex-col">
            <div className="border-b border-border bg-card/50 backdrop-blur p-4">
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => router.push("/vps")}
              >
                <ArrowLeft className="w-4 h-4" />
                Volver a Servidores
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto">
              <ServerDetails server={server} />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
