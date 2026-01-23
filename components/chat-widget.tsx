"use client";

import type React from "react";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
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
import {
  MessageSquare,
  X,
  Send,
  Minimize2,
  Maximize2,
  Clock,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// =============================================================================
// TYPES & INTERFACES
// =============================================================================

type Message = {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
};

/**
 * Widget authentication status states
 * - idle: Initial state, no validation attempted
 * - validating: Currently performing handshake with backend
 * - authorized: Successfully validated, sessionToken obtained
 * - blocked: Access denied (domain mismatch, expired key, etc.)
 * - error: Network or unexpected error occurred
 * - pending_approval: Client key exists but waiting for admin approval
 */
type WidgetStatus =
  | "idle"
  | "validating"
  | "approved"
  | "blocked"
  | "error"
  | "pending_approval";

/**
 * Backend validation response structure
 * The backend returns valid, assistantId, apiKeyId for approved configs
 * Also handles status for pending/blocked configs
 */
interface ValidationResponse {
  valid: boolean;
  assistantId?: string;
  apiKeyId?: string;
  userId?: string;
  error?: string;
  status?: "pending" | "waiting_approval" | "approved" | "blocked";
}

/**
 * Browser context collected automatically for security validation
 * This data is gathered client-side and sent during handshake
 */
interface BrowserContext {
  origin: string;
  hostname: string;
  pathname: string;
  userAgent: string;
  language: string;
  timezone: string;
  widgetSessionId: string;
  timestamp: number;
}

/**
 * Session data returned from backend after successful handshake
 * Now includes assistantId and userId from backend (not props)
 */
interface SessionData {
  assistantId: string;
  apiKeyId: string;
  userId?: string;
  clientKey: string;
}

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
  /** Clave única del cliente para validación - OBLIGATORIO */
  clientKey: string;
  /** URL base de la API (ej: https://api.example.com) */
  apiBaseUrl: string;
  /** Endpoint de validación (se concatena con apiBaseUrl), default: /web-configs/validate */
  validationEndpoint?: string;
  /** Endpoint para iniciar chat (se concatena con apiBaseUrl), default: /chat/start */
  chatStartEndpoint?: string;
  /** Endpoint para enviar mensajes (se concatena con apiBaseUrl), default: /chat/message */
  chatMessageEndpoint?: string;
  // Design props
  theme?: "default" | "custom";
  chatTitle?: string;
  chatSubtitle?: string;
  initialBotMessage?: string;
  inputPlaceholder?: string;
  headerStyle?: "gradient" | "solid";
  widgetPosition?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  showLogo?: boolean;
  // Custom colors (only apply if theme is "custom")
  userTextColor?: string;
  aiTextColor?: string;
  primaryColor?: string;
  botMessageBgColor?: string;
  userMessageBgColor?: string;
  floatingButtonColor?: string;
  // Callbacks
  onStatusChange?: (status: WidgetStatus) => void;
  onError?: (error: string) => void;
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Generates a unique widget session ID using crypto API
 * Falls back to timestamp + random if crypto is unavailable
 */
function generateWidgetSessionId(): string {
  if (typeof window !== "undefined" && window.crypto?.randomUUID) {
    return window.crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
}

/**
 * Collects browser context information for security validation
 * This data helps the backend verify the widget is being used from authorized domains
 */
function collectBrowserContext(widgetSessionId: string): BrowserContext {
  if (typeof window === "undefined") {
    return {
      origin: "",
      hostname: "",
      pathname: "",
      userAgent: "",
      language: "",
      timezone: "",
      widgetSessionId,
      timestamp: Date.now(),
    };
  }

  return {
    origin: window.location.origin,
    hostname: window.location.hostname,
    pathname: window.location.pathname,
    userAgent: navigator.userAgent,
    language: navigator.language,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    widgetSessionId,
    timestamp: Date.now(),
  };
}

/**
 * Maps backend status to user-friendly error messages
 */
function getStatusErrorMessage(
  status: ValidationResponse["status"] | undefined,
  error?: string,
): string {
  if (error) return error;
  switch (status) {
    case "blocked":
      return "Acceso bloqueado. Contacta al administrador.";
    case "pending":
      return "Tu clave está pendiente de activación.";
    case "waiting_approval":
      return "Tu solicitud está esperando aprobación del administrador.";
    default:
      return "Error de validación desconocido.";
  }
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function ChatWidget({
  clientKey,
  apiBaseUrl,
  validationEndpoint = "/web-configs/validate",
  chatStartEndpoint = "/chat/start",
  chatMessageEndpoint = "/chat/message",
  theme = "default",
  chatTitle = "ChatBot SaaS",
  chatSubtitle = "Asistente virtual",
  initialBotMessage = "¡Hola! Soy el asistente virtual. ¿En qué puedo ayudarte hoy?",
  inputPlaceholder = "Escribe tu mensaje...",
  headerStyle = "gradient",
  widgetPosition = "bottom-right",
  showLogo = true,
  userTextColor,
  aiTextColor,
  primaryColor,
  botMessageBgColor,
  userMessageBgColor,
  floatingButtonColor,
  onStatusChange,
  onError,
}: ChatWidgetProps) {
  // =========================================================================
  // COMPUTED API URLS
  // =========================================================================

  const validationApiUrl = `${apiBaseUrl}${validationEndpoint}`;
  const chatStartApiUrl = `${apiBaseUrl}${chatStartEndpoint}`;
  const chatApiUrl = `${apiBaseUrl}${chatMessageEndpoint}`;

  // =========================================================================
  // STATE MANAGEMENT
  // =========================================================================

  // UI State
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  // Security & Session State
  const [widgetStatus, setWidgetStatus] = useState<WidgetStatus>("idle");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [sessionData, setSessionData] = useState<SessionData | null>(null);

  // Chat State
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const widgetSessionIdRef = useRef<string | null>(null);
  const isValidatingRef = useRef(false);
  const hasInitializedRef = useRef(false);

  // =========================================================================
  // COMPUTED VALUES
  // =========================================================================

  const isAuthorized = useMemo(() => {
    return widgetStatus === "approved" && sessionData !== null;
  }, [widgetStatus, sessionData]);

  const currentThemeColors = useMemo(() => {
    if (theme === "custom") {
      return {
        headerBg:
          headerStyle === "solid" && primaryColor
            ? primaryColor
            : DEFAULT_THEME_COLORS.headerBg,
        userMessageBg: userMessageBgColor || DEFAULT_THEME_COLORS.userMessageBg,
        userMessageText: userTextColor || DEFAULT_THEME_COLORS.userMessageText,
        botMessageBg: botMessageBgColor || DEFAULT_THEME_COLORS.botMessageBg,
        botMessageText: aiTextColor || DEFAULT_THEME_COLORS.botMessageText,
        primaryButtonBg: primaryColor || DEFAULT_THEME_COLORS.primaryButtonBg,
        primaryButtonText: DEFAULT_THEME_COLORS.primaryButtonText,
        botAvatarBg: primaryColor || DEFAULT_THEME_COLORS.botAvatarBg,
        userAvatarBg: DEFAULT_THEME_COLORS.userAvatarBg,
        floatingButtonBg:
          floatingButtonColor ||
          primaryColor ||
          DEFAULT_THEME_COLORS.floatingButtonBg,
      };
    }
    return DEFAULT_THEME_COLORS;
  }, [
    theme,
    headerStyle,
    primaryColor,
    userMessageBgColor,
    userTextColor,
    botMessageBgColor,
    aiTextColor,
    floatingButtonColor,
  ]);

  // =========================================================================
  // POSITION UTILITIES
  // =========================================================================

  const getPositionClasses = useCallback(
    (position: ChatWidgetProps["widgetPosition"]) => {
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
    },
    [],
  );

  // =========================================================================
  // STATUS CHANGE EFFECT
  // =========================================================================

  useEffect(() => {
    onStatusChange?.(widgetStatus);
  }, [widgetStatus, onStatusChange]);

  // =========================================================================
  // SECURITY: AUTOMATIC HANDSHAKE ON MOUNT
  // =========================================================================

  /**
   * Performs the initial handshake with the backend AUTOMATICALLY
   *
   * Flow:
   * 1. Detect current domain automatically from window.location
   * 2. Generate unique widgetSessionId
   * 3. Send clientKey + domain info to validation endpoint
   * 4. Backend checks if clientKey exists and is approved for this domain
   * 5. If approved: returns valid: true, assistantId, apiKeyId
   * 6. If pending/blocked: returns valid: false with status
   */
  const performHandshake = useCallback(async () => {
    if (isValidatingRef.current) {
      return;
    }

    if (widgetStatus === "approved" && sessionData) {
      return;
    }

    isValidatingRef.current = true;
    setWidgetStatus("validating");
    setStatusMessage(null);

    try {
      if (!widgetSessionIdRef.current) {
        widgetSessionIdRef.current = generateWidgetSessionId();
      }

      const browserContext = collectBrowserContext(widgetSessionIdRef.current);

      // Send validation request - backend handles everything automatically
      const response = await fetch(validationApiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clientKey,
          widgetSessionId: browserContext.widgetSessionId,
          context: {
            origin: browserContext.origin,
            hostname: browserContext.hostname,
            pathname: browserContext.pathname,
            userAgent: browserContext.userAgent,
            language: browserContext.language,
            timezone: browserContext.timezone,
            timestamp: browserContext.timestamp,
          },
        }),
      });

      const data: ValidationResponse = await response.json();

      // Handle pending approval status
      if (data.status === "pending" || data.status === "waiting_approval") {
        setWidgetStatus("pending_approval");
        setStatusMessage(getStatusErrorMessage(data.status, data.error));
        return;
      }

      // Handle blocked status
      if (data.status === "blocked") {
        setWidgetStatus("blocked");
        setStatusMessage(getStatusErrorMessage(data.status, data.error));
        onError?.(getStatusErrorMessage(data.status, data.error));
        return;
      }

      // Handle non-valid responses
      if (!response.ok || !data.valid) {
        const errorMessage = getStatusErrorMessage(data.status, data.error);
        setWidgetStatus("error");
        setStatusMessage(errorMessage);
        onError?.(errorMessage);
        return;
      }

      // Validate response contains required session data
      if (!data.assistantId) {
        setWidgetStatus("error");
        setStatusMessage("Respuesta de validación incompleta.");
        onError?.("Respuesta de validación incompleta del servidor.");
        return;
      }
      console.log(data);

      // Success - store session data
      setSessionData({
        assistantId: data.assistantId,
        apiKeyId: data.apiKeyId || "",
        userId: data.userId,
        clientKey,
      });

      setWidgetStatus("approved");
      setStatusMessage(null);

      // Show initial bot message
      setMessages([
        {
          id: Date.now().toString(),
          content: initialBotMessage,
          sender: "bot",
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      setWidgetStatus("error");
      const errorMsg = "No se pudo conectar con el servidor.";
      setStatusMessage(errorMsg);
      onError?.(errorMsg);
    } finally {
      isValidatingRef.current = false;
    }
  }, [
    clientKey,
    validationApiUrl,
    widgetStatus,
    sessionData,
    initialBotMessage,
    onError,
  ]);

  // =========================================================================
  // AUTO-INITIALIZE ON COMPONENT MOUNT
  // =========================================================================

  useEffect(() => {
    // Only run once on mount, automatically validate
    if (!hasInitializedRef.current && clientKey && apiBaseUrl) {
      hasInitializedRef.current = true;
      performHandshake();
    }
  }, [clientKey, apiBaseUrl, performHandshake]);

  // =========================================================================
  // SECURE API HELPERS
  // =========================================================================

  const getAuthenticatedHeaders = useCallback((): HeadersInit => {
    if (!sessionData?.clientKey) {
      throw new Error("No client key available");
    }

    return {
      "Content-Type": "application/json",
      "X-Client-Key": sessionData.clientKey,
    };
  }, [sessionData]);

  const ensureValidSession = useCallback(async (): Promise<boolean> => {
    if (!sessionData) {
      setWidgetStatus("idle");
      setSessionData(null);
      await performHandshake();
      return widgetStatus === "approved";
    }
    return true;
  }, [sessionData, performHandshake, widgetStatus]);

  // =========================================================================
  // EFFECTS
  // =========================================================================

  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, isMinimized]);

  // =========================================================================
  // MESSAGE HANDLERS
  // =========================================================================

  const handleSendMessage = useCallback(
    async (e?: React.FormEvent) => {
      if (e) e.preventDefault();
      if (!input.trim() || !isAuthorized) return;

      const sessionValid = await ensureValidSession();
      if (!sessionValid) {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString() + "-session-error",
            content: "Tu sesión ha expirado. Por favor, recarga el widget.",
            sender: "bot",
            timestamp: new Date(),
          },
        ]);
        return;
      }

      setIsTyping(true);
      const userInput = input.trim();

      if (!currentChatId) {
        try {
          const chatStartResponse = await fetch(chatStartApiUrl, {
            method: "POST",
            headers: getAuthenticatedHeaders(),
            body: JSON.stringify({
              userId: sessionData?.userId,
              assistant_id: sessionData?.assistantId,
              promt: userInput,
            }),
          });

          const chatStartData = await chatStartResponse.json();

          if (!chatStartResponse.ok || !chatStartData.chat_id) {
            setMessages([
              {
                id: "error-start",
                content: `No se pudo iniciar el chat: ${chatStartData.error || "Error desconocido."}`,
                sender: "bot",
                timestamp: new Date(),
              },
            ]);
            setIsTyping(false);
            return;
          }

          setCurrentChatId(chatStartData.chat_id);
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now().toString(),
              content: userInput,
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
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now().toString() + "-network-error",
              content:
                "Hubo un problema de conexión. Por favor, inténtalo de nuevo.",
              sender: "bot",
              timestamp: new Date(),
            },
          ]);
        } finally {
          setIsTyping(false);
        }
        return;
      }

      const userMessage: Message = {
        id: Date.now().toString(),
        content: userInput,
        sender: "user",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setInput("");

      try {
        const response = await fetch(chatApiUrl, {
          method: "POST",
          headers: getAuthenticatedHeaders(),
          body: JSON.stringify({
            chatId: currentChatId,
            assistant_id: sessionData?.assistantId,
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
          if (response.status === 401) {
            setWidgetStatus("idle");
            setSessionData(null);
            setStatusMessage("Sesión expirada. Reconectando...");
            performHandshake();
          }

          const errorMessage: Message = {
            id: Date.now().toString() + "-error",
            content: `Lo siento, no pude obtener una respuesta: ${data.message || "Error desconocido."}`,
            sender: "bot",
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, errorMessage]);
        }
      } catch {
        const networkError: Message = {
          id: Date.now().toString() + "-network-error",
          content:
            "Hubo un problema de conexión. Por favor, inténtalo de nuevo.",
          sender: "bot",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, networkError]);
      } finally {
        setIsTyping(false);
      }
    },
    [
      input,
      isAuthorized,
      currentChatId,
      chatStartApiUrl,
      chatApiUrl,
      getAuthenticatedHeaders,
      ensureValidSession,
      performHandshake,
      sessionData,
    ],
  );

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    },
    [handleSendMessage],
  );

  // =========================================================================
  // UI HANDLERS
  // =========================================================================

  const toggleMinimize = useCallback(() => {
    setIsMinimized((prev) => !prev);
  }, []);

  const handleCloseChat = useCallback(() => {
    setIsOpen(false);
    setIsMinimized(false);
  }, []);

  const handleRetryValidation = useCallback(() => {
    setWidgetStatus("idle");
    setSessionData(null);
    setStatusMessage(null);
    hasInitializedRef.current = false;
    performHandshake();
  }, [performHandshake]);

  // =========================================================================
  // RENDER HELPERS
  // =========================================================================

  const renderChatContent = () => {
    // Validating state
    if (widgetStatus === "validating") {
      return (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="flex space-x-1 mb-4">
            <div
              className="w-3 h-3 rounded-full bg-purple-500 animate-bounce"
              style={{ animationDelay: "0ms" }}
            />
            <div
              className="w-3 h-3 rounded-full bg-purple-500 animate-bounce"
              style={{ animationDelay: "150ms" }}
            />
            <div
              className="w-3 h-3 rounded-full bg-purple-500 animate-bounce"
              style={{ animationDelay: "300ms" }}
            />
          </div>
          <p className="text-sm text-muted-foreground">Verificando acceso...</p>
        </div>
      );
    }

    // Pending approval state
    if (widgetStatus === "pending_approval") {
      return (
        <div className="flex flex-col items-center justify-center py-8 text-center px-4">
          <div className="bg-amber-100 dark:bg-amber-900/30 rounded-full p-4 mb-4">
            <Clock className="h-8 w-8 text-amber-600 dark:text-amber-400" />
          </div>
          <h3 className="font-semibold text-foreground mb-2">
            Solicitud Pendiente
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            {statusMessage ||
              "Tu solicitud de acceso ha sido enviada automáticamente. Esperando aprobación del administrador."}
          </p>
          <div className="bg-muted/50 rounded-lg p-3 w-full max-w-xs">
            <p className="text-xs text-muted-foreground">
              <span className="font-medium">Dominio:</span>{" "}
              {typeof window !== "undefined" ? window.location.hostname : "N/A"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="font-medium">Client Key:</span>{" "}
              {clientKey.substring(0, 12)}...
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRetryValidation}
            className="mt-4 bg-transparent"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Verificar estado
          </Button>
        </div>
      );
    }

    // Blocked or Error state
    if (widgetStatus === "blocked" || widgetStatus === "error") {
      return (
        <div className="flex flex-col items-center justify-center py-8 text-center px-4">
          <div className="bg-red-100 dark:bg-red-900/30 rounded-full p-4 mb-4">
            <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
          <h3 className="font-semibold text-foreground mb-2">
            {widgetStatus === "blocked"
              ? "Acceso Denegado"
              : "Error de Conexión"}
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            {statusMessage || "No se pudo conectar con el servidor."}
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRetryValidation}
            className="bg-transparent"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Reintentar
          </Button>
        </div>
      );
    }

    // Authorized but no messages yet
    if (messages.length === 0 && isAuthorized) {
      return (
        <div className="text-center text-muted-foreground py-4">
          Escribe un mensaje para empezar...
        </div>
      );
    }

    // Render messages
    return (
      <>
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "mb-4 flex",
              message.sender === "user" ? "justify-end" : "justify-start",
            )}
          >
            {message.sender === "bot" && (
              <div className="mr-2 flex-shrink-0">
                <div
                  className={cn(
                    "rounded-full h-8 w-8 flex items-center justify-center",
                    currentThemeColors.botAvatarBg,
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
                      currentThemeColors.userMessageText,
                    )
                  : cn(
                      currentThemeColors.botMessageBg,
                      currentThemeColors.botMessageText,
                    ),
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
                    currentThemeColors.userAvatarBg,
                  )}
                >
                  <span className="text-xs font-medium text-foreground">
                    Tú
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start mb-4">
            <div className="mr-2 flex-shrink-0">
              <div
                className={cn(
                  "rounded-full h-8 w-8 flex items-center justify-center",
                  currentThemeColors.botAvatarBg,
                )}
              >
                <MessageSquare className="h-4 w-4 text-white" />
              </div>
            </div>
            <div
              className={cn(
                "p-3 rounded-lg shadow-sm",
                currentThemeColors.botMessageBg,
                currentThemeColors.botMessageText,
              )}
            >
              <div className="flex space-x-1">
                <div
                  className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                  style={{ animationDelay: "0ms" }}
                />
                <div
                  className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                  style={{ animationDelay: "150ms" }}
                />
                <div
                  className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                  style={{ animationDelay: "300ms" }}
                />
              </div>
            </div>
          </div>
        )}
      </>
    );
  };

  // =========================================================================
  // MAIN RENDER
  // =========================================================================

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
            getPositionClasses(widgetPosition),
          )}
        >
          <Card
            className={cn(
              "shadow-lg rounded-lg overflow-hidden flex flex-col transition-all duration-300",
              isMinimized
                ? "h-auto max-h-[80px]"
                : "h-[calc(100vh-80px)] max-h-[600px]",
            )}
          >
            {/* Chat Header */}
            <CardHeader
              className={cn(
                "flex flex-row items-center justify-between p-4 text-white",
                currentThemeColors.headerBg,
                isMinimized ? "rounded-b-lg" : "",
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
                  className="text-white hover:bg-white/20 bg-transparent"
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
                  className="text-white hover:bg-white/20 bg-transparent"
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
                  <CardContent className="flex-grow p-4 overflow-hidden bg-background">
                    <ScrollArea className="h-full pr-4">
                      {renderChatContent()}
                      <div ref={messagesEndRef} />
                    </ScrollArea>
                  </CardContent>

                  {/* Chat Input - only show when authorized */}
                  {isAuthorized && (
                    <CardFooter className="p-4 border-t border-border bg-background">
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
                          disabled={isTyping}
                          aria-label="Escribe tu mensaje"
                        />
                        <Button
                          type="submit"
                          size="icon"
                          disabled={isTyping || !input.trim()}
                          className={cn(
                            currentThemeColors.primaryButtonBg,
                            currentThemeColors.primaryButtonText,
                          )}
                          aria-label="Enviar mensaje"
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      </form>
                    </CardFooter>
                  )}
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
            getPositionClasses(widgetPosition),
          )}
          aria-label="Abrir chat"
        >
          <MessageSquare className="h-6 w-6 text-white" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
