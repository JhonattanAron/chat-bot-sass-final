"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";

import { DashboardLayout } from "@/components/pages/dashboard/dashboard-layout";
import { WhatsAppSidebar } from "@/components/WhastApp/whatsapp-sidebar";
import { HomeTab } from "@/components/WhastApp/home-tab";
import { ConfiguracionTab } from "@/components/WhastApp/configuracion-tab";
import { CRMTab } from "@/components/WhastApp/crm-tab";
import { CreateCampaignModal } from "@/components/WhastApp/create-campaign-modal";
import { AI_MODELS } from "@/components/WhastApp/ai-model-selector";
import type { Contact } from "@/components/WhastApp/crm-contacts-manager";

interface Campaign {
  id: string;
  name: string;
  message: string;
  aiModel: string;
  contactCount: number;
  status: "draft" | "scheduled" | "sending" | "completed";
  createdAt: string;
}

export default function WhatsappDashboard() {
  const { data: session } = useSession();

  const [activeTab, setActiveTab] = useState("home");
  const [qr, setQr] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const [phones, setPhones] = useState<string[]>([]);
  const [loadingQr, setLoadingQr] = useState(false);

  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedAIModel, setSelectedAIModel] = useState(AI_MODELS[0].id);
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [campaigns, setCampaigns] = useState<Campaign[]>([
    {
      id: "1",
      name: "Promoción de Verano 2024",
      message: "¡Hola! Te tenemos una sorpresa especial...",
      aiModel: "gpt-4",
      contactCount: 45,
      status: "completed",
      createdAt: "2024-01-15",
    },
    {
      id: "2",
      name: "Oferta Flash",
      message: "Aprovecha nuestro descuento exclusivo...",
      aiModel: "gpt-3.5-turbo",
      contactCount: 32,
      status: "sending",
      createdAt: "2024-01-16",
    },
  ]);

  const connectWhatsapp = async () => {
    setLoadingQr(true);
    setQr(null);
    setConnected(false);

    await axios.post("/api/backend/whatsapp/start-session", {
      userId: session?.binding_id,
    });

    const interval = setInterval(async () => {
      try {
        const res = await axios.get("/api/backend/whatsapp/session-state", {
          params: { userId: session?.binding_id },
        });

        if (res.data.qr) setQr(res.data.qr);

        if (res.data.connected) {
          setConnected(true);
          setQr(null);
          setLoadingQr(false);
          clearInterval(interval);
        }
      } catch (err) {
        console.error(err);
      }
    }, 2000);
  };

  const handleCSV = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split("\n");

      const numbers = lines
        .map((l) => l.split(",")[1] || l)
        .map((n) => n.replace(/"/g, "").trim())
        .filter(Boolean)
        .slice(0, 30);

      setPhones(numbers);
    };
    reader.readAsText(file);
  };

  useEffect(() => {
    if (!session?.binding_id) return;

    axios
      .get("/api/backend/whatsapp/session-state", {
        params: { userId: session.binding_id },
      })
      .then((res) => {
        setQr(res.data.qr ?? null);
        setConnected(res.data.connected ?? false);
      });
  }, [session?.binding_id]);

  return (
    <DashboardLayout>
      <div className="flex h-screen bg-gradient-to-br from-background via-background to-primary/10">
        {/* SIDEBAR */}

        {/* MAIN CONTENT */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-8 max-w-6xl mx-auto">
            {activeTab === "home" && (
              <HomeTab
                campaigns={campaigns}
                onNewCampaign={() => setShowCampaignModal(true)}
                connected={connected}
                contactsCount={contacts.length}
              />
            )}

            {activeTab === "configuracion" && (
              <ConfiguracionTab
                connected={connected}
                loadingQr={loadingQr}
                qr={qr}
                selectedAIModel={selectedAIModel}
                onConnectWhatsapp={connectWhatsapp}
                onModelChange={setSelectedAIModel}
                onCSV={handleCSV}
                phones={phones}
              />
            )}

            {activeTab === "crm" && (
              <CRMTab contacts={contacts} onContactsChange={setContacts} />
            )}
          </div>
        </main>
        <WhatsAppSidebar activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {/* MODAL CREAR CAMPAÑA */}
      <CreateCampaignModal
        open={showCampaignModal}
        onOpenChange={setShowCampaignModal}
        contacts={contacts}
        aiModel={selectedAIModel}
        userId={session?.binding_id || ""}
        onCampaignCreated={(campaign) => {
          const newCampaign: Campaign = {
            id: Date.now().toString(),
            name: campaign.name,
            message: campaign.message,
            aiModel: campaign.aiModel,
            contactCount: campaign.contacts.length,
            status: "draft",
            createdAt: new Date().toISOString(),
          };
          setCampaigns([...campaigns, newCampaign]);
          console.log("[v0] Campaign created:", campaign);
        }}
      />
    </DashboardLayout>
  );
}
