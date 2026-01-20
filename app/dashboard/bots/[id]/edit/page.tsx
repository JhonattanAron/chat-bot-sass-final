/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Loader2,
  Trash2,
  Plus,
  Save,
  Sparkles,
  Send,
  MessageSquare,
  Menu,
  X,
  FilePen,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/language-context";
import { ProductModal } from "@/components/product-modal";
import { FunctionModal } from "@/components/functions/function-modal";
import { ChatWidgetCustomization } from "@/components/chat_cuztomization/chat-widget-customization";
import { useChatAssistantStore } from "@/store/chatAsistantStore";
import { useSession } from "next-auth/react";
import { useProductStore } from "@/store/ProductStore";
import { cn, parseProductString } from "@/lib/utils";
import {
  type AssistantFunction,
  useFunctionsStore,
} from "@/store/functionsStore";
import { useChatStore } from "@/store/chatControlStore";
import AdvancedBotTasks from "@/components/functions/automatizaciones-admin";

interface BotData {
  id: string;
  name: string;
  type: string;
  status: string;
  description: string;
  welcomeMessage: string;
  primaryColor: string;
  faqs: Array<{ question: string; answer: string; category: string }>;
  products: Array<{
    name: string;
    price: string;
    description: string;
    available: boolean;
    stock?: string;
  }>;
  whatsappNumber?: string;
  apiKey?: string;
  useCase?: string;
  businessDescription?: string;
  chatSettings?: {
    title?: string;
    subtitle?: string;
    primaryColor?: string;
    buttonColor?: string;
    bubbleColor?: string;
    userBubbleColor?: string;
    headerStyle?: "gradient" | "solid";
    logo?: string;
    showLogo?: boolean;
    position?: "right" | "left";
    initialMessage?: string;
    placeholderText?: string;
    userTextColor?: string;
    botTextColor?: string;
  };
}

