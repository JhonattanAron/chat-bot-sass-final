"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LeadsTable } from "@/components/leads-table";
import { EmailResultsTable } from "@/components/email-results-table";
import { MarketingCampaignTracker } from "@/components/marketing-analytics-table";
import { AlertCircle, CheckCircle2, BarChart3, Send, Zap } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard-layout";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AutomationDialog,
  type AutomationConfig,
} from "@/components/automation-dialog";
import { json } from "stream/consumers";
import { useSession } from "next-auth/react";

// ---------------------------
// Interfaces
// ---------------------------
interface Lead {
  userId: string | undefined;
  descripcion: string;
  empresa: string;
  email: string;
  nombre_empresa: string;
  fuente: string;
  nivel_interes: "alto" | "medio" | "bajo";
  razon: string;
}

interface EmailResult {
  email: string;
  empresa: string;
  estado: "enviado" | "fallido";
  fecha_envio: string;
  mensaje_error?: string;
}

export interface PlainTextExport {
  _id: string;
  user_id: string;
  search_query: string;
  status: string;
  total_urls: boolean;
  normalized_with_ai?: string;
}

interface BatchData {
  leads: Lead[];
  selectedLeads: Set<string>;
  emailResults: EmailResult[];
  analysisComplete: boolean;
}

