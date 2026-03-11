"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useModelStore } from "@/store/Ai-models-store";
import Link from "next/link";
import { DashboardLayout } from "@/components/pages/dashboard/dashboard-layout";

export default function ModelDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<
    "overview" | "javascript" | "python"
  >("overview");
  const [copiedCode, setCopiedCode] = useState(false);

  const modelId = typeof params.id === "string" ? parseInt(params.id) : 0;
  const getModelById = useModelStore((state) => state.getModelById);
  const model = getModelById(modelId);

  if (!model) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Modelo no encontrado
          </h1>
          <Link href="/">
            <Button className="bg-foreground text-background hover:bg-foreground/90">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a inicio
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const getCurrentCode = () => {
    if (activeTab === "javascript") return model.implementationCode || "";
    if (activeTab === "python") return model.pythonCode || "";
    return "";
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-background text-foreground">
        {/* Header */}
        <div className="border-b border-border bg-card/50 sticky top-0 z-40">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <Link href="/">
              <Button
                variant="ghost"
                className="text-muted-foreground hover:text-foreground mb-4"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver
              </Button>
            </Link>
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-2">{model.name}</h1>
                <p className="text-muted-foreground text-lg">
                  {model.provider}
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-foreground">
                  {model.cost}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {model.category}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-12">
          {/* Description Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Descripción</h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              {model.longDescription}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {model.tags?.map((tag) => (
                <span
                  key={tag}
                  className="inline-block rounded-full bg-muted px-4 py-2 text-sm font-medium text-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Features Section */}
          {model.features && model.features.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6">
                Características Principales
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {model.features.map((feature, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-lg border border-border bg-card/50 hover:bg-card transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-foreground flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-background text-sm font-bold">
                          ✓
                        </span>
                      </div>
                      <span className="text-foreground">{feature}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Implementation Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Implementación</h2>
            <p className="text-muted-foreground mb-6">
              Usa tu API key para empezar a integrar {model.name} en tu
              aplicación:
            </p>

            {/* API Endpoint Info */}
            {model.apiEndpoint && (
              <div className="mb-8 p-6 rounded-lg border border-border bg-card/50">
                <h3 className="font-semibold text-foreground mb-3">
                  Endpoint de la API
                </h3>
                <div className="flex items-center justify-between gap-4 bg-background p-3 rounded border border-border/50">
                  <code className="text-sm text-muted-foreground break-all">
                    {model.apiEndpoint}
                  </code>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleCopyCode(model.apiEndpoint!)}
                    className="flex-shrink-0"
                  >
                    {copiedCode ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            )}

            {/* Code Tabs */}
            <div className="border border-border rounded-lg overflow-hidden">
              {/* Tab Headers */}
              <div className="flex border-b border-border bg-card/50">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`flex-1 px-4 py-3 font-medium transition-colors ${
                    activeTab === "overview"
                      ? "border-b-2 border-foreground text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Descripción General
                </button>
                <button
                  onClick={() => setActiveTab("javascript")}
                  className={`flex-1 px-4 py-3 font-medium transition-colors ${
                    activeTab === "javascript"
                      ? "border-b-2 border-foreground text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  JavaScript/TypeScript
                </button>
                <button
                  onClick={() => setActiveTab("python")}
                  className={`flex-1 px-4 py-3 font-medium transition-colors ${
                    activeTab === "python"
                      ? "border-b-2 border-foreground text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Python
                </button>
              </div>

              {/* Tab Content */}
              <div className="bg-background p-6">
                {activeTab === "overview" && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">
                        Pasos para empezar:
                      </h3>
                      <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                        <li>Obtén tu API key de {model.provider}</li>
                        <li>Instala las dependencias necesarias</li>
                        <li>Configura la autenticación con tu API key</li>
                        <li>
                          Realiza tu primera solicitud usando los ejemplos de
                          código
                        </li>
                        <li>Integra en tu aplicación</li>
                      </ol>
                    </div>

                    <div className="mt-6 p-4 rounded border border-border/50 bg-muted/20">
                      <h4 className="font-semibold text-foreground mb-2">
                        Consejos de seguridad:
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        <li>Nunca expongas tu API key en código público</li>
                        <li>
                          Usa variables de entorno para almacenar keys sensibles
                        </li>
                        <li>Rota tus API keys regularmente</li>
                        <li>Implementa rate limiting en tu aplicación</li>
                      </ul>
                    </div>
                  </div>
                )}

                {activeTab === "javascript" && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-foreground">
                        Ejemplo JavaScript/TypeScript
                      </h3>
                      <Button
                        size="sm"
                        onClick={() => handleCopyCode(getCurrentCode())}
                        className="gap-2"
                      >
                        {copiedCode ? (
                          <>
                            <Check className="h-4 w-4" />
                            Copiado
                          </>
                        ) : (
                          <>
                            <Copy className="h-4 w-4" />
                            Copiar
                          </>
                        )}
                      </Button>
                    </div>
                    <pre className="bg-card border border-border/50 rounded p-4 overflow-x-auto text-sm">
                      <code className="text-muted-foreground">
                        {model.implementationCode}
                      </code>
                    </pre>
                  </div>
                )}

                {activeTab === "python" && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-foreground">
                        Ejemplo Python
                      </h3>
                      <Button
                        size="sm"
                        onClick={() => handleCopyCode(getCurrentCode())}
                        className="gap-2"
                      >
                        {copiedCode ? (
                          <>
                            <Check className="h-4 w-4" />
                            Copiado
                          </>
                        ) : (
                          <>
                            <Copy className="h-4 w-4" />
                            Copiar
                          </>
                        )}
                      </Button>
                    </div>
                    <pre className="bg-card border border-border/50 rounded p-4 overflow-x-auto text-sm">
                      <code className="text-muted-foreground">
                        {model.pythonCode}
                      </code>
                    </pre>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-card border border-border rounded-lg p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">¿Listo para empezar?</h3>
            <p className="text-muted-foreground mb-6">
              Obtén tu API key y comienza a integrar {model.name} en tu
              aplicación hoy.
            </p>
            <Button className="bg-foreground text-background hover:bg-foreground/90 px-8">
              Obtener API Key
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
