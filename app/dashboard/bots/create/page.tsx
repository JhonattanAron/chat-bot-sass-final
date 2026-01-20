"use client";

import { Badge } from "@/components/ui/badge";

import type React from "react";
import { useRef } from "react";
import { useState, useCallback } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/language-context";
import { TokenCounter } from "@/components/token-counter";
import { ProductModal } from "@/components/product-modal";
import { FunctionModal } from "@/components/functions/function-modal";
import SimpleAlert from "@/components/ui/simple-alert";
import { useChatAssistantStore } from "@/store/chatAsistantStore";
import { useSession } from "next-auth/react";
import type { APIResponse } from "@/interfaces/api-response-interface";
import { PlatformSelector } from "@/components/create-bot/plataform-selector";
import WhatsAppLinker from "@/components/create-bot/Whatsapp-link-component";

export interface Integration {
  name: string;
  type: string;
  config: Record<string, any>;
}

export default function CreateBotPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [botType, setBotType] = useState("web");
  const [botName, setBotName] = useState("");
  const [useCase, setUseCase] = useState("restaurant");
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isGeneratingFaqs, setIsGeneratingFaqs] = useState(false);
  const [welcomeMessage, setWelcomeMessage] = useState("");
  const [description, setDescription] = useState("");
  const [businessDescription, setBusinessDescription] = useState("");
  const { createAssistant } = useChatAssistantStore();
  const { data: session } = useSession();
  const [chatSettings, setChatSettings] = useState({
    title: "ChatBot Support",
    subtitle: "Virtual Assistant",
    primaryColor: "#4f46e5",
    buttonColor: "#4f46e5",
    bubbleColor: "#f9fafb",
    userBubbleColor: "#000000",
    headerStyle: "gradient" as "gradient" | "solid",
    showLogo: true,
    position: "right" as "right" | "left",
    initialMessage: "Hello! How can I help you today?",
    placeholderText: "Type your message...",
  });
  const [faqs, setFaqs] = useState([
    {
      question: "What are your business hours?",
      answer: "Our business hours are Monday to Friday, 9am to 5pm.",
      category: "General",
    },
    {
      question: "How do I reset my password?",
      answer:
        "You can reset your password by clicking on the 'Forgot Password' link on the login page.",
      category: "Account",
    },
  ]);
  const [products, setProducts] = useState([
    {
      name: "Premium Plan",
      price: "$99.99",
      description:
        "Our premium plan includes all features and priority support.",
      available: true,
      stock: "150",
    },
    {
      name: "Basic Plan",
      price: "$49.99",
      description:
        "Our basic plan includes essential features for small businesses.",
      available: true,
    },
  ]);
  const [apiProducts, setApiProducts] = useState<
    { apiUrl: string; apiKey: string }[]
  >([]);
  const [functions, setFunctions] = useState<any[]>([]);
  const [isFunctionModalOpen, setIsFunctionModalOpen] = useState(false);

  // Agregar estado después de los existentes
  const [activeBots, setActiveBots] = useState(2); // Simular 2 bots activos
  const [userPlan, setUserPlan] = useState("basic"); // Simular plan básico

  // Agregar límites de planes
  const planLimits = {
    basic: 3,
    pro: 10,
    enterprise: 50,
  };

  const router = useRouter();
  const { toast } = useToast();

  // Safe language context usage with fallback
  const languageContext = useLanguage();
  let t: (key: string) => string = (key: string) => key;
  let language = "en";

  if (languageContext) {
    t = languageContext.t;
    language = languageContext.language;
  } else {
    console.warn("Language context not available, using fallback");
  }

  // Calcular tokens aproximados para los campos principales
  const welcomeMessageTokens =
    welcomeMessage.length > 0 ? Math.ceil(welcomeMessage.length / 4) : 0;
  const descriptionTokens =
    description.length > 0 ? Math.ceil(description.length / 4) : 0;

  // Calcular tokens para FAQs
  const faqTokens = faqs.reduce((total, faq) => {
    return total + Math.ceil((faq.question.length + faq.answer.length) / 4);
  }, 0);

  // Calcular tokens para productos
  const productTokens = products.reduce((total, product) => {
    return (
      total + Math.ceil((product.name.length + product.description.length) / 4)
    );
  }, 0);

  // Total de tokens
  const totalTokens =
    welcomeMessageTokens + descriptionTokens + faqTokens + productTokens;

  const [integrations, setIntegrations] = useState<Integration[]>([]);

  const platformSelectorRef = useRef<{
    getCurrentIntegrations: () => Integration[];
  }>(null);

  // Modificar el handleSubmit para incluir validación
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (session?.binding_id === undefined) {
      return <SimpleAlert message="Ocurrio un Error con la session" />;
    }

    let finalIntegrations = integrations;
    if (integrations.length === 0 && platformSelectorRef.current) {
      finalIntegrations = platformSelectorRef.current.getCurrentIntegrations();
    }

    const response = (await createAssistant({
      user_id: session?.binding_id || "",
      name: botName,
      description: description,
      type: botType,
      status: "active",
      funciones: [],
      integrations: finalIntegrations, // <-- Now sending integrations
      use_case: useCase,
      welcome_message: welcomeMessage,
      faqs: [],
    })) as APIResponse;
    console.log({ Response: response });
    if (response && (response as any).error) {
      toast({
        title: language === "en" ? "Error" : "Error",
        description: (response as any).data?.error,
        variant: "destructive",
      });
      return;
    }
    if (activeBots >= planLimits[userPlan as keyof typeof planLimits]) {
      toast({
        title:
          language === "en" ? "Bot Limit Reached" : "Límite de Bots Alcanzado",
        description:
          language === "en"
            ? `You've reached the maximum number of bots for your ${userPlan} plan. Please upgrade to create more bots.`
            : `Has alcanzado el número máximo de bots para tu plan ${userPlan}. Por favor actualiza tu plan para crear más bots.`,
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setActiveBots((prev) => prev + 1); // Incrementar contador
      toast({
        title: language === "en" ? "Bot Created" : "Bot Creado",
        description: `${
          language === "en" ? "Your bot" : "Tu bot"
        } "${botName}" ${
          language === "en"
            ? "has been created successfully"
            : "ha sido creado exitosamente"
        }.`,
      });
      router.push("/dashboard/bots");
    }, 1500);
  };
  //creacion del
  const handleAddFaq = () => {
    setFaqs([
      ...faqs,
      {
        question: "",
        answer: "",
        category: "General",
      },
    ]);
  };

  const handleUpdateFaq = (
    index: number,
    field: "question" | "answer" | "category",
    value: string
  ) => {
    const updatedFaqs = [...faqs];
    updatedFaqs[index] = { ...updatedFaqs[index], [field]: value };
    setFaqs(updatedFaqs);
  };

  const handleRemoveFaq = (index: number) => {
    const updatedFaqs = faqs.filter((_, i) => i !== index);
    setFaqs(updatedFaqs);
  };

  const handleAddProduct = (product: any, method: "manual" | "api") => {
    if (method === "manual") {
      setProducts([...products, product]);
    } else {
      setApiProducts([...apiProducts, product]);
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
    const updatedProducts = products.filter((_, i) => i !== index);
    setProducts(updatedProducts);
  };

  const handleGenerateFaqs = () => {
    if (!businessDescription) {
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

      setFaqs([...faqs, ...generatedFaqs]);
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

  const handleUpdateChatSettings = (field: string, value: any) => {
    setChatSettings({
      ...chatSettings,
      [field]: value,
    });
  };

  // Función para cargar plantillas según el caso de uso
  const loadUseCaseTemplate = (selectedUseCase: string) => {
    setUseCase(selectedUseCase);

    // Configurar FAQs según el caso de uso
    switch (selectedUseCase) {
      case "restaurant":
        setFaqs([
          {
            question:
              language === "en"
                ? "What are your opening hours?"
                : "¿Cuáles son sus horarios de apertura?",
            answer:
              language === "en"
                ? "We are open Monday to Friday from 11am to 10pm, and weekends from 12pm to 11pm."
                : "Estamos abiertos de lunes a viernes de 11am a 10pm, y fines de semana de 12pm a 11pm.",
            category: "General",
          },
          {
            question:
              language === "en"
                ? "Do you take reservations?"
                : "¿Aceptan reservaciones?",
            answer:
              language === "en"
                ? "Yes, you can make a reservation by calling us or through our website."
                : "Sí, puede hacer una reserva llamándonos o a través de nuestro sitio web.",
            category: "Reservations",
          },
          {
            question:
              language === "en"
                ? "Do you have vegetarian options?"
                : "¿Tienen opciones vegetarianas?",
            answer:
              language === "en"
                ? "Yes, we offer a variety of vegetarian and vegan dishes."
                : "Sí, ofrecemos una variedad de platos vegetarianos y veganos.",
            category: "Menu",
          },
        ]);
        setProducts([
          {
            name: language === "en" ? "Special Dinner" : "Cena Especial",
            price: "$45.99",
            description:
              language === "en"
                ? "A complete dinner experience with appetizer, main course, and dessert."
                : "Una experiencia completa de cena con aperitivo, plato principal y postre.",
            available: true,
            stock: "25",
          },
          {
            name: language === "en" ? "Lunch Menu" : "Menú de Almuerzo",
            price: "$24.99",
            description:
              language === "en"
                ? "Our special lunch menu available Monday to Friday."
                : "Nuestro menú especial de almuerzo disponible de lunes a viernes.",
            available: true,
            stock: "40",
          },
        ]);
        setBusinessDescription(
          language === "en"
            ? "We are a fine dining restaurant specializing in international cuisine with a focus on local ingredients. Our chefs create unique dishes that blend traditional recipes with modern techniques."
            : "Somos un restaurante de alta cocina especializado en cocina internacional con enfoque en ingredientes locales. Nuestros chefs crean platos únicos que combinan recetas tradicionales con técnicas modernas."
        );
        break;
      case "onlineStore":
        setFaqs([
          {
            question:
              language === "en"
                ? "What are your shipping options?"
                : "¿Cuáles son sus opciones de envío?",
            answer:
              language === "en"
                ? "We offer standard shipping (3-5 days) and express shipping (1-2 days)."
                : "Ofrecemos envío estándar (3-5 días) y envío express (1-2 días).",
            category: "Shipping",
          },
          {
            question:
              language === "en"
                ? "What is your return policy?"
                : "¿Cuál es su política de devoluciones?",
            answer:
              language === "en"
                ? "You can return any item within 30 days of purchase for a full refund."
                : "Puede devolver cualquier artículo dentro de los 30 días posteriores a la compra para un reembolso completo.",
            category: "Returns",
          },
          {
            question:
              language === "en"
                ? "Do you ship internationally?"
                : "¿Realizan envíos internacionales?",
            answer:
              language === "en"
                ? "Yes, we ship to most countries worldwide. Shipping costs and times vary by location."
                : "Sí, enviamos a la mayoría de los países del mundo. Los costos y tiempos de envío varían según la ubicación.",
            category: "Shipping",
          },
        ]);
        setProducts([
          {
            name: language === "en" ? "Premium Product" : "Producto Premium",
            price: "$199.99",
            description:
              language === "en"
                ? "Our flagship product with all premium features."
                : "Nuestro producto estrella con todas las características premium.",
            available: true,
            stock: "75",
          },
          {
            name: language === "en" ? "Basic Product" : "Producto Básico",
            price: "$99.99",
            description:
              language === "en"
                ? "A great starter option with essential features."
                : "Una gran opción inicial con características esenciales.",
            available: true,
            stock: "120",
          },
        ]);
        setBusinessDescription(
          language === "en"
            ? "We are an e-commerce store offering high-quality products for home and office. Our selection includes electronics, furniture, and accessories, all carefully curated for quality and design."
            : "Somos una tienda de comercio electrónico que ofrece productos de alta calidad para el hogar y la oficina. Nuestra selección incluye electrónica, muebles y accesorios, todos cuidadosamente seleccionados por su calidad y diseño."
        );
        break;
      case "customerSupport":
        setFaqs([
          {
            question:
              language === "en"
                ? "How do I reset my password?"
                : "¿Cómo restablezco mi contraseña?",
            answer:
              language === "en"
                ? "You can reset your password by clicking on the 'Forgot Password' link on the login page."
                : "Puede restablecer su contraseña haciendo clic en el enlace 'Olvidé mi contraseña' en la página de inicio de sesión.",
            category: "Account",
          },
          {
            question:
              language === "en"
                ? "How do I contact customer support?"
                : "¿Cómo contacto al soporte al cliente?",
            answer:
              language === "en"
                ? "You can reach our customer support team via email, phone, or live chat on our website."
                : "Puede comunicarse con nuestro equipo de soporte al cliente por correo electrónico, teléfono o chat en vivo en nuestro sitio web.",
            category: "Support",
          },
          {
            question:
              language === "en"
                ? "What are your business hours?"
                : "¿Cuáles son sus horarios de atención?",
            answer:
              language === "en"
                ? "Our support team is available Monday to Friday, 9am to 6pm EST."
                : "Nuestro equipo de soporte está disponible de lunes a viernes, de 9 am a 6 pm EST.",
            category: "General",
          },
        ]);
        setProducts([
          {
            name: language === "en" ? "Premium Support" : "Soporte Premium",
            price: "$49.99/month",
            description:
              language === "en"
                ? "24/7 priority support with dedicated account manager."
                : "Soporte prioritario 24/7 con gerente de cuenta dedicado.",
            available: true,
          },
          {
            name: language === "en" ? "Basic Support" : "Soporte Básico",
            price: "$19.99/month",
            description:
              language === "en"
                ? "Standard support during business hours."
                : "Soporte estándar durante horario comercial.",
            available: true,
          },
        ]);
        setBusinessDescription(
          language === "en"
            ? "We provide customer support services for a wide range of software products. Our team of experts is trained to help users troubleshoot issues, answer questions, and provide guidance on product features."
            : "Proporcionamos servicios de atención al cliente para una amplia gama de productos de software. Nuestro equipo de expertos está capacitado para ayudar a los usuarios a solucionar problemas, responder preguntas y proporcionar orientación sobre las características del producto."
        );
        break;
      case "realEstate":
        setFaqs([
          {
            question:
              language === "en"
                ? "What properties do you have available?"
                : "¿Qué propiedades tienen disponibles?",
            answer:
              language === "en"
                ? "We have a variety of properties including apartments, houses, and commercial spaces. You can view our current listings on our website."
                : "Tenemos una variedad de propiedades que incluyen apartamentos, casas y espacios comerciales. Puede ver nuestros listados actuales en nuestro sitio web.",
            category: "Properties",
          },
          {
            question:
              language === "en"
                ? "How do I schedule a viewing?"
                : "¿Cómo programo una visita?",
            answer:
              language === "en"
                ? "You can schedule a viewing by contacting our office or using the booking form on our website."
                : "Puede programar una visita contactando a nuestra oficina o utilizando el formulario de reserva en nuestro sitio web.",
            category: "Viewings",
          },
          {
            question:
              language === "en"
                ? "What documents do I need to rent a property?"
                : "¿Qué documentos necesito para alquilar una propiedad?",
            answer:
              language === "en"
                ? "Typically, you'll need ID, proof of income, references, and a security deposit."
                : "Por lo general, necesitará identificación, comprobante de ingresos, referencias y un depósito de seguridad.",
            category: "Rentals",
          },
        ]);
        setProducts([
          {
            name:
              language === "en" ? "Luxury Apartment" : "Apartamento de Lujo",
            price: "$2,500/month",
            description:
              language === "en"
                ? "Modern luxury apartment in prime location with amenities."
                : "Apartamento de lujo moderno en ubicación privilegiada con comodidades.",
            available: true,
            stock: "3",
          },
          {
            name: language === "en" ? "Family Home" : "Casa Familiar",
            price: "$350,000",
            description:
              language === "en"
                ? "Spacious family home with 4 bedrooms and a large garden."
                : "Amplia casa familiar con 4 dormitorios y un gran jardín.",
            available: true,
            stock: "1",
          },
        ]);
        setBusinessDescription(
          language === "en"
            ? "We are a real estate agency specializing in residential and commercial properties. Our team of experienced agents helps clients find their perfect home or investment property, with a focus on premium locations and excellent customer service."
            : "Somos una agencia inmobiliaria especializada en propiedades residenciales y comerciales. Nuestro equipo de agentes experimentados ayuda a los clientes a encontrar su hogar perfecto o propiedad de inversión, con un enfoque en ubicaciones premium y excelente servicio al cliente."
        );
        break;
      case "appointments":
        setFaqs([
          {
            question:
              language === "en"
                ? "How do I book an appointment?"
                : "¿Cómo reservo una cita?",
            answer:
              language === "en"
                ? "You can book an appointment through our website, mobile app, or by calling our office."
                : "Puede reservar una cita a través de nuestro sitio web, aplicación móvil o llamando a nuestra oficina.",
            category: "Booking",
          },
          {
            question:
              language === "en"
                ? "How do I cancel or reschedule?"
                : "¿Cómo cancelo o reprogramo?",
            answer:
              language === "en"
                ? "You can cancel or reschedule your appointment up to 24 hours in advance through your account or by contacting us."
                : "Puede cancelar o reprogramar su cita hasta con 24 horas de anticipación a través de su cuenta o contactándonos.",
            category: "Booking",
          },
          {
            question:
              language === "en"
                ? "What should I bring to my appointment?"
                : "¿Qué debo llevar a mi cita?",
            answer:
              language === "en"
                ? "Please bring your ID, insurance information (if applicable), and any relevant medical records or referrals."
                : "Por favor traiga su identificación, información del seguro (si corresponde) y cualquier registro médico o referencia relevante.",
            category: "Preparation",
          },
        ]);
        setProducts([
          {
            name:
              language === "en" ? "Standard Consultation" : "Consulta Estándar",
            price: "$75",
            description:
              language === "en"
                ? "A 30-minute consultation with our specialist."
                : "Una consulta de 30 minutos con nuestro especialista.",
            available: true,
            stock: "15",
          },
          {
            name:
              language === "en"
                ? "Comprehensive Assessment"
                : "Evaluación Integral",
            price: "$150",
            description:
              language === "en"
                ? "A 60-minute in-depth assessment and treatment plan."
                : "Una evaluación en profundidad de 60 minutos y plan de tratamiento.",
            available: true,
            stock: "8",
          },
        ]);
        setBusinessDescription(
          language === "en"
            ? "We are a healthcare clinic offering a range of medical and wellness services. Our team of professionals includes doctors, therapists, and specialists who provide personalized care for all patients. We focus on preventive care and holistic treatment approaches."
            : "Somos una clínica de salud que ofrece una variedad de servicios médicos y de bienestar. Nuestro equipo de profesionales incluye médicos, terapeutas y especialistas que brindan atención personalizada a todos los pacientes. Nos enfocamos en la atención preventiva y enfoques de tratamiento holísticos."
        );
        break;
      default:
        // Mantener los valores predeterminados
        break;
    }
  };

  // Add default themes for chat customization
  // Add this after the chatSettings state:
  const [selectedTheme, setSelectedTheme] = useState("default");

  const chatThemes = {
    default: {
      title: "ChatBot Support",
      subtitle: "Virtual Assistant",
      primaryColor: "#4f46e5",
      buttonColor: "#4f46e5",
      bubbleColor: "#f9fafb",
      userBubbleColor: "#000000",
      headerStyle: "gradient" as "gradient" | "solid",
    },
    dark: {
      title: "Support Chat",
      subtitle: "AI Assistant",
      primaryColor: "#1f2937",
      buttonColor: "#1f2937",
      bubbleColor: "#374151",
      userBubbleColor: "#111827",
      headerStyle: "solid" as "gradient" | "solid",
    },
    light: {
      title: "Help Center",
      subtitle: "Chat Support",
      primaryColor: "#60a5fa",
      buttonColor: "#3b82f6",
      bubbleColor: "#f3f4f6",
      userBubbleColor: "#dbeafe",
      headerStyle: "gradient" as "gradient" | "solid",
    },
    green: {
      title: "Customer Support",
      subtitle: "We're here to help",
      primaryColor: "#10b981",
      buttonColor: "#059669",
      bubbleColor: "#ecfdf5",
      userBubbleColor: "#d1fae5",
      headerStyle: "gradient" as "gradient" | "solid",
    },
    orange: {
      title: "Chat with us",
      subtitle: "Quick Support",
      primaryColor: "#f97316",
      buttonColor: "#ea580c",
      bubbleColor: "#fff7ed",
      userBubbleColor: "#ffedd5",
      headerStyle: "gradient" as "gradient" | "solid",
    },
  };

  // Add a function to apply theme
  const applyTheme = (theme: string) => {
    setSelectedTheme(theme);
    const themeSettings = chatThemes[theme as keyof typeof chatThemes];
    setChatSettings({
      ...chatSettings,
      ...themeSettings,
    });
  };

  const handleAddFunction = (functionData: any) => {
    setFunctions([...functions, functionData]);
  };

  const handleRemoveFunction = (index: number) => {
    const updatedFunctions = functions.filter((_, i) => i !== index);
    setFunctions(updatedFunctions);
  };

  const handleIntegrationsChange = useCallback(
    (newIntegrations: Integration[]) => {
      setIntegrations(newIntegrations);
    },
    []
  );

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4 p-2 sm:p-4 md:gap-8 md:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.back()}
            type="button"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              {language === "en" ? "Create New Bot" : "Crear Nuevo Bot"}
            </h1>
            <p className="text-muted-foreground text-sm">
              {language === "en"
                ? "Set up a new chatbot for your website or WhatsApp Business."
                : "Configure un nuevo chatbot para su sitio web o WhatsApp Business."}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">
              {language === "en" ? "Total Tokens:" : "Tokens Totales:"}
            </span>
            <TokenCounter count={totalTokens} />
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">
                {language === "en" ? "Active Bots:" : "Bots Activos:"}
              </span>
              <Badge
                variant={
                  activeBots >= planLimits[userPlan as keyof typeof planLimits]
                    ? "destructive"
                    : "default"
                }
              >
                {activeBots}/{planLimits[userPlan as keyof typeof planLimits]}
              </Badge>
            </div>
            <Badge variant="outline" className="text-xs">
              {userPlan.charAt(0).toUpperCase() + userPlan.slice(1)} Plan
            </Badge>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <Card className="mb-4">
            <CardHeader>
              <CardTitle>
                {language === "en" ? "Bot Information" : "Información del Bot"}
              </CardTitle>
              <CardDescription>
                {language === "en"
                  ? "Basic information about your chatbot."
                  : "Información básica sobre su chatbot."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bot-name">
                  {language === "en" ? "Bot Name" : "Nombre del Bot"}
                </Label>
                <Input
                  id="bot-name"
                  name="bot-name"
                  placeholder={
                    language === "en"
                      ? "e.g., Support Assistant"
                      : "ej., Asistente de Soporte"
                  }
                  onChange={(e) => setBotName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="bot-description">
                    {language === "en" ? "Description" : "Descripción"}
                  </Label>
                  <TokenCounter count={descriptionTokens} />
                </div>
                <Textarea
                  id="bot-description"
                  name="bot-description"
                  placeholder={
                    language === "en"
                      ? "Describe what this bot will do..."
                      : "Describa lo que hará este bot..."
                  }
                  className="min-h-[100px]"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <PlatformSelector
                ref={platformSelectorRef}
                onIntegrationsChange={handleIntegrationsChange}
              />
              {/*<WhatsAppLinker
                currentUser={{ id: session?.binding_id || "" }}
                selectedPlatforms={["whatsapp"]}
              />*/}
            </CardContent>
          </Card>

          <Tabs defaultValue="basic" className="mb-4">
            {/* Mobile-optimized TabsList */}
            <div className="w-full overflow-hidden mb-4">
              <TabsList className="w-full h-auto p-1 grid grid-cols-2 md:grid-cols-4 gap-0.5 bg-muted rounded-lg">
                <TabsTrigger
                  value="basic"
                  className="text-xs sm:text-sm px-1 sm:px-3 py-2 rounded-md data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all"
                >
                  {language === "en" ? "Basic" : "Básico"}
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="basic" className="space-y-4 pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {language === "en"
                      ? "Basic Settings"
                      : "Configuración Básica"}
                  </CardTitle>
                  <CardDescription>
                    {language === "en"
                      ? "Configure the basic settings for your chatbot."
                      : "Configure los ajustes básicos para su chatbot."}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="welcome-message">
                        {language === "en"
                          ? "Welcome Message"
                          : "Mensaje de Bienvenida"}
                      </Label>
                      <TokenCounter count={welcomeMessageTokens} />
                    </div>
                    <Textarea
                      id="welcome-message"
                      name="welcome-message"
                      placeholder={
                        language === "en"
                          ? "Hello! How can I help you today?"
                          : "¡Hola! ¿Cómo puedo ayudarte hoy?"
                      }
                      className="min-h-[100px]"
                      value={welcomeMessage}
                      onChange={(e) => setWelcomeMessage(e.target.value)}
                    />
                  </div>
                  {botType === "whatsapp" && (
                    <div className="space-y-2">
                      <Label htmlFor="whatsapp-number">
                        {language === "en"
                          ? "WhatsApp Business Number"
                          : "Número de WhatsApp Business"}
                      </Label>
                      <Input id="whatsapp-number" placeholder="+1234567890" />
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="primary-color">
                      {language === "en" ? "Primary Color" : "Color Primario"}
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="primary-color"
                        type="color"
                        defaultValue="#4f46e5"
                        className="w-12 h-10 p-1"
                      />
                      <Input
                        id="primary-color-hex"
                        name="primary-color-hex"
                        defaultValue="#4f46e5"
                        className="flex-1"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <Button
            type="submit"
            disabled={
              isLoading ||
              activeBots >= planLimits[userPlan as keyof typeof planLimits]
            }
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {language === "en" ? "Creating Bot..." : "Creando Bot..."}
              </>
            ) : activeBots >=
              planLimits[userPlan as keyof typeof planLimits] ? (
              language === "en" ? (
                "Bot Limit Reached - Upgrade Plan"
              ) : (
                "Límite Alcanzado - Actualizar Plan"
              )
            ) : language === "en" ? (
              "Create Bot"
            ) : (
              "Crear Bot"
            )}
          </Button>
        </form>
      </div>
      <ProductModal
        open={isProductModalOpen}
        onOpenChange={setIsProductModalOpen}
        onAddProduct={handleAddProduct}
      />
      <FunctionModal
        open={isFunctionModalOpen}
        onOpenChange={setIsFunctionModalOpen}
        onAddFunction={handleAddFunction}
        language={language as "en" | "es"}
      />
    </DashboardLayout>
  );
}
