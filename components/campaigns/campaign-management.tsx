"use client";

import React, { useEffect, useState } from "react";
import { useCampaignStore } from "@/store/campaignStore";
import { useChatAssistantStore } from "@/store/chatAsistantStore";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Play, Pause, RotateCcw, FileUp } from "lucide-react";

interface CampaignManagementProps {
  userId: string;
}

export function CampaignManagement({ userId }: CampaignManagementProps) {
  const {
    campaigns,
    loading,
    error,
    success,
    getCampaigns,
    deleteCampaign,
    startCampaign,
    pauseCampaign,
  } = useCampaignStore();
  const { assistants } = useChatAssistantStore();
  const [showForm, setShowForm] = useState(false);
  const [selectedAssistant, setSelectedAssistant] = useState<string>("");
  const [campaignName, setCampaignName] = useState("");
  const [contactsFile, setContactsFile] = useState<File | null>(null);

  useEffect(() => {
    void getCampaigns(userId);
  }, [userId]);

  const handleCreateCampaign = async () => {
    if (!campaignName || !selectedAssistant || !contactsFile) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const contacts = JSON.parse(e.target?.result as string);
        // Implementar creación de campaña
      } catch (err) {
        console.error("Error parsing contacts file:", err);
      }
    };
    reader.readAsText(contactsFile);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Campañas de WhatsApp</h2>
        <Button onClick={() => setShowForm(!showForm)} variant="default">
          <Plus className="w-4 h-4 mr-2" />
          Nueva Campaña
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded">{error}</div>
      )}
      {success && (
        <div className="bg-green-50 text-green-700 p-4 rounded">{success}</div>
      )}

      {showForm && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Crear Nueva Campaña</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Nombre de Campaña
              </label>
              <Input
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
                placeholder="Ej: Campaña Verano 2024"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Seleccionar Asistente
              </label>
              <select
                value={selectedAssistant}
                onChange={(e) => setSelectedAssistant(e.target.value)}
                className="w-full border rounded px-3 py-2"
              >
                <option value="">-- Selecciona un asistente --</option>
                {assistants.map((assistant) => (
                  <option key={assistant._id} value={assistant._id}>
                    {assistant.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Archivo de Contactos (JSON)
              </label>
              <input
                type="file"
                accept=".json"
                onChange={(e) => setContactsFile(e.target.files?.[0] || null)}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleCreateCampaign} disabled={loading}>
                Crear Campaña
              </Button>
              <Button onClick={() => setShowForm(false)} variant="outline">
                Cancelar
              </Button>
            </div>
          </div>
        </Card>
      )}

      <div className="grid gap-4">
        {campaigns.map((campaign) => (
          <Card key={campaign._id} className="p-4">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="font-semibold">{campaign.name}</h4>
                <p className="text-sm text-gray-600">{campaign.description}</p>
              </div>
              <span
                className={`px-3 py-1 rounded text-sm font-medium ${
                  campaign.status === "running"
                    ? "bg-green-100 text-green-800"
                    : campaign.status === "paused"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-gray-100 text-gray-800"
                }`}
              >
                {campaign.status}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
              <div>
                <p className="text-gray-600">Contactos</p>
                <p className="font-semibold">{campaign.contacts.length}</p>
              </div>
              <div>
                <p className="text-gray-600">Asistente</p>
                <p className="font-semibold text-xs truncate">
                  {campaign.assistantId}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Estado</p>
                <p className="font-semibold">{campaign.status}</p>
              </div>
            </div>

            <div className="flex gap-2">
              {campaign.status === "draft" && (
                <Button
                  size="sm"
                  onClick={() => void startCampaign(campaign._id!)}
                  disabled={loading}
                  variant="default"
                >
                  <Play className="w-4 h-4 mr-1" />
                  Iniciar
                </Button>
              )}
              {campaign.status === "running" && (
                <Button
                  size="sm"
                  onClick={() => void pauseCampaign(campaign._id!)}
                  disabled={loading}
                  variant="outline"
                >
                  <Pause className="w-4 h-4 mr-1" />
                  Pausar
                </Button>
              )}
              {campaign.status === "paused" && (
                <Button
                  size="sm"
                  onClick={() => void startCampaign(campaign._id!)}
                  disabled={loading}
                  variant="default"
                >
                  <RotateCcw className="w-4 h-4 mr-1" />
                  Reanudar
                </Button>
              )}
              <Button
                size="sm"
                variant="destructive"
                onClick={() => void deleteCampaign(campaign._id!)}
                disabled={loading}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {campaigns.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500">
            No hay campañas creadas. Crea una nueva para comenzar.
          </p>
        </div>
      )}
    </div>
  );
}