export default function EditBotPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [bot, setBot] = useState<BotData | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isGeneratingFaqs, setIsGeneratingFaqs] = useState(false);
  const [isChatPreviewOpen, setIsChatPreviewOpen] = useState(false);
  const [isFunctionModalOpen, setIsFunctionModalOpen] = useState(false);
  const [isChatTestOpen, setIsChatTestOpen] = useState(false);
  const { getAssistantById, assistant, createFaq, deleteFaq, updateFaq } =
    useChatAssistantStore();
  const {
    fetchFunctions,
    functions,
    addFunction,
    deleteFunction,
    updateFunction,
  } = useFunctionsStore(); // Añadir updateFunction
  const { fetchProducts, products, updateProduct } = useProductStore();
  const [temporalMessage, setTemporalMessage] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedChatId, setSelectedChatId] = useState("1");
  const [chatTiitle, setChatTitle] = useState(
    "Selecciona un Chat o Inicia uno nuevo"
  );
  const {
    startChat,
    sendMessage,
    currentChat,
    fetchChat,
    chats,
    fetchUserChats,
  } = useChatStore();
  const [errorBot, setErrorBot] = useState(true);
  const { data: session } = useSession();
  const { id } = React.use(params);
  const [editingFaqs, setEditingFaqs] = useState(() => assistant?.faqs || []);
  const [localProducts, setLocalProducts] = useState(
    products.map((product) => {
      const parsed = parseProductString(product.name);
      return {
        ...product,
        name: parsed.name,
        price: parsed.price,
        description: parsed.description,
        stock: parsed.stock,
      };
    })
  );

  // Nuevo estado para la función que se está editando
  const [editingFunction, setEditingFunction] = useState<
    AssistantFunction | undefined
  >(undefined);

  useEffect(() => {
    setLocalProducts(
      products.map((product) => {
        const parsed = parseProductString(product.name);
        return {
          ...product,
          name: parsed.name,
          price: parsed.price,
          description: parsed.description,
          stock: parsed.stock,
        };
      })
    );
  }, [products]);

  useEffect(() => {
    setEditingFaqs(assistant?.faqs || []);
  }, [assistant]);

  type TestMessage = {
    id: string;
    content: string;
    sender: "bot" | "user";
    timestamp: Date;
  };

  const [testMessages, setTestMessages] = useState<TestMessage[]>([
    {
      id: "1",
      content: assistant?.welcome_message || "Hola Como puedo ayudarte?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [testInput, setTestInput] = useState("");
  const router = useRouter();
  const { toast } = useToast();
  const { t, language } = useLanguage();

  // Simulate fetching bot data
  useEffect(() => {
    setIsLoading(true);
    const getBotData = async () => {
      if (id === undefined) {
        setIsLoading(false);
        return;
      }
      if (!session?.binding_id) {
        toast({
          title: "Error",
          description: "Intenta Cerrar sesión y volver a ingresar.",
        });
      } else {
        await getAssistantById(id, session.binding_id);
        await fetchProducts(session.binding_id, id);
        await fetchFunctions(session.binding_id, id);
        await fetchUserChats(session.binding_id);
        console.log(assistant);
        setErrorBot(false);
      }
      setIsLoading(false);
    };
    getBotData();
  }, [
    session,
    id,
    getAssistantById,
    fetchProducts,
    fetchFunctions,
    fetchUserChats,
  ]); // Añadir fetchFunctions y fetchUserChats a las dependencias

  const handleAddFunction = async (functionData: AssistantFunction) => {
    if (!session?.binding_id) {
      toast({
        title: "Error",
        description:
          "La session no funciono intenta Cerrar Session y volver a ingresar",
      });
      return;
    }
    try {
      const data = await addFunction(session?.binding_id, id, functionData);
      toast({
        title: "Info",
        description: data.message,
      });
      console.log(data);
      await fetchFunctions(session.binding_id, id); // Refrescar la lista de funciones
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      toast({
        title: "Error",
        description: `${message.replace(/\.*$/, "")}.`,
      });
    }
  };

  // Nueva función para manejar la edición de una función
  const handleEditFunction = async (updatedFunctionData: AssistantFunction) => {
    if (!session?.binding_id || !updatedFunctionData.id) {
      toast({
        title: "Error",
        description:
          "La sesión no funcionó o el ID de la función no está disponible. Intenta cerrar sesión y volver a ingresar.",
      });
      return;
    }
    try {
      const data = await updateFunction(
        session.binding_id,
        id,
        updatedFunctionData.id,
        updatedFunctionData
      );
      toast({
        title: "Éxito",
        description: data.message,
      });
      console.log(data);
      await fetchFunctions(session.binding_id, id); // Refrescar la lista de funciones
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      toast({
        title: "Error",
        description: `Error al editar la función: ${message.replace(
          /\.*$/,
          ""
        )}.`,
      });
    } finally {
      setEditingFunction(undefined); // Limpiar la función en edición
      setIsFunctionModalOpen(false); // Cerrar el modal
    }
  };

  const handleRemoveFunction = async (function_id: string | undefined) => {
    if (!session?.binding_id) {
      toast({
        title: "Error",
        description:
          "La session no funciono intenta Cerrar Session y volver a ingresar",
      });
      return;
    }
    if (!function_id) {
      toast({
        title: "Error",
        description: "No se obtuvo el id de la funcion",
      });
      return;
    }
    try {
      const data = await deleteFunction(session?.binding_id, id, function_id);
      toast({
        title: "Info",
        description: data.message,
      });
      console.log(data);
      await fetchFunctions(session.binding_id, id); // Refrescar la lista de funciones
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      toast({
        title: "Error",
        description: `${message.replace(/\.*$/, "")}.`,
      });
    }
  };

  // ✅ SOLUCIÓN: Función corregida para manejar el mensaje temporal
  const handleSendTestMessage = async () => {
    if (!testInput.trim()) return;
    // 🔥 CLAVE: Guardar el mensaje ANTES de limpiar el input
    const messageToSend = testInput.trim();
    setTemporalMessage(messageToSend); // Mostrar inmediatamente
    setTestInput(""); // Limpiar el input
    if (!session?.binding_id || !assistant?._id) {
      toast({
        title: "Error",
        description: "Intenta Cerrar sesión y volver a ingresar.",
      });
      return;
    }
    try {
      // Si es un nuevo chat, créalo
      if (selectedChatId === "1") {
        const data = await startChat({
          userId: session?.binding_id,
          assistant_id: assistant?._id,
          promt: messageToSend, // Usar el mensaje guardado
        });
        const response = data as unknown as { chat_id: string };
        const chatId = response.chat_id;
        setSelectedChatId(chatId);
        await fetchChat(chatId);
        await fetchUserChats(session.binding_id);
      } else {
        await sendMessage({
          chatId: selectedChatId,
          assistant_id: assistant?._id,
          role: "user",
          content: messageToSend, // Usar el mensaje guardado
        });
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Error al enviar el mensaje",
      });
    } finally {
      // Limpiar el mensaje temporal después de que se procese
      setTimeout(() => {
        setTemporalMessage("");
      }, 1000);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate saving
    setTimeout(() => {
      setIsSaving(false);
      toast({
        title: "Changes saved",
        description: "Your bot has been updated successfully.",
      });
    }, 1500);
  };

  const handleAddFaq = () => {
    const HandleFaq = async () => {
      if (!session?.binding_id) {
        toast({
          title: "Error",
          description: "Intenta Cerrar sesión y volver a ingresar.",
        });
      } else {
        await createFaq({
          user_id: session?.binding_id,
          assistant_id: id,
          faqs: [
            {
              question: "",
              answer: "",
              category: "",
            },
          ],
        });
        await getAssistantById(id, session.binding_id);
      }
      toast({
        title: "Exito",
        description: "Pregunta Lista para editar",
      });
    };
    HandleFaq();
  };

  const handleLocalChange = (index: number, field: string, value: string) => {
    setEditingFaqs((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleSaveFaq = (index: number) => {
    const updatedFaq = editingFaqs[index];
    const handleUpdate = async () => {
      if (!session?.binding_id || !updatedFaq._id) {
        toast({
          title: "Error",
          description: "Intenta Cerrar sesión y volver a ingresar.",
        });
      } else {
        updateFaq({
          user_id: session.binding_id,
          assistant_id: id,
          faqId: updatedFaq._id,
          update: {
            question: updatedFaq.question,
            answer: updatedFaq.answer,
            category: updatedFaq.category,
          },
        });
        await getAssistantById(id, session.binding_id);
        toast({
          title: "Exito",
          description: "El FAQ se edito correctamente",
        });
      }
    };
    handleUpdate();
  };

  const handleRemoveFaq = (index: number) => {
    const handleRemove = async () => {
      if (!session?.binding_id || !assistant?.faqs[index]._id) {
        toast({
          title: "Error",
          description: "Intenta Cerrar sesión y volver a ingresar.",
        });
        return;
      } else {
        await deleteFaq({
          user_id: session?.binding_id,
          assistant_id: id,
          faqId: assistant?.faqs[index]._id,
        });
        toast({
          title: "Success",
          description: "Se ha eliminado la pregunta frecuente correctamente.",
        });
      }
      await getAssistantById(id, session.binding_id);
    };
    handleRemove();
  };

  const handleAddProduct = (product: any, method: "manual" | "api") => {
    if (!bot) return;
    if (method === "manual") {
      setBot({
        ...bot,
        products: [...bot.products, product],
      });
    } else {
      // En un caso real, aquí se procesaría la configuración de la API
      toast({
        title: language === "en" ? "API Connected" : "API Conectada",
        description:
          language === "en"
            ? "Your product API has been connected successfully. Products will be imported automatically."
            : "Tu API de productos ha sido conectada exitosamente. Los productos se importarán automáticamente.",
      });
    }
  };

  const handleRemoveProduct = (index: number) => {
    if (!bot) return;
    const updatedProducts = bot.products.filter((_, i) => i !== index);
    setBot({ ...bot, products: updatedProducts });
  };

  const handleGenerateCode = () => {
    toast({
      title: "Code generated",
      description: "The code has been copied to your clipboard.",
    });
  };

  const handleGenerateFaqs = () => {
    if (!bot || !bot.businessDescription) {
      toast({
        title:
          language === "en" ? "Missing information" : "Información faltante",
        description:
          language === "en"
            ? "Please provide a business description to generate FAQs."
            : "Por favor proporciona una descripción del negocio para generar preguntas frecuentes.",
        variant: "destructive",
      });
      return;
    }
    setIsGeneratingFaqs(true);
    // Simulate generating FAQs with AI
    setTimeout(() => {
      const generatedFaqs = [
        {
          question:
            language === "en"
              ? "What makes your products unique?"
              : "¿Qué hace que tus productos sean únicos?",
          answer:
            language === "en"
              ? "Our products are designed with cutting-edge technology and user-centric approach, making them intuitive and powerful."
              : "Nuestros productos están diseñados con tecnología de vanguardia y un enfoque centrado en el usuario, haciéndolos intuitivos y potentes.",
          category: "Products",
        },
        {
          question:
            language === "en"
              ? "Do you offer customer support?"
              : "¿Ofrecen soporte al cliente?",
          answer:
            language === "en"
              ? "Yes, we provide 24/7 customer support through various channels including chat, email, and phone."
              : "Sí, proporcionamos soporte al cliente 24/7 a través de varios canales, incluyendo chat, correo electrónico y teléfono.",
          category: "Support",
        },
        {
          question:
            language === "en"
              ? "What payment methods do you accept?"
              : "¿Qué métodos de pago aceptan?",
          answer:
            language === "en"
              ? "We accept all major credit cards, PayPal, and bank transfers. For enterprise clients, we also offer invoicing options."
              : "Aceptamos todas las tarjetas de crédito principales, PayPal y transferencias bancarias. Para clientes empresariales, también ofrecemos opciones de facturación.",
          category: "Billing",
        },
      ];
      if (bot) {
        setBot({
          ...bot,
          faqs: [...bot.faqs, ...generatedFaqs],
        });
      }
      setIsGeneratingFaqs(false);
      toast({
        title:
          language === "en"
            ? "FAQs Generated"
            : "Preguntas Frecuentes Generadas",
        description:
          language === "en"
            ? "AI has generated new FAQs based on your business description."
            : "La IA ha generado nuevas preguntas frecuentes basadas en la descripción de tu negocio.",
      });
    }, 2000);
  };

  const handleUpdateChatSettings = (settings: BotData["chatSettings"]) => {
    if (!bot) return;
    setBot({
      ...bot,
      chatSettings: settings,
    });
  };

  function adjustColor(hex: string, amount: number) {
    return (
      "#" +
      hex
        .replace(/^#/, "")
        .replace(/../g, (color) =>
          (
            "0" +
            Math.min(
              255,
              Math.max(0, Number.parseInt(color, 16) + amount)
            ).toString(16)
          ).substr(-2)
        )
    );
  }

  if (!assistant) {
    return (
      <DashboardLayout>
        <div className="flex h-full items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-bold tracking-tight">Bot not found</h2>
            <p className="text-muted-foreground">
              The bot you&apos;re looking for doesn&apos;t exist or you
              don&apos;t have access.
            </p>
            <Button
              className="mt-4"
              onClick={() => router.push("/dashboard/bots")}
            >
              Back to Bots
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (errorBot) {
    return (
      <DashboardLayout>
        <div className="flex h-full items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-bold tracking-tight">
              Error con la sesión
            </h2>
            <p className="text-muted-foreground">
              Hubo un error con tu sesión. Por favor, cierra sesión y vuelve a
              ingresar.
            </p>
            <Button
              className="mt-4"
              onClick={() => router.push("/api/auth/signout")}
            >
              Cerrar sesión
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4 p-2 sm:p-4 md:gap-8 md:p-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => router.back()}
              type="button"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Button>
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                  {assistant?.name}
                </h1>
                <Badge
                  variant={
                    assistant?.status === "online"
                      ? "default"
                      : assistant.status === "maintenance"
                      ? "outline"
                      : "secondary"
                  }
                >
                  {assistant &&
                    assistant.status.charAt(0).toUpperCase() +
                      assistant.status.slice(1)}
                </Badge>
              </div>
              <p className="text-muted-foreground text-sm">
                Manage your chatbot settings, FAQs, and products.
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              onClick={() =>
                router.push(`/dashboard/bots/${assistant?._id}/preview`)
              }
              type="button"
              className="w-full sm:w-auto"
            >
              Preview
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              type="button"
              className="w-full sm:w-auto"
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
        <Tabs defaultValue="basic" className="space-y-4">
          {/* Mobile-optimized TabsList */}
          <div className="w-full overflow-hidden">
            <TabsList className="w-full h-auto p-1 grid grid-cols-3 md:grid-cols-6 gap-0.5 bg-muted rounded-lg">
              <TabsTrigger
                value="basic"
                className="text-xs sm:text-sm px-1 sm:px-3 py-2 rounded-md data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all"
              >
                Basic
              </TabsTrigger>
              <TabsTrigger
                value="faqs"
                className="text-xs sm:text-sm px-1 sm:px-3 py-2 rounded-md data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all"
              >
                FAQs
              </TabsTrigger>
              <TabsTrigger
                value="products"
                className="text-xs sm:text-sm px-1 sm:px-3 py-2 rounded-md data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all"
              >
                Products
              </TabsTrigger>
              <TabsTrigger
                value="functions"
                className="text-xs sm:text-sm px-1 sm:px-3 py-2 rounded-md data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all"
              >
                Servicios Tecnicos
              </TabsTrigger>

              <TabsTrigger
                value="chat-customization"
                className="text-xs sm:text-sm px-1 sm:px-3 py-2 rounded-md data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all"
              >
                Chat
              </TabsTrigger>
              <TabsTrigger
                value="test-chat"
                className="text-xs sm:text-sm px-1 sm:px-3 py-2 rounded-md data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all"
              >
                Test
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="basic" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Bot Information</CardTitle>
                <CardDescription>
                  Basic information about your chatbot.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="bot-name">Bot Name</Label>
                  <Input
                    id="bot-name"
                    value={assistant.name}
                    onChange={(e) => assistant.name !== e.target.value}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bot-description">Description</Label>
                  <Textarea
                    id="bot-description"
                    value={assistant.description}
                    onChange={(e) => assistant?.description !== e.target.value}
                    className="min-h-[100px]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="welcome-message">Welcome Message</Label>
                  <Textarea
                    id="welcome-message"
                    value={assistant.welcome_message}
                    onChange={(e) =>
                      assistant.welcome_message !== e.target.value
                    }
                    className="min-h-[100px]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bot-status">Status</Label>
                  <Select
                    value={assistant.status}
                    onValueChange={(value) => console.log(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="online">Online</SelectItem>
                      <SelectItem value="offline">Offline</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {assistant.type === "whatsapp" && (
                  <div className="space-y-2">
                    <Label htmlFor="whatsapp-number">
                      WhatsApp Business Number
                    </Label>
                    <Input
                      id="whatsapp-number"
                      value={""}
                      onChange={(e) => console.log(e.target.value)}
                      placeholder="+1234567890"
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="primary-color">Primary Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="primary-color"
                      type="color"
                      value={""}
                      onChange={(e) => console.log(e)}
                      className="w-12 h-10 p-1"
                    />
                    <Input
                      id="primary-color-hex"
                      value={""}
                      onChange={(e) => console.log(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="faqs" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                <div>
                  <CardTitle>Frequently Asked Questions</CardTitle>
                  <CardDescription>
                    Add questions and answers that your chatbot will respond to.
                  </CardDescription>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  <Button
                    onClick={handleAddFaq}
                    className="gap-1 w-full sm:w-auto"
                    type="button"
                  >
                    <Plus className="h-4 w-4" />
                    Add FAQ
                  </Button>
                  <Button
                    onClick={handleGenerateFaqs}
                    variant="outline"
                    className="gap-1 w-full sm:w-auto bg-transparent"
                    disabled={isGeneratingFaqs}
                    type="button"
                  >
                    {isGeneratingFaqs ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        Generate FAQs
                      </>
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <Label htmlFor="business-description">
                    Business Description
                  </Label>
                  <Textarea
                    id="business-description"
                    value={""}
                    onChange={(e) => console.log(e.target.value)}
                    placeholder={
                      language === "en"
                        ? "Provide a clear description of your business to help generate relevant FAQs..."
                        : "Proporciona una descripción clara de tu negocio para ayudar a generar preguntas frecuentes relevantes..."
                    }
                    className="min-h-[100px]"
                  />
                  <p className="text-sm text-muted-foreground">
                    {language === "en"
                      ? "A detailed description helps our AI generate more accurate and relevant FAQs for your business."
                      : "Una descripción detallada ayuda a nuestra IA a generar preguntas frecuentes más precisas y relevantes para tu negocio."}
                  </p>
                </div>
                <Accordion type="multiple" className="space-y-4">
                  {assistant &&
                    editingFaqs.map((faq, index) => (
                      <AccordionItem
                        key={faq._id}
                        value={`faq-${index}`}
                        className="border rounded-md p-5"
                      >
                        <div className="flex items-center justify-between">
                          <AccordionTrigger className="hover:no-underline flex-1 text-left">
                            {faq.question || "New FAQ Item"}
                          </AccordionTrigger>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveFaq(index);
                            }}
                            className="h-8 w-8 text-muted-foreground hover:text-destructive flex-shrink-0"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Remove FAQ</span>
                          </Button>
                        </div>
                        <AccordionContent className="space-y-4 p-2">
                          <div className="space-y-2">
                            <Label htmlFor={`faq-category-${index}`}>Tag</Label>
                            <Input
                              id={`faq-category-${index}`}
                              value={faq.category}
                              onChange={(e) =>
                                handleLocalChange(
                                  index,
                                  "category",
                                  e.target.value
                                )
                              }
                              placeholder="Category"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`faq-question-${index}`}>
                              Question
                            </Label>
                            <Input
                              id={`faq-question-${index}`}
                              value={faq.question}
                              onChange={(e) =>
                                handleLocalChange(
                                  index,
                                  "question",
                                  e.target.value
                                )
                              }
                              placeholder="What are your business hours?"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`faq-answer-${index}`}>
                              Answer
                            </Label>
                            <Textarea
                              id={`faq-answer-${index}`}
                              value={faq.answer}
                              onChange={(e) =>
                                handleLocalChange(
                                  index,
                                  "answer",
                                  e.target.value
                                )
                              }
                              placeholder="Our business hours are Monday to Friday, 9am to 5pm."
                              className="min-h-[100px]"
                            />
                          </div>
                          <Button
                            onClick={() => handleSaveFaq(index)}
                            className="w-full"
                            type="button"
                          >
                            Save
                          </Button>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                </Accordion>
                {bot && bot.faqs.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <p className="text-muted-foreground">No FAQs added yet.</p>
                    <Button
                      onClick={handleAddFaq}
                      variant="outline"
                      className="mt-4 gap-1 bg-transparent"
                      type="button"
                    >
                      <Plus className="h-4 w-4" />
                      Add Your First FAQ
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="products" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                <div>
                  <CardTitle>Products & Services</CardTitle>
                  <CardDescription>
                    Add products or services that your chatbot can recommend.
                  </CardDescription>
                </div>
                <Button
                  onClick={() => setIsProductModalOpen(true)}
                  className="gap-1 w-full sm:w-auto"
                  type="button"
                >
                  <Plus className="h-4 w-4" />
                  Add Product
                </Button>
              </CardHeader>
              <CardContent>
                <Accordion type="multiple" className="space-y-4">
                  {assistant &&
                    localProducts.map((product, index) => (
                      <AccordionItem
                        key={product._id}
                        value={`product-${index}`}
                        className="border rounded-md p-2"
                      >
                        <div className="flex items-center justify-between">
                          <AccordionTrigger className="hover:no-underline flex-1 text-left">
                            <div className="truncate">
                              {product.name || "New Product"}
                              {product.price && ` - ${product.price}`}
                              {product.stock == 0
                                ? ""
                                : product.stock && ` (Stock: ${product.stock})`}
                            </div>
                          </AccordionTrigger>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveProduct(index);
                            }}
                            className="h-8 w-8 text-muted-foreground hover:text-destructive flex-shrink-0"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Remove Product</span>
                          </Button>
                        </div>
                        <AccordionContent className="space-y-4 pt-2">
                          <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                              <Label htmlFor={`product-name-${index}`}>
                                Product Name
                              </Label>
                              <Input
                                id={`product-name-${index}`}
                                value={product.name}
                                onChange={(e) => {
                                  const updated = [...localProducts];
                                  updated[index].name = e.target.value;
                                  setLocalProducts(updated);
                                }}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`product-price-${index}`}>
                                Price
                              </Label>
                              <Input
                                id={`product-price-${index}`}
                                value={product.price}
                                onChange={(e) => {
                                  const updated = [...localProducts];
                                  updated[index].price = e.target.value;
                                  setLocalProducts(updated);
                                }}
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`product-description-${index}`}>
                              Description
                            </Label>
                            <Textarea
                              id={`product-description-${index}`}
                              value={product.description}
                              onChange={(e) => {
                                const updated = [...localProducts];
                                updated[index].description = e.target.value;
                                setLocalProducts(updated);
                              }}
                              className="min-h-[100px]"
                            />
                          </div>
                          <div className="grid gap-4 md:grid-cols-2">
                            <div className="flex items-center space-x-2">
                              <Switch
                                id={`product-available-${index}`}
                                checked={product.available}
                                onCheckedChange={(checked) => {
                                  const updated = [...localProducts];
                                  updated[index].available = checked;
                                  setLocalProducts(updated);
                                }}
                              />
                              <Label htmlFor={`product-available-${index}`}>
                                Available
                              </Label>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`product-stock-${index}`}>
                                Stock (Optional)
                              </Label>
                              <Input
                                id={`product-stock-${index}`}
                                type="number"
                                min="0"
                                value={product.stock || ""}
                                onChange={(e) => {
                                  const updated = [...localProducts];
                                  updated[index].stock = Number.parseInt(
                                    e.target.value,
                                    10
                                  );
                                  setLocalProducts(updated);
                                }}
                              />
                            </div>
                          </div>
                          <Button
                            onClick={() => {
                              updateProduct(
                                product._id,
                                {
                                  name: product.name,
                                  price: product.price,
                                  description: product.description,
                                  stock: product.stock,
                                  available: product.available,
                                  tags: [],
                                },
                                session?.binding_id || ""
                              );
                              return toast({
                                title: "Exito",
                                description:
                                  "Se Guardaron los cambios del Producto",
                              });
                            }}
                            className="w-full"
                            type="button"
                          >
                            Guardar Cambios
                          </Button>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                </Accordion>
                {assistant && products.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <p className="text-muted-foreground">
                      No products added yet.
                    </p>
                    <Button
                      onClick={() => setIsProductModalOpen(true)}
                      variant="outline"
                      className="mt-4 gap-1"
                      type="button"
                    >
                      <Plus className="h-4 w-4" />
                      Add Your First Product
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="functions" className="space-y-4">
            <Card>
              <Tabs defaultValue="functions-list">
                <TabsList className="w-full h-auto p-1 grid grid-cols-2 md:grid-cols-2 gap-0.5 bg-muted rounded-lg">
                  <TabsTrigger value="functions-list">Funciones</TabsTrigger>
                  <TabsTrigger value="autimatizaciones">
                    Automtizaciones
                  </TabsTrigger>
                </TabsList>
                <CardContent>
                  <TabsContent value="functions-list">
                    <Card>
                      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                        <div className="my-5">
                          <CardTitle>Bot Functions & Services</CardTitle>
                          <CardDescription>
                            Add custom functions and services that your bot can
                            execute.
                          </CardDescription>
                        </div>
                        <Button
                          onClick={() => {
                            setEditingFunction(undefined); // Asegurarse de que es para añadir
                            setIsFunctionModalOpen(true);
                          }}
                          className="gap-1 w-full sm:w-auto"
                          type="button"
                        >
                          <Plus className="h-4 w-4" />
                          Add Function
                        </Button>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {functions.length > 0 ? (
                            <Accordion type="multiple" className="space-y-4">
                              {functions.map((func, index) => (
                                <AccordionItem
                                  key={func._id || index} // Usar _id si está disponible, sino index
                                  value={`function-${index}`}
                                  className="border rounded-md p-2"
                                >
                                  <div className="flex items-center justify-between">
                                    <AccordionTrigger className="hover:no-underline flex-1 text-left">
                                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                        <Badge
                                          variant={
                                            func.type === "api"
                                              ? "default"
                                              : "secondary"
                                          }
                                        >
                                          {func.type === "api"
                                            ? "API"
                                            : "Custom"}
                                        </Badge>
                                        <span className="truncate">
                                          {func.name}
                                        </span>
                                      </div>
                                    </AccordionTrigger>
                                    <div>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setEditingFunction(func); // Establecer la función a editar
                                          setIsFunctionModalOpen(true); // Abrir el modal
                                        }}
                                        className="h-8 w-8 text-muted-foreground hover:text-green-700 flex-shrink-0"
                                        type="button"
                                      >
                                        <FilePen className="h-4 w-4" />
                                        <span className="sr-only">
                                          Edit Function
                                        </span>
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleRemoveFunction(func._id); // Usar _id para eliminar
                                        }}
                                        className="h-8 w-8 text-muted-foreground hover:text-destructive flex-shrink-0"
                                        type="button"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                        <span className="sr-only">
                                          Remove Function
                                        </span>
                                      </Button>
                                    </div>
                                  </div>
                                  <AccordionContent className="space-y-4 pt-2">
                                    <div className="space-y-2">
                                      <p className="text-sm text-muted-foreground">
                                        {func.description}
                                      </p>
                                      {func.hasApi && func.api && (
                                        <div className="space-y-2">
                                          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                            <Badge variant="outline">
                                              {func.api.method}
                                            </Badge>
                                            <code className="text-xs bg-muted px-2 py-1 rounded break-all">
                                              {func.api.url}
                                            </code>
                                          </div>
                                          {func.api.parameters &&
                                            func.api.parameters.length > 0 && (
                                              <div>
                                                <p className="text-sm font-medium mb-1">
                                                  Parameters:
                                                </p>
                                                <div className="flex flex-wrap gap-1">
                                                  {func.api.parameters.map(
                                                    (
                                                      param: {
                                                        name: string;
                                                        type: string;
                                                        required?: boolean;
                                                      },
                                                      paramIndex: number
                                                    ) => (
                                                      <Badge
                                                        key={paramIndex}
                                                        variant="outline"
                                                        className="text-xs"
                                                      >
                                                        {param.name} (
                                                        {param.type})
                                                        {param.required && "*"}
                                                      </Badge>
                                                    )
                                                  )}
                                                </div>
                                              </div>
                                            )}
                                        </div>
                                      )}
                                      {func.type === "custom" && (
                                        <div className="bg-muted p-3 rounded-md">
                                          <p className="text-xs font-medium mb-1">
                                            Custom Code:
                                          </p>
                                          <pre className="text-xs overflow-x-auto whitespace-pre-wrap">
                                            {func.code?.substring(0, 200)}
                                            {func.code &&
                                              func.code.length > 200 &&
                                              "..."}
                                          </pre>
                                        </div>
                                      )}
                                    </div>
                                  </AccordionContent>
                                </AccordionItem>
                              ))}
                            </Accordion>
                          ) : (
                            <div className="flex flex-col items-center justify-center py-8 text-center">
                              <p className="text-muted-foreground">
                                No functions added yet.
                              </p>
                              <Button
                                onClick={() => {
                                  setEditingFunction(undefined); // Asegurarse de que es para añadir
                                  setIsFunctionModalOpen(true);
                                }}
                                variant="outline"
                                className="mt-4 gap-1"
                                type="button"
                              >
                                <Plus className="h-4 w-4" />
                                Add Your First Function
                              </Button>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  <TabsContent value="autimatizaciones">
                    <AdvancedBotTasks />
                  </TabsContent>
                </CardContent>
              </Tabs>
            </Card>
          </TabsContent>
          <TabsContent value="chat-customization" className="space-y-4">
            <ChatWidgetCustomization
              language={language as "en" | "es"}
              chatSettings={
                bot && bot.chatSettings
                  ? {
                      ...bot.chatSettings,
                      title: bot.chatSettings.title ?? "",
                      subtitle: bot.chatSettings.subtitle ?? "",
                      primaryColor: bot.chatSettings.primaryColor ?? "#4f46e5",
                      buttonColor: bot.chatSettings.buttonColor ?? "#4f46e5",
                      bubbleColor: bot.chatSettings.bubbleColor ?? "#f9fafb",
                      userBubbleColor:
                        bot.chatSettings.userBubbleColor ?? "#000000",
                      headerStyle: bot.chatSettings.headerStyle ?? "gradient",
                      showLogo: bot.chatSettings.showLogo ?? true,
                      position: bot.chatSettings.position ?? "right",
                      initialMessage: bot.chatSettings.initialMessage ?? "",
                      placeholderText: bot.chatSettings.placeholderText ?? "",
                      userTextColor:
                        bot.chatSettings.userTextColor ?? "#ffffff",
                      botTextColor: bot.chatSettings.botTextColor ?? "#000000",
                    }
                  : {
                      title: "",
                      subtitle: "",
                      primaryColor: "#4f46e5",
                      buttonColor: "#4f46e5",
                      bubbleColor: "#f9fafb",
                      userBubbleColor: "#000000",
                      headerStyle: "gradient",
                      logo: "",
                      showLogo: true,
                      position: "right",
                      initialMessage: "",
                      placeholderText: "",
                      userTextColor: "#ffffff",
                      botTextColor: "#000000",
                    }
              }
              onSettingsChange={handleUpdateChatSettings}
            />
          </TabsContent>
          <TabsContent value="test-chat" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Test Your Bot</CardTitle>
                <CardDescription>
                  Test your bot's responses and functionality in real-time.
                  Manage multiple chat sessions.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="flex h-[600px]">
                  {/* Sidebar */}
                  <div
                    className={cn(
                      "border-r bg-gray-50 dark:bg-gray-900 transition-all duration-300",
                      sidebarOpen ? "w-80" : "w-0 overflow-hidden"
                    )}
                  >
                    <div className="p-4 border-b">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-sm">Chat Sessions</h3>
                        <Button
                          onClick={() => setSidebarOpen(false)}
                          size="sm"
                          variant="ghost"
                          className="lg:hidden"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <Button
                        onClick={async () => {
                          setSelectedChatId("1");
                          setTemporalMessage("");
                          fetchChat("1");
                        }}
                        size="sm"
                        className="w-full bg-transparent"
                        variant="outline"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        New Chat
                      </Button>
                    </div>
                    <div className="overflow-y-auto h-[calc(100%-80px)]">
                      {chats.map((chat, index) => {
                        return (
                          <button
                            key={chat.id}
                            onClick={() => {
                              fetchChat(chat.id);
                            }}
                            className={cn(
                              "w-full text-left px-4 py-3 transition-colors border-b",
                              selectedChatId === chat.id
                                ? "bg-slate-100 font-semibold"
                                : "bg-white hover:bg-slate-100"
                            )}
                          >
                            <div className="flex flex-col w-full">
                              <p className="text-sm text-gray-900 truncate">
                                🗨️ Chat {index + 1}
                              </p>
                              <span className="text-xs text-gray-500 truncate">
                                {chat.lastActivity || "No recent activity"}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  {/* Main Chat Area */}
                  <div className="flex-1 flex flex-col">
                    {/* Mobile sidebar toggle */}
                    {!sidebarOpen && (
                      <div className="p-2 border-b lg:hidden">
                        <Button
                          onClick={() => setSidebarOpen(true)}
                          size="sm"
                          variant="ghost"
                        >
                          <Menu className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                    {/* Chat Header */}
                    <div
                      className="p-4 border-b"
                      style={{
                        background:
                          bot && bot.chatSettings?.headerStyle === "gradient"
                            ? `linear-gradient(to right, ${
                                bot.chatSettings.primaryColor
                              }, ${adjustColor(
                                bot.chatSettings.primaryColor || "#4f46e5",
                                -30
                              )})`
                            : (bot && bot.chatSettings?.primaryColor) ||
                              "#4f46e5",
                      }}
                    >
                      <div className="flex items-center gap-3">
                        {bot && bot.chatSettings?.showLogo && (
                          <div className="bg-white/20 rounded-full p-2">
                            <MessageSquare className="h-5 w-5 text-white" />
                          </div>
                        )}
                        <div>
                          <h3 className="font-medium text-white">
                            {chatTiitle}
                          </h3>
                          <p className="text-sm text-gray-200">
                            {(bot && bot.chatSettings?.subtitle) ||
                              "Testing Mode"}
                          </p>
                        </div>
                      </div>
                    </div>
                    {/* Chat Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-950">
                      <div className=" flex justify-start">
                        <div className="mr-2 flex-shrink-0">
                          <div
                            className="rounded-full h-8 w-8 flex items-center justify-center"
                            style={{
                              background:
                                (bot && bot.chatSettings?.primaryColor) ||
                                "#4f46e5",
                            }}
                          >
                            <MessageSquare className="h-4 w-4 text-white" />
                          </div>
                        </div>
                        <div
                          className={`max-w-[80%] sm:max-w-[70%] p-3 rounded-lg`}
                          style={{
                            background:
                              (bot && bot.chatSettings?.bubbleColor) ||
                              "#f9fafb",
                            color: "#000",
                          }}
                        >
                          <p className="text-sm">{assistant.welcome_message}</p>
                        </div>
                      </div>
                      {currentChat?.messages.map((message, index) => {
                        return (
                          <div
                            key={index}
                            className={`flex ${
                              message.role === "user"
                                ? "justify-end"
                                : "justify-start"
                            }`}
                          >
                            {message.role == "assistant" && (
                              <div className="mr-2 flex-shrink-0">
                                <div
                                  className="rounded-full h-8 w-8 flex items-center justify-center"
                                  style={{
                                    background:
                                      (bot && bot.chatSettings?.primaryColor) ||
                                      "#4f46e5",
                                  }}
                                >
                                  <MessageSquare className="h-4 w-4 text-white" />
                                </div>
                              </div>
                            )}
                            <div
                              className={`max-w-[80%] sm:max-w-[70%] p-3 rounded-lg`}
                              style={{
                                background:
                                  message.role === "user"
                                    ? (bot &&
                                        bot.chatSettings?.userBubbleColor) ||
                                      "#000000"
                                    : (bot && bot.chatSettings?.bubbleColor) ||
                                      "#f9fafb",
                                color:
                                  message.role === "user" ? "#fff" : "#000",
                              }}
                            >
                              <p className="text-sm">{message.content}</p>
                              <p className="text-xs mt-1 text-muted-foreground italic">
                                {message.createdAt &&
                                  new Date(message.createdAt).toLocaleString(
                                    "es-EC",
                                    {
                                      weekday: "short",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                      day: "2-digit",
                                      month: "short",
                                    }
                                  )}
                              </p>
                            </div>
                            {message.role === "user" && (
                              <div className="ml-2 flex-shrink-0">
                                <div className="bg-gray-300 dark:bg-gray-700 rounded-full h-8 w-8 flex items-center justify-center">
                                  <span className="text-xs font-medium text-gray-800 dark:text-white">
                                    You
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                      {/* ✅ MENSAJE TEMPORAL MEJORADO */}
                      {temporalMessage && (
                        <div className="flex justify-end">
                          <div
                            className="max-w-[80%] sm:max-w-[70%] p-3 rounded-lg opacity-70"
                            style={{
                              background:
                                (bot && bot.chatSettings?.userBubbleColor) ||
                                "#000000",
                              color: "#fff",
                            }}
                          >
                            <p className="text-sm">{temporalMessage}</p>
                            <p className="text-xs mt-1 opacity-60">
                              Enviando...
                            </p>
                          </div>
                          <div className="ml-2 flex-shrink-0">
                            <div className="bg-gray-300 dark:bg-gray-700 rounded-full h-8 w-8 flex items-center justify-center">
                              <span className="text-xs font-medium text-gray-800 dark:text-white">
                                You
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    {/* Chat Input */}
                    <div className="p-4 border-t bg-background">
                      <div className="flex gap-2">
                        <Input
                          value={testInput}
                          onChange={(e) => setTestInput(e.target.value)}
                          placeholder={
                            (bot && bot.chatSettings?.placeholderText) ||
                            "Type your message..."
                          }
                          className="flex-1"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleSendTestMessage();
                            }
                          }}
                        />
                        <Button
                          type="button"
                          onClick={handleSendTestMessage}
                          disabled={!testInput.trim()}
                          style={{
                            background:
                              (bot && bot.chatSettings?.buttonColor) ||
                              "#4f46e5",
                          }}
                          className="text-white"
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <ProductModal
        open={isProductModalOpen}
        onOpenChange={setIsProductModalOpen}
        onAddProduct={handleAddProduct}
      />
      <FunctionModal
        open={isFunctionModalOpen}
        onOpenChange={setIsFunctionModalOpen}
        // @ts-ignore
        onAddFunction={handleAddFunction}
        // @ts-ignore
        editFunction={editingFunction}
        // @ts-ignore
        onEditFunction={handleEditFunction}
        language={language}
      />
    </DashboardLayout>
  );
}
