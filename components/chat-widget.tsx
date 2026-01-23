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
import { MessageSquare, X, Send, Minimize2, Maximize2 } from "lucide-react";
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
 */
type WidgetStatus = "idle" | "validating" | "authorized" | "blocked" | "error";

/**
 * Browser context collected automatically for security validation
 * This data is gathered client-side and sent during handshake
 */
interface BrowserContext {
  origin: string;
  hostname: string;
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
  sessionToken: string;
  expiresAt: number;
  status: "active" | "blocked" | "domain_mismatch" | "expired";
  assistantId: string;
  userId: string;
}

/**
 * Backend validation response structure
 * The backend returns assistantId and user_id along with session token
 */
interface ValidationResponse {
  success: boolean;
  sessionToken?: string;
  expiresAt?: number;
  status?: "active" | "blocked" | "domain_mismatch" | "expired";
  assistantId?: string;
  user_id?: string;
  message?: string;
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
  clientKey: string; // Clave única del cliente para validación (solo se usa en handshake inicial)
  validationApiUrl: string; // URL del endpoint de validación del backend (e.g., /api/validate-sdk)
  chatApiUrl: string; // URL del endpoint de chat real para enviar mensajes (e.g., /api/chat/message)
  chatStartApiUrl: string; // URL del endpoint para iniciar un chat (e.g., /api/chat/start)
  // REMOVED: assistantId and userId - these now come from backend handshake response
  // The backend returns these values securely after validating the clientKey
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
  // Fallback for older browsers
  return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
}

/**
 * Collects browser context information for security validation
 * This data helps the backend verify the widget is being used from authorized domains
 */
