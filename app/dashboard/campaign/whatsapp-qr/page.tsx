"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import QRCode from "react-qr-code";
import { useSession } from "next-auth/react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

import { QrCode, Send, UploadCloud, CheckCircle } from "lucide-react";
import { DashboardLayout } from "@/components/pages/dashboard/dashboard-layout";

export default function WhatsappTestPage() {
  const { data: session } = useSession();

  const [qr, setQr] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const [phones, setPhones] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [loadingQr, setLoadingQr] = useState(false);
  const [loadingSend, setLoadingSend] = useState(false);

  /* ======================
     CONECTAR WHATSAPP
  ====================== */
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

  /* ======================
     CSV
  ====================== */
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

  /* ======================
     ENVIAR MENSAJES
  ====================== */
  const sendBulk = async () => {
    if (!message) return alert("Escribe un mensaje");
    if (phones.length === 0) return alert("No hay números");

    setLoadingSend(true);
    try {
      await axios.post("/api/backend/whatsapp/bulk", {
        userId: session?.binding_id,
        phones,
        message,
      });
      alert("Mensajes enviados");
    } catch (err) {
      console.error(err);
      alert("Error al enviar");
    } finally {
      setLoadingSend(false);
    }
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
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/10 flex items-center justify-center p-6">
        <Card className="w-full max-w-lg border bg-background/60 backdrop-blur-xl shadow-xl">
          <CardContent className="p-8 space-y-6">
            {/* HEADER */}
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-primary/10 text-primary">
                <QrCode className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold">WhatsApp Campaigns</h1>
                <p className="text-sm text-muted-foreground">
                  Envíos masivos impulsados por IA
                </p>
              </div>
            </div>

            {/* STATUS */}
            {connected ? (
              <Badge className="w-fit flex items-center gap-1">
                <CheckCircle className="w-4 h-4" /> Conectado
              </Badge>
            ) : (
              <Badge variant="secondary">No conectado</Badge>
            )}

            {/* CONNECT */}
            {!connected && (
              <Button
                onClick={connectWhatsapp}
                disabled={loadingQr}
                className="w-full"
              >
                {loadingQr ? "Generando QR..." : "Conectar WhatsApp"}
              </Button>
            )}

            {/* QR */}
            {qr && (
              <div className="flex flex-col items-center gap-3">
                <p className="text-sm text-muted-foreground">
                  Escanea el QR con WhatsApp
                </p>
                <div className="p-4 bg-white rounded-xl">
                  <QRCode value={qr} size={180} />
                </div>
              </div>
            )}

            <Separator />

            {/* CSV */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <UploadCloud className="w-4 h-4" />
                Subir CSV de números
              </label>
              <Input
                type="file"
                accept=".csv"
                onChange={(e) => e.target.files && handleCSV(e.target.files[0])}
              />
              {phones.length > 0 && (
                <p className="text-xs text-muted-foreground">
                  Números cargados: {phones.length}
                </p>
              )}
            </div>

            {/* MESSAGE */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Mensaje</label>
              <Textarea
                rows={4}
                placeholder="Escribe el mensaje que se enviará"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            {/* SEND */}
            <Button
              onClick={sendBulk}
              disabled={!connected || loadingSend || phones.length === 0}
              className="w-full"
            >
              {loadingSend ? (
                "Enviando..."
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Enviar mensajes ({phones.length})
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
