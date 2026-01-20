"use client";

import type React from "react";
import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, X, Send, Minimize2, Maximize2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils"; // Ensure this import is present

type Message = {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
};

// Default theme colors
const DEFAULT_THEME_COLORS = {
  headerBg: "bg-gradient-to-r from-purple-600 to-fuchsia-500",
  userMessageBg: "bg-purple-500",
  userMessageText: "text-white",
  botMessageBg: "bg-gray-200 dark:bg-gray-800",
  botMessageText: "text-gray-800 dark:text-white",
  primaryButtonBg: "bg-purple-600 hover:bg-purple-700",
  primaryButtonText: "text-white",
  botAvatarBg: "bg-purple-600",
  userAvatarBg: "bg-gray-300 dark:bg-gray-700",
  floatingButtonBg: "bg-purple-600",
};

interface ChatWidgetProps {
  clientKey: string; // Clave única del cliente para validación
  validationApiUrl: string; // URL del endpoint de validación del backend (e.g., /api/validate-sdk)
  chatApiUrl: string; // URL del endpoint de chat real para enviar mensajes (e.g., /api/chat/message)
  chatStartApiUrl: string; // URL del endpoint para iniciar un chat (e.g., /api/chat/start)
  assistantId: string; // ID del asistente para la conversación
  userId: string; // ID del usuario para la conversación
  // New design props
  theme?: "default" | "custom"; // "Predeterminado (Morado)" maps to "default"
  chatTitle?: string;
  chatSubtitle?: string;
  initialBotMessage?: string;
  inputPlaceholder?: string;
  headerStyle?: "gradient" | "solid"; // "Degradado" maps to "gradient"
  widgetPosition?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  showLogo?: boolean;
  // Custom colors (only apply if theme is "custom")
  userTextColor?: string; // Tailwind class, e.g., "text-white"
  aiTextColor?: string; // Tailwind class, e.g., "text-gray-800"
  primaryColor?: string; // Tailwind class for buttons/accents, e.g., "bg-purple-600"
  botMessageBgColor?: string; // Tailwind class, e.g., "bg-gray-200"
  userMessageBgColor?: string; // Tailwind class, e.g., "bg-purple-500"
  floatingButtonColor?: string; // Tailwind class for floating button background
}

