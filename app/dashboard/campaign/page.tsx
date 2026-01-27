// pages/campaigns.tsx
"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { useSession } from "next-auth/react";
import { useEffect, useState, useRef } from "react";

type EmailsEnviados = {
  correctos: number;
  incorrectos: number;
  _id?: string;
};

type CampaignStatus = {
  id: string;
  status: string;
  scraping_exitoso: boolean;
  urls_procesadas: number;
  informacion_extraida: number;
  emails_encontrados: number;
  emails_normalizados: boolean;
  emails_enviados: EmailsEnviados | null;
  error: string | null;
  updatedAt: string;
};

export default function CampaignPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [campaigns, setCampaigns] = useState<CampaignStatus[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const { data: session } = useSession();

  // Ref para guardar el polling interval
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  const runCampaign = async () => {
    if (!searchQuery) {
      alert("Debes ingresar userId y searchQuery");
      return;
    }
    const userId = session?.binding_id;

    if (!userId) {
      alert("No se encontró userId en la sesión");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/backend/campaign-automated/emails/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, searchQuery }),
      });

      if (!res.ok) throw new Error("Error al crear la campaña");

      const data = await res.json();
      setMessage("Campaña creada correctamente");
      // Agregamos la campaña nueva al estado
      setCampaigns((prev) => [...prev, data]);
      // Iniciamos el polling
      startPolling();
    } catch (err: any) {
      setMessage(err.message || "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  const fetchCampaignStatus = async () => {
    const userId = session?.binding_id;
    if (!userId) return;

    try {
      const res = await fetch(
        `/api/backend/campaign-automated/email/${userId}/status`,
      );
      if (!res.ok) throw new Error("No se encontraron campañas");

      const data: CampaignStatus[] = await res.json();
      setCampaigns(data);
    } catch (err: any) {
      setMessage(err.message || "Error cargando campañas");
    }
  };

  const startPolling = () => {
    if (pollingRef.current) return; // ya está corriendo
    pollingRef.current = setInterval(async () => {
      await fetchCampaignStatus();

      // Si todas las campañas ya están completed o failed, detenemos el polling
      const running = campaigns.some(
        (c) => c.status !== "completed" && c.status !== "failed",
      );
      if (!running && pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    }, 5000); // cada 5 segundos
  };

  // Detener polling al desmontar
  useEffect(() => {
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, []);

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Campañas Automatizadas</h1>

        <div className="mb-6 p-4 border rounded shadow-sm">
          <label className="block mb-2 font-semibold">Search Query:</label>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-2 border rounded mb-4"
          />

          <button
            onClick={runCampaign}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Ejecutando..." : "Crear Campaña"}
          </button>

          {message && <p className="mt-2 text-red-600">{message}</p>}
        </div>

        <div>
          <h2 className="text-xl font-bold mb-2">Estado de campañas</h2>
          <button
            onClick={fetchCampaignStatus}
            className="mb-4 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Refrescar Estado
          </button>

          {campaigns.length === 0 ? (
            <p>No hay campañas para este userId.</p>
          ) : (
            <table className="w-full border-collapse border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2">ID</th>
                  <th className="border p-2">Estado</th>
                  <th className="border p-2">Scraping</th>
                  <th className="border p-2">URLs</th>
                  <th className="border p-2">Info Extraída</th>
                  <th className="border p-2">Emails Encontrados</th>
                  <th className="border p-2">Emails Normalizados</th>
                  <th className="border p-2">Emails Enviados</th>
                  <th className="border p-2">Error</th>
                  <th className="border p-2">Actualizado</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map((c) => (
                  <tr key={c.id}>
                    <td className="border p-1 text-xs">{c.id}</td>
                    <td className="border p-1 text-xs">{c.status}</td>
                    <td className="border p-1 text-xs">
                      {c.scraping_exitoso ? "Sí" : "No"}
                    </td>
                    <td className="border p-1 text-xs">{c.urls_procesadas}</td>
                    <td className="border p-1 text-xs">
                      {c.informacion_extraida}
                    </td>
                    <td className="border p-1 text-xs">
                      {c.emails_encontrados}
                    </td>
                    <td className="border p-1 text-xs">
                      {c.emails_normalizados ? "Sí" : "No"}
                    </td>
                    <td className="border p-1 text-xs">
                      {c.emails_enviados
                        ? `✅ ${c.emails_enviados.correctos} / ❌ ${c.emails_enviados.incorrectos}`
                        : "-"}
                    </td>
                    <td className="border p-1 text-xs">{c.error || "-"}</td>
                    <td className="border p-1 text-xs">
                      {new Date(c.updatedAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
