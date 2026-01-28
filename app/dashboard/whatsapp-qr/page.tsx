"use client";

import { useState } from "react";
import axios from "axios";
import QRCode from "react-qr-code";
import { DashboardLayout } from "@/components/dashboard-layout";
import { useSession } from "next-auth/react";

export default function WhatsappTestPage() {
  const { data: session } = useSession();
  const [qr, setQr] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const [phones, setPhones] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  /* ======================
     CONECTAR WHATSAPP
  ====================== */
  const connectWhatsapp = async () => {
    setLoading(true);
    try {
      const res = await axios.post("/api/backend/whatsapp/start-session", {
        userId: session?.binding_id,
      });

      // El backend debe devolver { qr, connected }
      const qrData = res.data.qr as string;
      const isConnected = res.data.connected as boolean;

      if (qrData && !isConnected) setQr(qrData);
      if (isConnected) {
        setConnected(true);
        setQr(null);
      }
    } catch (err) {
      console.error(err);
      alert("Error al generar QR");
    } finally {
      setLoading(false);
    }
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
        .map((l) => l.split(",")[1] || l) // por si viene name,number
        .map((n) => n.replace(/"/g, "").trim())
        .filter(Boolean)
        .slice(0, 30); // máximo 30
      setPhones(numbers);
    };
    reader.readAsText(file);
  };

  /* ======================
     ENVIAR MENSAJES
  ====================== */
  const sendBulk = async () => {
    if (!message) return alert("Escribe un mensaje");
    if (phones.length === 0) return alert("No hay números cargados");

    // Revisar estado de WhatsApp antes de enviar
    try {
      const statusRes = await axios.get(
        "/api/backend/whatsapp/session-status",
        {
          params: { userId: session?.binding_id },
        },
      );

      if (!statusRes.data.connected) {
        setQr(null);
        setConnected(false);
        return alert(
          "WhatsApp no está conectado. Escanea el QR para reconectar.",
        );
      }
    } catch (err) {
      console.error(err);
      return alert("Error al verificar el estado de WhatsApp");
    }

    setLoading(true);
    try {
      await axios.post("/api/backend/whatsapp/bulk", {
        userId: session?.binding_id,
        phones,
        message,
      });
      alert(`Mensajes enviados: ${phones.length}`);
    } catch (err) {
      console.error(err);
      alert("Error al enviar los mensajes");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6">
        <div className="bg-gray-800 text-gray-100 p-8 rounded-xl w-full max-w-md shadow-lg">
          <h1 className="text-center text-2xl font-bold mb-6">
            📲 WhatsApp Bulk Test
          </h1>

          {/* BOTÓN CONECTAR */}
          {!connected && (
            <button
              onClick={connectWhatsapp}
              disabled={loading}
              className="w-full bg-green-500 hover:bg-green-600 text-gray-900 font-semibold py-3 rounded-lg mb-6 transition"
            >
              {loading ? "Generando QR..." : "🔗 Conectar WhatsApp"}
            </button>
          )}

          {/* QR */}
          {qr && (
            <div className="flex flex-col items-center mb-6">
              <p className="mb-2">Escanea este QR con tu WhatsApp</p>
              <QRCode value={qr} size={180} />
            </div>
          )}

          {/* Conectado */}
          {connected && (
            <p className="text-center text-green-400 font-semibold mb-6">
              ✅ WhatsApp conectado
            </p>
          )}

          <hr className="border-gray-700 my-4" />

          {/* CSV */}
          <label className="block mb-2 font-medium">
            📂 Subir CSV de números
          </label>
          <input
            type="file"
            accept=".csv"
            onChange={(e) => e.target.files && handleCSV(e.target.files[0])}
            className="w-full text-gray-200 mb-2"
          />
          {phones.length > 0 && (
            <p className="text-sm text-gray-400 mb-4">
              Números cargados: {phones.length}
            </p>
          )}

          {/* MENSAJE */}
          <label className="block mb-2 font-medium">✉️ Mensaje</label>
          <textarea
            rows={4}
            placeholder="Escribe el mensaje que se enviará"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full p-2 rounded-lg bg-gray-700 border border-gray-600 text-gray-100 resize-none mb-4"
          />

          <button
            onClick={sendBulk}
            disabled={loading || phones.length === 0 || !connected}
            className="w-full bg-blue-600 hover:bg-blue-700 text-gray-100 font-semibold py-3 rounded-lg transition"
          >
            {loading ? "Enviando..." : `🚀 Enviar mensajes (${phones.length})`}
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
