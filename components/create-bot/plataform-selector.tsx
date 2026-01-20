"use client";

import type React from "react";
import {
  useState,
  useCallback,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  MessageCircle,
  Send,
  Globe,
  Settings,
  HelpCircle,
  Check,
} from "lucide-react";

interface Integration {
  name: string;
  type: string;
  config: Record<string, any>;
}

interface Platform {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  useCases: string[];
}

const platforms: Platform[] = [
  {
    id: "whatsapp",
    name: "WhatsApp",
    description: "WhatsApp Business API",
    icon: <MessageCircle className="h-5 w-5" />,
    color: "text-green-600",
    useCases: [
      "Atención al cliente 24/7",
      "Confirmación de pedidos y reservas",
      "Soporte técnico personalizado",
      "Notificaciones de envío y entrega",
      "Consultas sobre productos y servicios",
    ],
  },
  {
    id: "telegram",
    name: "Telegram",
    description: "Bot de Telegram",
    icon: <Send className="h-5 w-5" />,
    color: "text-blue-500",
    useCases: [
      "Facturación electrónica automatizada",
      "Gestión de inventarios y reportes",
      "Notificaciones empresariales internas",
      "Automatización de procesos administrativos",
      "Integración con sistemas ERP/CRM",
    ],
  },
  {
    id: "webchat",
    name: "Web Chat",
    description: "Chat para sitio web",
    icon: <Globe className="h-5 w-5" />,
    color: "text-purple-600",
    useCases: [
      "Información sobre productos y servicios",
      "Preguntas frecuentes del sitio web",
      "Guía de navegación y funcionalidades",
      "Soporte técnico en tiempo real",
      "Captura de leads y contactos",
    ],
  },
];

interface PlatformSelectorProps {
  onIntegrationsChange?: (integrations: Integration[]) => void;
  ref?: React.Ref<{ getCurrentIntegrations: () => Integration[] }>;
}

export const PlatformSelector = forwardRef<
  { getCurrentIntegrations: () => Integration[] },
  PlatformSelectorProps