export function ChatWidget({
  clientKey,
  validationApiUrl,
  chatApiUrl,
  chatStartApiUrl, // New prop for chat start API
  assistantId,
  userId,
  // New design props with defaults
  theme = "default",
  chatTitle = "ChatBot SaaS",
  chatSubtitle = "Asistente virtual",
  initialBotMessage = "¡Hola! Soy el asistente virtual de ChatBot SaaS. ¿En qué puedo ayudarte hoy?",
  inputPlaceholder = "Escribe tu mensaje...",
  headerStyle = "gradient",
  widgetPosition = "bottom-right",
  showLogo = true,
  // Custom colors
  userTextColor,
  aiTextColor,
  primaryColor,
  botMessageBgColor,
  userMessageBgColor,
  floatingButtonColor,
}: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false); // Internal state for widget open/close
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isValidated, setIsValidated] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [validationAttempted, setValidationAttempted] = useState(false);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null); // State to store the current chat ID

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Determine effective theme colors
  const currentThemeColors =
    theme === "custom"
      ? {
          headerBg:
            headerStyle === "solid" && primaryColor
              ? primaryColor
              : DEFAULT_THEME_COLORS.headerBg,
          userMessageBg:
            userMessageBgColor || DEFAULT_THEME_COLORS.userMessageBg,
          userMessageText:
            userTextColor || DEFAULT_THEME_COLORS.userMessageText,
          botMessageBg: botMessageBgColor || DEFAULT_THEME_COLORS.botMessageBg,
          botMessageText: aiTextColor || DEFAULT_THEME_COLORS.aiTextColor,
          primaryButtonBg: primaryColor || DEFAULT_THEME_COLORS.primaryButtonBg,
          primaryButtonText: DEFAULT_THEME_COLORS.primaryButtonText,
          botAvatarBg: primaryColor || DEFAULT_THEME_COLORS.botAvatarBg,
          userAvatarBg: DEFAULT_THEME_COLORS.userAvatarBg,
          floatingButtonBg:
            floatingButtonColor ||
            primaryColor ||
            DEFAULT_THEME_COLORS.floatingButtonBg,
        }
      : DEFAULT_THEME_COLORS;

  // Get position classes
  const getPositionClasses = (position: ChatWidgetProps["widgetPosition"]) => {
    switch (position) {
      case "bottom-left":
        return "bottom-6 left-6";
      case "top-right":
        return "top-6 right-6";
      case "top-left":
        return "top-6 left-6";
      case "bottom-right":
      default:
        return "bottom-6 right-6";
    }
  };

  // Validation and Chat Start Logic
  const validateAndStartChat = useCallback(async () => {
    if (isValidated) return; // Solo valida, no crea chat
    setValidationAttempted(true);
    setValidationError(null);

    try {
      const validationResponse = await fetch(validationApiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ clientKey }),
      });

      const validationData = await validationResponse.json();

      if (!validationResponse.ok || !validationData.success) {
        setIsValidated(false);
        setValidationError(
          validationData.message || "Error de validación desconocido."
        );
        console.error("Error de validación del SDK:", validationData.message);
        return;
      }

      setIsValidated(true);
      setValidationError(null);
      console.log("SDK Validado correctamente.");
      setMessages([
        {
          id: Date.now().toString(),
          content: initialBotMessage,
          sender: "bot",
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      setIsValidated(false);
      setValidationError("No se pudo conectar con el servidor.");
      console.error("Error al validar el SDK:", error);
    }
  }, [clientKey, validationApiUrl, isValidated]);

  // Trigger validation and chat start when the chat opens
  useEffect(() => {
    if (isOpen) {
      validateAndStartChat();
    }
  }, [isOpen, validateAndStartChat]);

  // Auto-scroll to the latest message
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, isMinimized]); // Re-scroll when messages change or when minimized state changes

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || !isValidated) return;

    setIsTyping(true);

    // Si no hay chat aún, lo crea aquí
    if (!currentChatId) {
      try {
        const chatStartResponse = await fetch(chatStartApiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            assistant_id: assistantId,
            promt: input.trim(), // usar primer mensaje como prompt
          }),
        });

        const chatStartData = await chatStartResponse.json();
        console.log(chatStartData);

        if (!chatStartResponse.ok || !chatStartData.chat_id) {
          console.error("Error al iniciar el chat:", chatStartData.error);
          setMessages([
            {
              id: "error-start",
              content: `No se pudo iniciar el chat: ${
                chatStartData.error || "Error desconocido."
              }`,
              sender: "bot",
              timestamp: new Date(),
            },
          ]);
          setIsTyping(false);
          return;
        }

        setCurrentChatId(chatStartData.chat_id);
        setMessages([
          {
            id: Date.now().toString(),
            content: input,
            sender: "user",
            timestamp: new Date(),
          },
          {
            id: Date.now().toString() + "-bot",
            content: chatStartData.response || "El asistente no respondió.",
            sender: "bot",
            timestamp: new Date(),
          },
        ]);
        setInput("");
      } catch (err) {
        console.error("Error iniciando chat:", err);
        setIsTyping(false);
        return;
      }
    } else {
      // Ya existe chatId, simplemente envía el mensaje como antes
      const userMessage: Message = {
        id: Date.now().toString(),
        content: input,
        sender: "user",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setInput("");

      try {
        const response = await fetch(chatApiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chatId: currentChatId,
            assistant_id: assistantId,
            role: "user",
            content: userMessage.content,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          const botMessage: Message = {
            id: Date.now().toString() + "-bot",
            content: data.response,
            sender: "bot",
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, botMessage]);
        } else {
          const errorMessage: Message = {
            id: Date.now().toString() + "-error",
            content: `Lo siento, no pude obtener una respuesta: ${
              data.message || "Error desconocido."
            }`,
            sender: "bot",
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, errorMessage]);
        }
      } catch (error) {
        const networkError: Message = {
          id: Date.now().toString() + "-network-error",
          content:
            "Hubo un problema de conexión. Por favor, inténtalo de nuevo.",
          sender: "bot",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, networkError]);
      }
    }

    setIsTyping(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const handleCloseChat = () => {
    setIsOpen(false);
    setIsMinimized(false); // Reset minimize state when closing
    setMessages([]); // Clear messages
    setCurrentChatId(null); // Clear chat ID
    setIsValidated(false); // Reset validation state
    setValidationAttempted(false); // Allow re-validation on next open
    setValidationError(null);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className={cn(
            "fixed z-50 w-full max-w-sm md:max-w-md lg:max-w-lg",
            getPositionClasses(widgetPosition)
          )}
        >
          <Card
            className={cn(
              "shadow-lg rounded-lg overflow-hidden flex flex-col transition-all duration-300",
              isMinimized
                ? "h-auto max-h-[80px]"
                : "h-[calc(100vh-80px)] max-h-[600px]"
            )}
          >
            {/* Chat Header */}
            <CardHeader
              className={cn(
                "flex flex-row items-center justify-between p-4 text-white",
                currentThemeColors.headerBg,
                isMinimized ? "rounded-b-lg" : "" // Rounded bottom if minimized
              )}
            >
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                {showLogo && (
                  <div className="bg-white/20 rounded-full p-2 mr-1">
                    <MessageSquare className="h-5 w-5 text-white" />
                  </div>
                )}
                <div>
                  <h3 className="font-medium text-white">{chatTitle}</h3>
                  <p className="text-xs text-gray-200">{chatSubtitle}</p>
                </div>
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleMinimize}
                  className="text-white hover:bg-white/20"
                  aria-label={isMinimized ? "Maximizar chat" : "Minimizar chat"}
                >
                  {isMinimized ? (
                    <Maximize2 className="h-5 w-5" />
                  ) : (
                    <Minimize2 className="h-5 w-5" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCloseChat}
                  className="text-white hover:bg-white/20"
                  aria-label="Cerrar chat"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </CardHeader>
            {/* Chat Messages */}
            <AnimatePresence mode="wait">
              {!isMinimized && (
                <motion.div
                  key="chat-body"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col flex-grow overflow-hidden"
                >
                  <CardContent className="flex-grow p-4 overflow-hidden bg-gray-50 dark:bg-gray-950">
                    <ScrollArea className="h-full pr-4">
                      {validationAttempted && !isValidated ? (
                        <div className="text-center text-red-500 py-4">
                          <p className="font-bold">Error de Carga del Chat</p>
                          <p className="text-sm">
                            {validationError || "Dominio no autorizado."}
                          </p>
                          <p className="text-sm mt-2">
                            Por favor, contacta al soporte para más información.
                          </p>
                        </div>
                      ) : messages.length === 0 && isValidated ? (
                        <div className="text-center text-gray-500 py-4">
                          Escribe un mensaje para empezar...
                        </div>
                      ) : (
                        messages.map((message) => (
                          <div
                            key={message.id}
                            className={cn(
                              "mb-4 flex",
                              message.sender === "user"
                                ? "justify-end"
                                : "justify-start"
                            )}
                          >
                            {message.sender === "bot" && (
                              <div className="mr-2 flex-shrink-0">
                                <div
                                  className={cn(
                                    "rounded-full h-8 w-8 flex items-center justify-center",
                                    currentThemeColors.botAvatarBg
                                  )}
                                >
                                  <MessageSquare className="h-4 w-4 text-white" />
                                </div>
                              </div>
                            )}
                            <div
                              className={cn(
                                "p-3 rounded-lg max-w-[75%] shadow-sm",
                                message.sender === "user"
                                  ? cn(
                                      currentThemeColors.userMessageBg,
                                      currentThemeColors.userMessageText
                                    )
                                  : cn(
                                      currentThemeColors.botMessageBg,
                                      currentThemeColors.botMessageText
                                    )
                              )}
                            >
                              <p className="text-sm">{message.content}</p>
                              <p className="text-xs mt-1 opacity-60">
                                {message.timestamp.toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </p>
                            </div>
                            {message.sender === "user" && (
                              <div className="ml-2 flex-shrink-0">
                                <div
                                  className={cn(
                                    "rounded-full h-8 w-8 flex items-center justify-center",
                                    currentThemeColors.userAvatarBg
                                  )}
                                >
                                  <span className="text-xs font-medium text-gray-800 dark:text-white">
                                    Tú
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                        ))
                      )}
                      {isTyping && (
                        <div className="flex justify-start mb-4">
                          <div className="mr-2 flex-shrink-0">
                            <div
                              className={cn(
                                "rounded-full h-8 w-8 flex items-center justify-center",
                                currentThemeColors.botAvatarBg
                              )}
                            >
                              <MessageSquare className="h-4 w-4 text-white" />
                            </div>
                          </div>
                          <div
                            className={cn(
                              "p-3 rounded-lg shadow-sm",
                              currentThemeColors.botMessageBg,
                              currentThemeColors.botMessageText
                            )}
                          >
                            <div className="flex space-x-1">
                              <div
                                className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                                style={{ animationDelay: "0ms" }}
                              ></div>
                              <div
                                className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                                style={{ animationDelay: "150ms" }}
                              ></div>
                              <div
                                className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                                style={{ animationDelay: "300ms" }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </ScrollArea>
                  </CardContent>
                  {/* Chat Input */}
                  <CardFooter className="p-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
                    <form
                      onSubmit={handleSendMessage}
                      className="flex w-full items-center space-x-2"
                    >
                      <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyPress}
                        placeholder={inputPlaceholder}
                        className="flex-grow"
                        disabled={isTyping || !isValidated}
                        aria-label="Escribe tu mensaje"
                      />
                      <Button
                        type="submit"
                        size="icon"
                        disabled={isTyping || !input.trim() || !isValidated}
                        className={cn(
                          currentThemeColors.primaryButtonBg,
                          currentThemeColors.primaryButtonText
                        )}
                        aria-label="Enviar mensaje"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </form>
                  </CardFooter>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </motion.div>
      )}
      {/* Floating Chat Button */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(true)}
          className={cn(
            "fixed rounded-full p-4 shadow-lg z-50",
            currentThemeColors.floatingButtonBg,
            getPositionClasses(widgetPosition)
          )}
          aria-label="Abrir chat"
        >
          <MessageSquare className="h-6 w-6 text-white" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