// ---------------------------
// Componente principal
// ---------------------------
export default function CampaignPage() {
  const { data: session } = useSession();
  // Estados globales
  const [plainTextExports, setPlainTextExports] = useState<PlainTextExport[]>(
    [],
  );
  const [selectedBatch, setSelectedBatch] = useState<PlainTextExport | null>(
    null,
  );
  const [batchDataMap, setBatchDataMap] = useState<Record<string, BatchData>>(
    {},
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSendingEmails, setIsSendingEmails] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isAutomationOpen, setIsAutomationOpen] = useState(false);

  const currentBatchData = selectedBatch
    ? batchDataMap[selectedBatch._id]
    : null;

  // ---------------------------
  // Fetch de Batches
  // ---------------------------
  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const response = await fetch("/api/backend/batches");
        if (!response.ok) throw new Error("Error al obtener los textos planos");
        const data: PlainTextExport[] = await response.json();
        setPlainTextExports(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
      }
    };
    fetchBatches();
  }, []);

  // ---------------------------
  // Prompt para análisis de leads
  // ---------------------------
  const buildPrompt = (content: string) => `

${content}
`;

  // ---------------------------
  // Analizar Leads / Cargar analizados
  // ---------------------------
  const handleAnalyzeLeads = async () => {
    if (!selectedBatch) return setError("Selecciona un batch");

    setIsAnalyzing(true);
    setError(null);
    setSuccessMessage(null);

    try {
      if (selectedBatch.normalized_with_ai) {
        // 🔹 Si ya está analizado, solo traemos los datos del backend
        const response = await fetch(
          `/api/backend/batches/${selectedBatch._id}/json-analized`,
        );
        if (!response.ok) throw new Error("Error al obtener datos analizados");
        const data = await response.json();
        const dataJson = JSON.parse(data.analized_data);
        console.log(dataJson);

        const parsedLeads = data.analized_data
          ? JSON.parse(data.analized_data).map((item: any) => ({
              email: item.emails[0], // si quieres usar el primer email
              nombre_empresa: item.empresa,
              fuente: item.url || "", // puedes usar url como fuente
              nivel_interes: item.nivel_interes,
              razon: item.razon,
              // opcional: almacenar info extra
              _meta: {
                descripcion: item.descripcion,
                emails: item.emails,
                telefonos: item.telefonos,
                redes: item["redes sociales"],
              },
            }))
          : [];

        setBatchDataMap((prev) => ({
          ...prev,
          [selectedBatch._id]: {
            leads: parsedLeads,
            selectedLeads: new Set(),
            emailResults: [],
            analysisComplete: true,
          },
        }));

        setSuccessMessage("Datos analizados cargados correctamente ✅");
      } else {
        // 🔹 Si no está analizado, ejecutamos la lógica normal
        const predictResponse = await fetch("/api/backend/chat/model/predict", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: "69386d627ec1e55a4a355b0c",
            prompt: "",
          }),
        });

        const { predict } = await predictResponse.json();
        const data = predict.messages[1].content;
        const dataJson = JSON.parse(data);
        console.log(dataJson);

        const updateResponse = await fetch(
          `/api/backend/batches/${selectedBatch._id}/analized`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              analized: true,
              analized_data: data,
            }),
          },
        );

        if (!updateResponse.ok) {
          const errorText = await updateResponse.text();
          throw new Error(
            errorText || "Error actualizando datos en el backend",
          );
        }

        const parsedLeads = data ? JSON.parse(data) : [];
        setBatchDataMap((prev) => ({
          ...prev,
          [selectedBatch._id]: {
            leads: parsedLeads,
            selectedLeads: new Set(),
            emailResults: [],
            analysisComplete: true,
          },
        }));

        setSuccessMessage("Clientes potenciales analizados correctamente 🎯");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido ❌");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // ---------------------------
  // Toggle de selección de leads
  // ---------------------------
  const toggleLeadSelection = (email: string) => {
    if (!selectedBatch) return;
    setBatchDataMap((prev) => {
      const batch = prev[selectedBatch._id];
      if (!batch) return prev;
      const newSelected = new Set(batch.selectedLeads);
      newSelected.has(email)
        ? newSelected.delete(email)
        : newSelected.add(email);
      return {
        ...prev,
        [selectedBatch._id]: { ...batch, selectedLeads: newSelected },
      };
    });
  };

  // ---------------------------
  // Enviar emails
  const handleSendEmails = async () => {
    if (!selectedBatch) return setError("Selecciona un batch");
    const batch = batchDataMap[selectedBatch._id];
    if (!batch || batch.selectedLeads.size === 0)
      return setError("Selecciona al menos un cliente potencial");

    setIsSendingEmails(true);
    setError(null);
    setSuccessMessage(null);

    const leadsToSend = {
      leads: batch.leads
        .filter((l) => batch.selectedLeads.has(l.email))
        .map((l) => ({
          empresa: l.nombre_empresa || l.empresa || "",
          descripcion: l.descripcion || "",
          emails: [l.email],
          nivel_interes: l.nivel_interes || "medio",
          razon: l.razon || "",
          userId: session?.binding_id || l.userId || "",
          batch: "",
        })),
    };

    try {
      const response = await fetch("/api/backend/mail/send-leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(leadsToSend),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Error al enviar los correos");
      }

      // Aquí parseas la respuesta
      const data = await response.json();

      // data tiene esta estructura:
      // { total: number, sent: number, failed: number, results: Array }
      const { total, sent, failed, results } = data;

      // Mapear el array results para adaptarlo a EmailResult[]
      // Ajusto estado a "enviado" / "fallido", y agrego fecha de envío actual
      const emailResults: EmailResult[] = results.map((r: any) => ({
        email: r.email,
        empresa: r.empresa,
        estado: r.status === "sent" ? "enviado" : "fallido",
        fecha_envio: new Date().toISOString(),
        mensaje_error: r.error || undefined,
      }));

      // Actualiza el estado con los resultados para mostrar tabla y resumen
      setBatchDataMap((prev) => {
        if (!selectedBatch) return prev;
        const batch = prev[selectedBatch._id];
        if (!batch) return prev;
        return {
          ...prev,
          [selectedBatch._id]: {
            ...batch,
            emailResults,
          },
        };
      });

      setSuccessMessage(
        `Total: ${total}, Enviados: ${sent}, Fallidos: ${failed}`,
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setIsSendingEmails(false);
    }
  };

  // ---------------------------
  // Automatización
  // ---------------------------
  const handleStartAutomation = async (config: AutomationConfig) => {
    setIsAutomationOpen(false);
    setIsAnalyzing(true);
    setError(null);
    setSuccessMessage(null);

    try {
      console.log("[v0] Iniciando Automatización Total:", config);
      await new Promise((resolve) => setTimeout(resolve, 3000));
      setSuccessMessage("Automatización iniciada correctamente ⚡");
    } catch {
      setError("Error al iniciar la automatización total ❌");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // ---------------------------
  // Render
  // ---------------------------
  return (
    <DashboardLayout>
      <main className="min-h-screen bg-background py-8 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">
                Marketing Automático
              </h1>
              <p className="text-muted-foreground">
                Gestiona tus campañas y analiza el impacto en tus clientes
                potenciales.
              </p>
            </div>
            <Button
              size="lg"
              className="gap-2 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold shadow-lg shadow-yellow-500/20"
              onClick={() => setIsAutomationOpen(true)}
            >
              <Zap className="h-5 w-5 fill-current" />
              Automatizar Campaña
            </Button>
          </div>

          {/* Alerts */}
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {successMessage && (
            <Alert
              variant="default"
              className="mb-6 bg-green-100 text-green-700 border-green-200"
            >
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>{successMessage}</AlertDescription>
            </Alert>
          )}

          {/* Tabs */}
          <Tabs defaultValue="campaign" className="w-full">
            <TabsList className="mb-8">
              <TabsTrigger value="campaign" className="flex items-center gap-2">
                <Send className="h-4 w-4" /> Nueva Campaña
              </TabsTrigger>
              <TabsTrigger value="tracking" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" /> Seguimiento
              </TabsTrigger>
            </TabsList>

            {/* Campaign Tab */}
            <TabsContent value="campaign">
              <AutomationDialog
                open={isAutomationOpen}
                onOpenChange={setIsAutomationOpen}
                onAutomate={handleStartAutomation}
              />

              {/* Paso 1: Seleccionar Batch */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Paso 1: Selecciona el Batch</CardTitle>
                </CardHeader>
                <CardContent>
                  <Select
                    onValueChange={(value) => {
                      const batch =
                        plainTextExports.find(
                          (b) => b.search_query === value,
                        ) || null;
                      setSelectedBatch(batch);
                    }}
                  >
                    <SelectTrigger className="w-full md:w-64 my-3">
                      <SelectValue placeholder="Selecciona el Batch" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {plainTextExports.map((exportItem) => (
                          <SelectItem
                            key={exportItem._id}
                            value={exportItem.search_query}
                          >
                            {exportItem.search_query}
                            {exportItem.normalized_with_ai ? " ✅" : " ❌"}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>

                  <Button
                    onClick={handleAnalyzeLeads}
                    disabled={isAnalyzing || !selectedBatch}
                    size="lg"
                    className={`mt-4 w-full md:w-auto ${
                      selectedBatch?.normalized_with_ai
                        ? "bg-yellow-400 hover:bg-yellow-300 text-gray-700"
                        : "bg-green-400 hover:bg-green-300 text-gray-700"
                    }`}
                  >
                    {isAnalyzing
                      ? "Analizando..."
                      : selectedBatch?.normalized_with_ai
                        ? "Cargar datos analizados"
                        : "Analizar clientes potenciales"}
                  </Button>
                </CardContent>
              </Card>

              {/* Paso 2: Confirmar clientes */}
              {currentBatchData?.analysisComplete &&
                currentBatchData.leads.length > 0 && (
                  <>
                    <Card className="mb-8">
                      <CardHeader>
                        <CardTitle>
                          Paso 2: Confirmar clientes (
                          {currentBatchData.selectedLeads.size}/
                          {currentBatchData.leads.length} seleccionados)
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <LeadsTable
                          leads={currentBatchData.leads}
                          selectedLeads={currentBatchData.selectedLeads}
                          onToggleSelection={toggleLeadSelection}
                        />
                        <Button
                          onClick={handleSendEmails}
                          disabled={
                            isSendingEmails ||
                            currentBatchData.selectedLeads.size === 0
                          }
                          size="lg"
                          className="mt-6 w-full md:w-auto"
                        >
                          {isSendingEmails
                            ? "Enviando correos..."
                            : "Enviar correos"}
                        </Button>
                      </CardContent>
                    </Card>

                    {/* Paso 3: Resultados de envío */}
                    {currentBatchData.emailResults.length > 0 && (
                      <Card className="mb-8 border-green-200 bg-green-50">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <CheckCircle2 className="h-6 w-6 text-green-600" />
                            Paso 3: Resultados del envío
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-3">
                            <div className="bg-white rounded p-4 border shadow-sm text-center">
                              <p className="text-sm text-muted-foreground">
                                Exitosos
                              </p>
                              <p className="text-2xl font-bold text-green-700">
                                {
                                  currentBatchData.emailResults.filter(
                                    (r) => r.estado === "enviado",
                                  ).length
                                }
                              </p>
                            </div>
                            <div className="bg-white rounded p-4 border shadow-sm text-center">
                              <p className="text-sm text-muted-foreground">
                                Fallidos
                              </p>
                              <p className="text-2xl font-bold text-red-700">
                                {
                                  currentBatchData.emailResults.filter(
                                    (r) => r.estado === "fallido",
                                  ).length
                                }
                              </p>
                            </div>
                          </div>
                          <EmailResultsTable
                            results={currentBatchData.emailResults}
                          />
                        </CardContent>
                      </Card>
                    )}
                  </>
                )}
            </TabsContent>

            {/* Tracking Tab */}
            <TabsContent value="tracking">
              <Card>
                <CardHeader>
                  <CardTitle>Historial de Clientes Potenciales</CardTitle>
                </CardHeader>
                <CardContent>
                  <MarketingCampaignTracker />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </DashboardLayout>
  );
}
