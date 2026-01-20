"use client";

import type React from "react";
import { createContext, useContext, useState, useEffect } from "react";

// Definir los idiomas disponibles
export type Language = "en" | "es";

// Definir el tipo para las traducciones
export type Translations = {
  [key: string]: {
    [key in Language]: string;
  };
};

// Crear las traducciones
export const translations: Translations = {
  // Navegación
  dashboard: {
    en: "Dashboard",
    es: "Panel Principal",
  },
  myBots: {
    en: "My Bots",
    es: "Mis Bots",
  },
  products: {
    en: "Products",
    es: "Productos",
  },
  analytics: {
    en: "Analytics",
    es: "Analítica",
  },
  settings: {
    en: "Settings",
    es: "Configuración",
  },
  helpSupport: {
    en: "Help & Support",
    es: "Ayuda y Soporte",
  },

  // Acciones comunes
  create: {
    en: "Create",
    es: "Crear",
  },
  edit: {
    en: "Edit",
    es: "Editar",
  },
  delete: {
    en: "Delete",
    es: "Eliminar",
  },
  save: {
    en: "Save",
    es: "Guardar",
  },
  cancel: {
    en: "Cancel",
    es: "Cancelar",
  },

  // Creación de bot
  createBot: {
    en: "Create Bot",
    es: "Crear Bot",
  },
  createNewBot: {
    en: "Create New Bot",
    es: "Crear Nuevo Bot",
  },
  botInformation: {
    en: "Bot Information",
    es: "Información del Bot",
  },
  botName: {
    en: "Bot Name",
    es: "Nombre del Bot",
  },
  description: {
    en: "Description",
    es: "Descripción",
  },
  botType: {
    en: "Bot Type",
    es: "Tipo de Bot",
  },
  websiteChatbot: {
    en: "Website Chatbot",
    es: "Chatbot para Sitio Web",
  },
  whatsappBot: {
    en: "WhatsApp Bot",
    es: "Bot de WhatsApp",
  },

  // Configuración básica
  basicSettings: {
    en: "Basic Settings",
    es: "Configuración Básica",
  },
  welcomeMessage: {
    en: "Welcome Message",
    es: "Mensaje de Bienvenida",
  },
  primaryColor: {
    en: "Primary Color",
    es: "Color Principal",
  },

  // FAQs
  faqs: {
    en: "FAQs",
    es: "Preguntas Frecuentes",
  },
  addFaq: {
    en: "Add FAQ",
    es: "Añadir Pregunta",
  },
  question: {
    en: "Question",
    es: "Pregunta",
  },
  answer: {
    en: "Answer",
    es: "Respuesta",
  },
  category: {
    en: "Category",
    es: "Categoría",
  },

  // Productos
  productsServices: {
    en: "Products & Services",
    es: "Productos y Servicios",
  },
  addProduct: {
    en: "Add Product",
    es: "Añadir Producto",
  },
  productName: {
    en: "Product Name",
    es: "Nombre del Producto",
  },
  price: {
    en: "Price",
    es: "Precio",
  },
  available: {
    en: "Available",
    es: "Disponible",
  },

  // Casos de uso
  useCase: {
    en: "Use Case",
    es: "Caso de Uso",
  },
  restaurant: {
    en: "Restaurant",
    es: "Restaurante",
  },
  onlineStore: {
    en: "Online Store",
    es: "Tienda Online",
  },
  customerSupport: {
    en: "Customer Support",
    es: "Soporte al Cliente",
  },
  realEstate: {
    en: "Real Estate",
    es: "Inmobiliaria",
  },
  appointments: {
    en: "Appointments",
    es: "Gestión de Citas",
  },

  // Estados
  online: {
    en: "Online",
    es: "En línea",
  },
  offline: {
    en: "Offline",
    es: "Desconectado",
  },
  maintenance: {
    en: "Maintenance",
    es: "Mantenimiento",
  },

  // Integración
  integration: {
    en: "Integration",
    es: "Integración",
  },
  websiteIntegration: {
    en: "Website Integration",
    es: "Integración en Sitio Web",
  },
  copyCode: {
    en: "Copy Code",
    es: "Copiar Código",
  },
  generateComponent: {
    en: "Generate React Component",
    es: "Generar Componente React",
  },

  // Mensajes
  saving: {
    en: "Saving...",
    es: "Guardando...",
  },
  creating: {
    en: "Creating...",
    es: "Creando...",
  },
  botCreated: {
    en: "Bot created",
    es: "Bot creado",
  },
  botUpdated: {
    en: "Changes saved",
    es: "Cambios guardados",
  },

  // Búsqueda
  search: {
    en: "Search...",
    es: "Buscar...",
  },
};

// Definir el tipo para el contexto
type LanguageContextType = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
};

// Crear el contexto
const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

// Proveedor del contexto
export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Intentar obtener el idioma guardado en localStorage, o usar 'en' por defecto
  const [language, setLanguage] = useState<Language>("en");

  // Cargar el idioma guardado cuando el componente se monta
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language;
    if (savedLanguage && (savedLanguage === "en" || savedLanguage === "es")) {
      setLanguage(savedLanguage);
    }
  }, []);

  // Guardar el idioma en localStorage cuando cambia
  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  // Función para obtener una traducción
  const t = (key: string): string => {
    if (!translations[key]) {
      console.warn(`Translation key not found: ${key}`);
      return key;
    }
    return translations[key][language];
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

// Hook personalizado para usar el contexto
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