>(({ onIntegrationsChange }, ref) => {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [showWhatsAppGuide, setShowWhatsAppGuide] = useState(false);
  const [whatsappData, setWhatsappData] = useState({
    phoneNumberId: "",
    accessToken: "",
    webhookUrl: "",
    verifyToken: "",
  });
  const [telegramData, setTelegramData] = useState({
    phoneNumber: "",
    botToken: "",
  });

  const [savedConfigurations, setSavedConfigurations] = useState<Integration[]>(
    []
  );
  const [isSaving, setIsSaving] = useState(false);
  const [isConfigurationSaved, setIsConfigurationSaved] = useState(false);

  const getCurrentIntegrations = useCallback((): Integration[] => {
    const integrations: Integration[] = [];

    if (
      selectedPlatforms.includes("whatsapp") &&
      whatsappData.phoneNumberId &&
      whatsappData.accessToken
    ) {
      integrations.push({
        name: "WhatsApp",
        type: "whatsapp",
        config: {
          phoneNumberId: whatsappData.phoneNumberId,
          accessToken: whatsappData.accessToken,
          webhookUrl: whatsappData.webhookUrl,
          verifyToken: whatsappData.verifyToken,
        },
      });
    }

    if (selectedPlatforms.includes("telegram") && telegramData.botToken) {
      integrations.push({
        name: "Telegram",
        type: "telegram",
        config: {
          phoneNumber: telegramData.phoneNumber,
          botToken: telegramData.botToken,
        },
      });
    }

    if (selectedPlatforms.includes("webchat")) {
      integrations.push({
        name: "WebChat",
        type: "webchat",
        config: {
          enabled: true,
        },
      });
    }

    return integrations;
  }, [selectedPlatforms, whatsappData, telegramData]);

  useImperativeHandle(ref, () => ({
    getCurrentIntegrations,
  }));

  useEffect(() => {
    // Solo actualizar las configuraciones locales, no enviar al padre automáticamente
    const integrations: Integration[] = [];

    if (
      selectedPlatforms.includes("whatsapp") &&
      whatsappData.phoneNumberId &&
      whatsappData.accessToken
    ) {
      integrations.push({
        name: "WhatsApp",
        type: "whatsapp",
        config: {
          phoneNumberId: whatsappData.phoneNumberId,
          accessToken: whatsappData.accessToken,
          webhookUrl: whatsappData.webhookUrl,
          verifyToken: whatsappData.verifyToken,
        },
      });
    }

    if (selectedPlatforms.includes("telegram") && telegramData.botToken) {
      integrations.push({
        name: "Telegram",
        type: "telegram",
        config: {
          phoneNumber: telegramData.phoneNumber,
          botToken: telegramData.botToken,
        },
      });
    }

    if (selectedPlatforms.includes("webchat")) {
      integrations.push({
        name: "WebChat",
        type: "webchat",
        config: {
          enabled: true,
        },
      });
    }

    // Solo actualizar las configuraciones locales
    setSavedConfigurations(integrations);
  }, [selectedPlatforms, whatsappData, telegramData]);

  const handleSaveConfiguration = () => {
    setIsSaving(true);

    // Simular guardado con animación
    setTimeout(() => {
      setIsSaving(false);
      setIsConfigurationSaved(true);

      // Enviar las integraciones al componente padre solo cuando se guarda
      onIntegrationsChange?.(savedConfigurations);

      // Resetear el estado de guardado después de 2 segundos
      setTimeout(() => {
        setIsConfigurationSaved(false);
      }, 2000);
    }, 1000);
  };

  const handlePlatformChange = useCallback(
    (platformId: string, checked: boolean) => {
      if (checked) {
        setSelectedPlatforms((prev) => [...prev, platformId]);
      } else {
        setSelectedPlatforms((prev) => prev.filter((id) => id !== platformId));
      }
      setIsConfigurationSaved(false);
    },
    []
  );

  const handleWhatsappDataChange = useCallback(
    (field: string, value: string) => {
      setWhatsappData((prev) => ({ ...prev, [field]: value }));
      setIsConfigurationSaved(false);
    },
    []
  );

  const handleTelegramDataChange = useCallback(
    (field: string, value: string) => {
      setTelegramData((prev) => ({ ...prev, [field]: value }));
      setIsConfigurationSaved(false);
    },
    []
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Seleccionar Plataformas
          </CardTitle>
          <CardDescription>
            Elige las plataformas donde quieres desplegar tu asistente
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {platforms.map((platform) => (
              <div
                key={platform.id}
                className="flex flex-col p-4 border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center justify-center mb-3">
                  <Checkbox
                    id={platform.id}
                    checked={selectedPlatforms.includes(platform.id)}
                    onCheckedChange={(checked) =>
                      handlePlatformChange(platform.id, checked as boolean)
                    }
                  />
                </div>
                <div className={`flex justify-center mb-2 ${platform.color}`}>
                  {platform.icon}
                </div>
                <h3 className="font-medium text-center mb-2">
                  {platform.name}
                </h3>
                <p className="text-sm text-muted-foreground text-center mb-3">
                  {platform.description}
                </p>

                <div className="mt-auto">
                  <h4 className="text-xs font-semibold text-muted-foreground mb-2 text-center">
                    Ideal para:
                  </h4>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    {platform.useCases.slice(0, 3).map((useCase, index) => (
                      <li key={index} className="flex items-start gap-1">
                        <span className="text-primary mt-0.5">•</span>
                        <span>{useCase}</span>
                      </li>
                    ))}
                    {platform.useCases.length > 3 && (
                      <li className="text-xs text-muted-foreground/70 italic">
                        +{platform.useCases.length - 3} casos más...
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {selectedPlatforms.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Configuración de Plataformas</CardTitle>
            <CardDescription>
              Completa los datos necesarios para cada plataforma seleccionada
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-6">
              {selectedPlatforms.map((platformId) => {
                const platform = platforms.find((p) => p.id === platformId);
                return (
                  <Badge
                    key={platformId}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    <span className={platform?.color}>{platform?.icon}</span>
                    {platform?.name}
                  </Badge>
                );
              })}
            </div>

            <Accordion type="single" collapsible className="w-full">
              {/* ... existing accordion content ... */}
              {selectedPlatforms.includes("whatsapp") && (
                <AccordionItem value="whatsapp">
                  <AccordionTrigger className="text-left">
                    <div className="flex items-center gap-2">
                      <MessageCircle className="h-4 w-4 text-green-600" />
                      <span>Configurar WhatsApp Business API</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-4">
                    {/* ... existing WhatsApp guide content ... */}
                    <Dialog
                      open={showWhatsAppGuide}
                      onOpenChange={setShowWhatsAppGuide}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-2 bg-transparent"
                        >
                          <HelpCircle className="h-4 w-4" />
                          ¿Cómo conseguir las credenciales?
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
                        {/* ... existing dialog content ... */}
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2 text-xl">
                            <MessageCircle className="h-6 w-6 text-green-600" />
                            Guía: Cómo conseguir credenciales de WhatsApp
                            Business API
                          </DialogTitle>
                          <DialogDescription className="text-base">
                            Sigue estos pasos detallados para obtener las
                            credenciales necesarias para integrar WhatsApp
                            Business API con tu asistente
                          </DialogDescription>
                        </DialogHeader>
                        {/* ... rest of dialog content remains the same ... */}
                      </DialogContent>
                    </Dialog>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phoneNumberId">Phone Number ID</Label>
                        <Input
                          id="phoneNumberId"
                          placeholder="Ej: 123456789012345"
                          value={whatsappData.phoneNumberId}
                          onChange={(e) =>
                            handleWhatsappDataChange(
                              "phoneNumberId",
                              e.target.value
                            )
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="accessToken">Access Token</Label>
                        <Input
                          id="accessToken"
                          type="password"
                          placeholder="Ej: EAABwzLixnjYBO..."
                          value={whatsappData.accessToken}
                          onChange={(e) =>
                            handleWhatsappDataChange(
                              "accessToken",
                              e.target.value
                            )
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="webhookUrl">Webhook URL</Label>
                        <Input
                          id="webhookUrl"
                          placeholder="https://tu-dominio.com/webhook"
                          value={whatsappData.webhookUrl}
                          onChange={(e) =>
                            handleWhatsappDataChange(
                              "webhookUrl",
                              e.target.value
                            )
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="verifyToken">Verify Token</Label>
                        <Input
                          id="verifyToken"
                          placeholder="Token de verificación"
                          value={whatsappData.verifyToken}
                          onChange={(e) =>
                            handleWhatsappDataChange(
                              "verifyToken",
                              e.target.value
                            )
                          }
                        />
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )}

              {selectedPlatforms.includes("telegram") && (
                <AccordionItem value="telegram">
                  <AccordionTrigger className="text-left">
                    <div className="flex items-center gap-2">
                      <Send className="h-4 w-4 text-blue-500" />
                      <span>Configurar Telegram Bot</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="telegramPhone">
                          Número de Teléfono
                        </Label>
                        <Input
                          id="telegramPhone"
                          placeholder="+1234567890"
                          value={telegramData.phoneNumber}
                          onChange={(e) =>
                            handleTelegramDataChange(
                              "phoneNumber",
                              e.target.value
                            )
                          }
                        />
                        <p className="text-xs text-muted-foreground">
                          Número asociado a tu cuenta de Telegram
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="botToken">Bot Token</Label>
                        <Input
                          id="botToken"
                          type="password"
                          placeholder="123456789:ABCdefGHIjklMNOpqrsTUVwxyz"
                          value={telegramData.botToken}
                          onChange={(e) =>
                            handleTelegramDataChange("botToken", e.target.value)
                          }
                        />
                        <p className="text-xs text-muted-foreground">
                          Token obtenido de @BotFather
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                      <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                        📱 Cómo crear un bot de Telegram
                      </h4>
                      <ol className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                        <li>1. Busca @BotFather en Telegram</li>
                        <li>2. Envía el comando /newbot</li>
                        <li>3. Sigue las instrucciones para nombrar tu bot</li>
                        <li>4. Copia el token que te proporcione</li>
                      </ol>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )}

              {selectedPlatforms.includes("webchat") && (
                <AccordionItem value="webchat">
                  <AccordionTrigger className="text-left">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-purple-600" />
                      <span>Web Chat - Listo para usar</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-4">
                    <div className="p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
                      <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">
                        ✅ No requiere configuración adicional
                      </h4>
                      <p className="text-sm text-green-700 dark:text-green-300">
                        El Web Chat se integrará automáticamente en tu sitio
                        web. Solo necesitas copiar el código de integración
                        cuando esté listo.
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )}
            </Accordion>

            {selectedPlatforms.length > 0 && (
              <div className="mt-6 flex justify-end">
                <Button
                  onClick={handleSaveConfiguration}
                  disabled={isSaving}
                  className={`transition-all duration-300 ${
                    isConfigurationSaved
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-primary hover:bg-primary/90"
                  }`}
                >
                  {isSaving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Guardando...
                    </>
                  ) : isConfigurationSaved ? (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Configuración Guardada
                    </>
                  ) : (
                    "Guardar Configuración"
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
});

PlatformSelector.displayName = "PlatformSelector";
