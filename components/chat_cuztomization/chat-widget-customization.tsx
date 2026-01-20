"use client";

import { useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ChatWidgetPreview } from "@/components/chat-widget-preview";
import { MuiColorInput } from "mui-color-input";

type ChatSettings = {
  title: string;
  subtitle: string;
  primaryColor: string;
  buttonColor: string;
  bubbleColor: string;
  userBubbleColor: string;
  headerStyle: "gradient" | "solid";
  showLogo: boolean;
  position: "right" | "left";
  initialMessage: string;
  placeholderText: string;
  userTextColor?: string;
  botTextColor?: string;
};

interface ChatWidgetCustomizationProps {
  language: "en" | "es";
  chatSettings: ChatSettings;
  onSettingsChange: (settings: ChatSettings) => void;
}

export function ChatWidgetCustomization({
  language,
  chatSettings,
  onSettingsChange,
}: ChatWidgetCustomizationProps) {
  const [selectedTheme, setSelectedTheme] = useState("default");
  const [customThemeName, setCustomThemeName] = useState("");

  const chatThemes: Record<string, ChatSettings> = {
    default: {
      title: "ChatBot Support",
      subtitle: "Virtual Assistant",
      primaryColor: "#4f46e5",
      buttonColor: "#4f46e5",
      bubbleColor: "#f9fafb",
      userBubbleColor: "#000000",
      userTextColor: "#ffffff",
      botTextColor: "#000000",
      headerStyle: "gradient",
      showLogo: true,
      position: "right",
      initialMessage: "Hello! How can I help you today?",
      placeholderText: "Type your message...",
    },
    dark: {
      title: "Support Chat",
      subtitle: "AI Assistant",
      primaryColor: "#1f2937",
      buttonColor: "#1f2937",
      bubbleColor: "#374151",
      userBubbleColor: "#111827",
      userTextColor: "rgb(255, 255, 255)",
      botTextColor: "rgb(255, 255, 255)",
      headerStyle: "solid",
      showLogo: true,
      position: "right",
      initialMessage: "Hi! Need any assistance?",
      placeholderText: "Ask me anything...",
    },
    light: {
      title: "Help Center",
      subtitle: "Chat Support",
      primaryColor: "#60a5fa",
      buttonColor: "#3b82f6",
      bubbleColor: "#f3f4f6",
      userBubbleColor: "#dbeafe",
      userTextColor: "#000000",
      botTextColor: "#000000",
      headerStyle: "gradient",
      showLogo: true,
      position: "right",
      initialMessage: "Welcome! How can I assist you?",
      placeholderText: "Write a message...",
    },
    green: {
      title: "Customer Support",
      subtitle: "We're here to help",
      primaryColor: "#10b981",
      buttonColor: "#059669",
      bubbleColor: "#ecfdf5",
      userBubbleColor: "#d1fae5",
      userTextColor: "#064e3b",
      botTextColor: "#065f46",
      headerStyle: "gradient",
      showLogo: true,
      position: "right",
      initialMessage: "Hey there! How can we help?",
      placeholderText: "Start chatting...",
    },
    orange: {
      title: "Chat with us",
      subtitle: "Quick Support",
      primaryColor: "#f97316",
      buttonColor: "#ea580c",
      bubbleColor: "#fff7ed",
      userBubbleColor: "#ffedd5",
      userTextColor: "#7c2d12",
      botTextColor: "#9a3412",
      headerStyle: "gradient",
      showLogo: true,
      position: "right",
      initialMessage: "Need help? We’re here!",
      placeholderText: "Send a message...",
    },
  };

  const applyTheme = (theme: string) => {
    setSelectedTheme(theme);
    if (theme !== "custom") {
      const themeSettings = chatThemes[theme as keyof typeof chatThemes];
      onSettingsChange({
        ...chatSettings,
        ...themeSettings,
      });
      setCustomThemeName(""); // Limpiar nombre personalizado cuando se selecciona tema predefinido
    }
  };

  const handleCustomSettingChange = (field: string, value: any) => {
    // Si el usuario está modificando configuraciones y no está en modo custom, cambiar a custom
    if (selectedTheme !== "custom") {
      setSelectedTheme("custom");
    }
    onSettingsChange({
      ...chatSettings,
      [field]: value,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {language === "en"
            ? "Chat Widget Customization"
            : "Personalización del Widget de Chat"}
        </CardTitle>
        <CardDescription>
          {language === "en"
            ? "Customize the appearance of your chat widget for your website."
            : "Personaliza la apariencia del widget de chat para tu sitio web."}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="theme-selector">
                {language === "en" ? "Select Theme" : "Seleccionar Tema"}
              </Label>
              <Select value={selectedTheme} onValueChange={applyTheme}>
                <SelectTrigger id="theme-selector">
                  <SelectValue
                    placeholder={
                      language === "en"
                        ? "Select a theme"
                        : "Seleccionar un tema"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">
                    {language === "en"
                      ? "Default (Purple)"
                      : "Predeterminado (Morado)"}
                  </SelectItem>
                  <SelectItem value="dark">
                    {language === "en" ? "Dark" : "Oscuro"}
                  </SelectItem>
                  <SelectItem value="light">
                    {language === "en" ? "Light (Blue)" : "Claro (Azul)"}
                  </SelectItem>
                  <SelectItem value="green">
                    {language === "en" ? "Green" : "Verde"}
                  </SelectItem>
                  <SelectItem value="orange">
                    {language === "en" ? "Orange" : "Naranja"}
                  </SelectItem>
                  <SelectItem value="custom">
                    {language === "en" ? "Custom" : "Personalizado"}
                    {customThemeName && ` (${customThemeName})`}
                  </SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                {language === "en"
                  ? "Choose a predefined theme or customize below"
                  : "Elige un tema predefinido o personaliza a continuación"}
              </p>
            </div>

            {selectedTheme === "custom" && (
              <div className="space-y-2">
                <Label htmlFor="custom-theme-name">
                  {language === "en"
                    ? "Custom Theme Name"
                    : "Nombre del Tema Personalizado"}
                </Label>
                <Input
                  id="custom-theme-name"
                  value={customThemeName}
                  onChange={(e) => setCustomThemeName(e.target.value)}
                  placeholder={
                    language === "en"
                      ? "Enter your theme name..."
                      : "Ingresa el nombre de tu tema..."
                  }
                />
                <p className="text-xs text-muted-foreground">
                  {language === "en"
                    ? "Give your custom theme a unique name"
                    : "Dale a tu tema personalizado un nombre único"}
                </p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="chat-title">
                {language === "en" ? "Chat Title" : "Título del Chat"}
              </Label>
              <Input
                id="chat-title"
                value={chatSettings.title}
                onChange={(e) =>
                  handleCustomSettingChange("title", e.target.value)
                }
                placeholder="Support Chat"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="chat-subtitle">
                {language === "en" ? "Chat Subtitle" : "Subtítulo del Chat"}
              </Label>
              <Input
                id="chat-subtitle"
                value={chatSettings.subtitle}
                onChange={(e) =>
                  handleCustomSettingChange("subtitle", e.target.value)
                }
                placeholder="Virtual Assistant"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="initial-message">
                {language === "en" ? "Initial Message" : "Mensaje Inicial"}
              </Label>
              <Textarea
                id="initial-message"
                value={chatSettings.initialMessage}
                onChange={(e) =>
                  handleCustomSettingChange("initialMessage", e.target.value)
                }
                placeholder="Hello! How can I help you today?"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="placeholder-text">
                {language === "en"
                  ? "Input Placeholder"
                  : "Placeholder del Input"}
              </Label>
              <Input
                id="placeholder-text"
                value={chatSettings.placeholderText}
                onChange={(e) =>
                  handleCustomSettingChange("placeholderText", e.target.value)
                }
                placeholder="Type your message..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="header-style">
                {language === "en" ? "Header Style" : "Estilo del Encabezado"}
              </Label>
              <Select
                value={chatSettings.headerStyle}
                onValueChange={(value) =>
                  handleCustomSettingChange("headerStyle", value)
                }
              >
                <SelectTrigger id="header-style">
                  <SelectValue placeholder="Select style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gradient">
                    {language === "en" ? "Gradient" : "Degradado"}
                  </SelectItem>
                  <SelectItem value="solid">
                    {language === "en" ? "Solid Color" : "Color Sólido"}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="position">
                {language === "en" ? "Widget Position" : "Posición del Widget"}
              </Label>
              <Select
                value={chatSettings.position}
                onValueChange={(value) =>
                  handleCustomSettingChange("position", value)
                }
              >
                <SelectTrigger id="position">
                  <SelectValue placeholder="Select position" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="right">
                    {language === "en" ? "Bottom Right" : "Abajo a la Derecha"}
                  </SelectItem>
                  <SelectItem value="left">
                    {language === "en" ? "Bottom Left" : "Abajo a la Izquierda"}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="show-logo"
                checked={chatSettings.showLogo}
                onCheckedChange={(checked) =>
                  handleCustomSettingChange("showLogo", checked)
                }
              />
              <Label htmlFor="show-logo">
                {language === "en" ? "Show Logo" : "Mostrar Logo"}
              </Label>
            </div>
            <div className="flex justify-between">
              <div className="space-y-2">
                <Label htmlFor="user-text-color-chat">
                  {language === "en"
                    ? "User Text Color"
                    : "Color del Texto del Usuario"}
                </Label>
                <div className="flex gap-2">
                  <MuiColorInput
                    id="user-text-color-chat"
                    value={chatSettings.userTextColor ?? ""}
                    onChange={(color) =>
                      handleCustomSettingChange("userTextColor", color)
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="aiden-text-color-chat">
                  {language === "en"
                    ? "AIDEN Text Color"
                    : "Color del Texto de AIDEN"}
                </Label>
                <div className="flex gap-2">
                  <MuiColorInput
                    id="aiden-text-color-chat"
                    value={chatSettings.botTextColor ?? ""}
                    onChange={(color) =>
                      handleCustomSettingChange("botTextColor", color)
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="primary-color-chat">
                {language === "en" ? "Primary Color" : "Color Primario"}
              </Label>
              <div className="flex gap-2">
                <MuiColorInput
                  id="primary-color-chat"
                  value={chatSettings.primaryColor}
                  onChange={(color) =>
                    handleCustomSettingChange("primaryColor", color)
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="button-color-chat">
                {language === "en" ? "Button Color" : "Color del Botón"}
              </Label>
              <div className="flex gap-2">
                <MuiColorInput
                  id="button-color-chat"
                  value={chatSettings.buttonColor}
                  onChange={(color) =>
                    handleCustomSettingChange("buttonColor", color)
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bubble-color-chat">
                {language === "en"
                  ? "Bot Message Color"
                  : "Color de Mensajes del Bot"}
              </Label>
              <div className="flex gap-2">
                <MuiColorInput
                  id="bubble-color-chat"
                  value={chatSettings.bubbleColor}
                  onChange={(color) =>
                    handleCustomSettingChange("bubbleColor", color)
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="user-bubble-color-chat">
                {language === "en"
                  ? "User Message Color"
                  : "Color de Mensajes del Usuario"}
              </Label>
              <div className="flex gap-2">
                <MuiColorInput
                  id="user-bubble-color-chat"
                  value={chatSettings.userBubbleColor}
                  onChange={(color) =>
                    handleCustomSettingChange("userBubbleColor", color)
                  }
                />
              </div>
            </div>

            <div className="mt-4 border rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
              <p className="text-sm font-medium mb-2">
                {language === "en" ? "Preview" : "Vista previa"}
              </p>
              <ChatWidgetPreview settings={chatSettings} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
