"use client";

import React, { useEffect, useState } from "react";
import type { FC } from "react";

interface WhatsAppLinkerProps {
  currentUser: { id: string };
  selectedPlatforms: string[];
}

const API_URL = "http://localhost:8081";

const WhatsAppLinker: FC<WhatsAppLinkerProps> = ({
  currentUser,
  selectedPlatforms,
}) => {
  const [qr, setQr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // 🔥 1) Llamar a /whatsapp/connect/:userId para iniciar sesión
  const startConnection = async () => {
    if (!currentUser?.id) return;

    setLoading(true);

    try {
      await fetch(`${API_URL}/whatsapp/connect/${currentUser.id}`, {
        method: "POST",
      });

      // Activa la lectura de QR
      pollQR();
    } catch (e) {
      console.error("Error iniciando conexión:", e);
    }

    setLoading(false);
  };

  // 🔥 2) Ir consultando el QR cada 2s
  const pollQR = () => {
    const interval = setInterval(async () => {
      const res = await fetch(`${API_URL}/whatsapp/qr/${currentUser.id}`);
      const data = await res.json();

      if (data.qr) {
        setQr(data.qr);
      }

      if (data.ready === true) {
        clearInterval(interval);
        console.log("WhatsApp vinculado");
      }
    }, 2000);
  };

  useEffect(() => {
    if (selectedPlatforms.includes("whatsapp")) {
      startConnection();
    }
  }, [selectedPlatforms]);

  return (
    <div className="flex flex-col gap-4 p-4 border rounded-xl shadow">
      <h2 className="text-xl font-bold">Vincular WhatsApp</h2>

      {!selectedPlatforms.includes("whatsapp") && (
        <p>No has seleccionado WhatsApp aún.</p>
      )}

      {selectedPlatforms.includes("whatsapp") && (
        <>
          {loading && <p>Conectando al dispositivo...</p>}

          {!qr && !loading && <p>Esperando QR...</p>}

          {qr && <img src={qr} alt="qr" className="w-64 h-64" />}
        </>
      )}
    </div>
  );
};

export default WhatsAppLinker;