function collectBrowserContext(widgetSessionId: string): BrowserContext {
  if (typeof window === "undefined") {
    // SSR fallback - should not happen in practice as this runs client-side
    return {
      origin: "",
      hostname: "",
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
    userAgent: navigator.userAgent,
    language: navigator.language,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    widgetSessionId,
    timestamp: Date.now(),
  };
}

/**
 * Checks if the session token is still valid based on expiration time
 * Includes a 30-second buffer to prevent edge-case expiration during requests
 */
function isSessionValid(expiresAt: number | null): boolean {
  if (!expiresAt) return false;
  const bufferMs = 30 * 1000; // 30 second buffer
  return Date.now() < expiresAt - bufferMs;
}

/**
 * Maps backend status to user-friendly error messages
 */
function getStatusErrorMessage(
  status: SessionData["status"] | undefined,
): string {
  switch (status) {
    case "blocked":
      return "Acceso bloqueado. Contacta al administrador.";
    case "domain_mismatch":
      return "Dominio no autorizado para este widget.";
    case "expired":
      return "La clave de cliente ha expirado.";
    default:
      return "Error de validación desconocido.";
  }
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function ChatWidget({
  clientKey,
  validationApiUrl,
  chatApiUrl,
  chatStartApiUrl,
  // assistantId and userId are NO LONGER accepted as props
  // They are obtained from the backend handshake response and stored in sessionData
  theme = "default",
  chatTitle = "ChatBot SaaS",
  chatSubtitle = "Asistente virtual",
  initialBotMessage = "¡Hola! Soy el asistente virtual de ChatBot SaaS. ¿En qué puedo ayudarte hoy?",
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
}: ChatWidgetProps) {
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

  /**
   * Unique session ID for this widget instance
   * Generated once and persisted across re-renders using useRef
   */
  const widgetSessionIdRef = useRef<string | null>(null);

  /**
   * Flag to prevent multiple concurrent validation attempts
   */
  const isValidatingRef = useRef(false);

  // =========================================================================
  // COMPUTED VALUES
  // =========================================================================

  /**
   * Determine if the widget is in an authorized state and ready for chat
   */
  const isAuthorized = useMemo(() => {
    return (
      widgetStatus === "authorized" &&
      sessionData !== null &&
      isSessionValid(sessionData.expiresAt)
    );
  }, [widgetStatus, sessionData]);

  /**
   * Determine effective theme colors based on props
   */
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
  // SECURITY: HANDSHAKE & VALIDATION
  // =========================================================================

  /**
   * Performs the initial handshake with the backend
   *
   * Security flow:
   * 1. Generate unique widgetSessionId (only once per widget instance)
   * 2. Collect browser context (domain, userAgent, etc.)
   * 3. Send ONLY clientKey + browser context to validation endpoint
   * 4. Backend validates and returns: sessionToken, assistantId, user_id, status
   * 5. Store sessionToken, assistantId, userId in state (NEVER in props or storage)
   * 6. NEVER send clientKey again after this point
   * 7. All subsequent API calls use Authorization: Bearer <sessionToken>
   */
  const performHandshake = useCallback(async () => {
    // Prevent multiple concurrent validation attempts
    if (isValidatingRef.current) {
      return;
    }

    // Skip if already authorized and session is still valid
    if (
      widgetStatus === "authorized" &&
      sessionData &&
      isSessionValid(sessionData.expiresAt)
    ) {
      return;
    }

    isValidatingRef.current = true;
    setWidgetStatus("validating");
    setStatusMessage(null);

    try {
      // Generate or reuse widget session ID
      if (!widgetSessionIdRef.current) {
        widgetSessionIdRef.current = generateWidgetSessionId();
      }

      // Collect browser context for security validation
      const browserContext = collectBrowserContext(widgetSessionIdRef.current);

      // Perform handshake request
      // IMPORTANT: This is the ONLY time clientKey is sent to the backend
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
            userAgent: browserContext.userAgent,
            language: browserContext.language,
            timezone: browserContext.timezone,
            timestamp: browserContext.timestamp,
          },
        }),
      });

      const data: ValidationResponse = await response.json();

      // Handle non-success responses
      if (!response.ok || !data.success) {
        const errorMessage = data.message || getStatusErrorMessage(data.status);
        setWidgetStatus(
          data.status === "blocked" || data.status === "domain_mismatch"
            ? "blocked"
            : "error",
        );
        setStatusMessage(errorMessage);
        console.error("[ChatWidget] Validation failed:", errorMessage);
        return;
      }

      // Validate response contains ALL required session data
      // Backend MUST return: sessionToken, expiresAt, status, assistantId, user_id
      if (
        !data.sessionToken ||
        !data.expiresAt ||
        data.status !== "active" ||
        !data.assistantId ||
        !data.user_id
      ) {
        setWidgetStatus("error");
        setStatusMessage("Respuesta de validación incompleta.");
        console.error(
          "[ChatWidget] Invalid validation response - missing required fields:",
          {
            hasSessionToken: !!data.sessionToken,
            hasExpiresAt: !!data.expiresAt,
            status: data.status,
            hasAssistantId: !!data.assistantId,
            hasUserId: !!data.user_id,
          },
        );
        return;
      }

      // Store session data in state ONLY (not props, localStorage, or cookies)
      // sessionToken will be used for all subsequent requests via Authorization header
      // assistantId and userId come from backend - NEVER from props
      setSessionData({
        sessionToken: data.sessionToken,
        expiresAt: data.expiresAt,
        status: data.status,
        assistantId: data.assistantId,
        userId: data.user_id,
      });

      setWidgetStatus("authorized");
      setStatusMessage(null);
      console.log("[ChatWidget] Handshake successful, session established.");

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
      setStatusMessage("No se pudo conectar con el servidor.");
      console.error("[ChatWidget] Handshake error:", error);
    } finally {
      isValidatingRef.current = false;
    }
  }, [
    clientKey,
    validationApiUrl,
    widgetStatus,
    sessionData,
    initialBotMessage,
  ]);

  // =========================================================================
  // SECURE API HELPERS
  // =========================================================================

  /**
   * Creates authenticated headers using the session token
   * SECURITY: Uses Bearer token authentication instead of exposing clientKey
   */
  const getAuthenticatedHeaders = useCallback((): HeadersInit => {
    if (!sessionData?.sessionToken) {
      throw new Error("No session token available");
    }

    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionData.sessionToken}`,
    };
  }, [sessionData]);

  /**
   * Checks if session needs refresh and handles accordingly
   * Returns true if session is valid, false if needs re-authentication
   */
  const ensureValidSession = useCallback(async (): Promise<boolean> => {
    if (!sessionData || !isSessionValid(sessionData.expiresAt)) {
      // Session expired or missing - need to re-authenticate
      setWidgetStatus("idle");
      setSessionData(null);
      await performHandshake();
      return widgetStatus === "authorized";
    }
    return true;
  }, [sessionData, performHandshake, widgetStatus]);

  // =========================================================================
  // EFFECTS
  // =========================================================================

  /**
   * Trigger handshake when widget opens
   */
  useEffect(() => {
    if (isOpen && widgetStatus === "idle") {
      performHandshake();
    }
  }, [isOpen, widgetStatus, performHandshake]);

  /**
   * Auto-scroll to latest message
   */
  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, isMinimized]);

  // =========================================================================
  // MESSAGE HANDLERS
  // =========================================================================

  /**
   * Handles sending messages with secure authentication
   * All requests use sessionToken via Authorization header
   */
  const handleSendMessage = useCallback(
    async (e?: React.FormEvent) => {
      if (e) e.preventDefault();
      if (!input.trim() || !isAuthorized) return;

      // Ensure session is still valid before making requests
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

      // If no chat exists yet, create one with the first message
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
            console.error(
              "[ChatWidget] Failed to start chat:",
              chatStartData.error,
            );
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
          setMessages([
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
          console.error("[ChatWidget] Error starting chat:", err);
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

      // Chat already exists - send message to existing chat
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
          // Handle specific error cases
          if (response.status === 401) {
            // Token expired or invalid - trigger re-authentication
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
      } catch (error) {
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

  /**
   * Handles closing the chat widget
   * Clears all session data and resets to initial state
   */
  const handleCloseChat = useCallback(() => {
    setIsOpen(false);
    setIsMinimized(false);
    setMessages([]);
    setCurrentChatId(null);

    // Reset security state - will require new handshake on next open
    setWidgetStatus("idle");
    setSessionData(null);
    setStatusMessage(null);

    // Note: widgetSessionIdRef is intentionally NOT cleared
    // This allows the backend to track widget instances across opens/closes
  }, []);

  // =========================================================================
  // RENDER HELPERS
  // =========================================================================

  /**
   * Renders appropriate content based on widget status
   */
  const renderChatContent = () => {
    // Validating state
    if (widgetStatus === "validating") {
      return (
        <div className="text-center text-gray-500 py-4">
          <div className="flex justify-center mb-2">
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
          <p className="text-sm">Conectando...</p>
        </div>
      );
    }

    // Blocked or Error state
    if (widgetStatus === "blocked" || widgetStatus === "error") {
      return (
        <div className="text-center text-red-500 py-4">
          <p className="font-bold">Error de Carga del Chat</p>
          <p className="text-sm">{statusMessage || "Dominio no autorizado."}</p>
          <p className="text-sm mt-2">
            Por favor, contacta al soporte para más información.
          </p>
        </div>
      );
    }

    // Authorized but no messages yet
    if (messages.length === 0 && isAuthorized) {
      return (
        <div className="text-center text-gray-500 py-4">
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
                  <span className="text-xs font-medium text-gray-800 dark:text-white">
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
                      {renderChatContent()}
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
                        disabled={isTyping || !isAuthorized}
                        aria-label="Escribe tu mensaje"
                      />
                      <Button
                        type="submit"
                        size="icon"
                        disabled={isTyping || !input.trim() || !isAuthorized}
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
