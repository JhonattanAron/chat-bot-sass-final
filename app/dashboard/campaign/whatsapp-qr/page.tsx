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
  const [count, setCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

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

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const res = await fetch("/api/backend/crm/contacts", {
          credentials: "include",
        });

        if (!res.ok) throw new Error("Error al obtener contactos");

        const result = await res.json();

        setContacts(
          result.data.map((item: any) => ({
            id: item._id,
            name: item.name,
            phone: item.phone ?? "",
            tags: item.tags ?? [],
          })),
        );
      } catch (err) {
        console.error("Error cargando contactos:", err);
      }
    };

    fetchContacts();
  }, []);

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
        setQr(res.data.qr || null);
        setConnected(res.data.connected);
      });
  }, [session?.binding_id]);

  useEffect(() => {
    let cancelled = false;

    const fetchCount = async () => {
      try {
        setLoading(true);

        const res = await fetch("/api/backend/crm/contacts/count", {
          credentials: "include",
        });

        if (!res.ok) throw new Error("Error al obtener el conteo");

        const data = await res.json();

        if (!cancelled) {
          setCount(data.count ?? 0);
        }
      } catch (err) {
        if (!cancelled) {
          setError("No se pudo cargar el total de contactos");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchCount();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleCreateCampaign = async (payload: {
    name: string;
    message: string;
    assistantId: string;
  }) => {
    try {
      if (contacts.length === 0) {
        throw new Error("No hay contactos con teléfono");
      }

      // Prepara los contactos en el formato que espera el backend
      const contactPayload = contacts
        .filter((c) => c.phone) // solo contactos con teléfono
        .map((c) => ({
          name: c.name || undefined,
          phone: c.phone,
        }));

      const res = await fetch("/api/backend/whastapp-qr/campaigns", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: session?.binding_id, // exacto como espera el backend
          assistant_id: payload.assistantId, // nombre correcto
          name: payload.name,
          description: "", // opcional
          message_template: payload.message, // exacto
          contact: contactPayload, // singular y formato correcto
          // scheduled_at: optional si quieres programarla
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Error creando campaña");
      }

      const data = await res.json();

      // Reflejar en UI
      const newCampaign = data.campaign;

      return newCampaign;
    } catch (err) {
      console.error("Error creando campaña:", err);
      throw err;
    }
  };

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
        onCampaignCreated={async (campaignForm) => {
          const campaign = await handleCreateCampaign({
            name: campaignForm.name,
            message: campaignForm.message,
            assistantId: campaignForm.aiModel,
          });

          console.log("[v0] Campaign created:", campaign);
          setShowCampaignModal(false);
        }}
      />
    </DashboardLayout>
  );
}
