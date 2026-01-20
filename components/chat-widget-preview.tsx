"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare, X, Send, Minimize2, Maximize2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type ChatSettings = {
  title: string;
  subtitle: string;
  primaryColor: string;
  buttonColor: string;
  bubbleColor: string;
  userBubbleColor: string;
  userTextColor?: string; // Nuevo parámetro
  botTextColor?: string; // Nuevo parámetro
  headerStyle: "gradient" | "solid";
  logo?: string;
  showLogo: boolean;
  position: "right" | "left";
  initialMessage: string;
  placeholderText: string;
};

type Message = {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
};

export function ChatWidgetPreview({ settings }: { settings?: ChatSettings }) {
  const [isOpen, setIsOpen] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: settings?.initialMessage || "Hello! How can I help you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");

  const defaultSettings: ChatSettings = {
    title: "ChatBot Support",
    subtitle: "Virtual Assistant",
    primaryColor: "#4f46e5",
    buttonColor: "#4f46e5",
    bubbleColor: "#f9fafb",
    userBubbleColor: "#000000",
    userTextColor: "#fff", // Valor por defecto
    botTextColor: "#000", // Valor por defecto
    headerStyle: "gradient",
    showLogo: true,
    position: "right",
    initialMessage: "Hello! How can I help you today?",
    placeholderText: "Type your message...",
  };

  const chatSettings = { ...defaultSettings, ...settings };

  const handleSendMessage = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // Simulate bot response
    setTimeout(() => {
      const botMessage: Message = {
        id: Date.now().toString(),
        content:
          "This is a preview of how your chatbot will respond to user messages.",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    }, 1000);
  };

  const headerStyle =
    chatSettings.headerStyle === "gradient"
      ? {
          background: `linear-gradient(to right, ${
            chatSettings.primaryColor
          }, ${adjustColor(chatSettings.primaryColor, -30)})`,
        }
      : { background: chatSettings.primaryColor };

  return (
    <div className="chat-widget-preview">
      <div className="flex justify-between mb-2">
        <span className="text-sm font-medium">Chat Widget Preview</span>
        <Button variant="outline" size="sm" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? "Hide Chat" : "Show Chat"}
        </Button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="chat-window bg-white dark:bg-gray-900 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800 shadow-md"
            style={{ maxWidth: "300px" }}
          >
            {/* Chat Header */}
            <div
              className="p-3 flex justify-between items-center"
              style={headerStyle}
            >
              <div className="flex items-center">
                {chatSettings.showLogo && (
                  <div className="bg-white/20 rounded-full p-1.5 mr-2">
                    {chatSettings.logo ? (
                      <img
                        src={chatSettings.logo || "/placeholder.svg"}
                        alt="Logo"
                        className="h-4 w-4"
                      />
                    ) : (
                      <MessageSquare className="h-4 w-4 text-white" />
                    )}
                  </div>
                )}
                <div>
                  <h3 className="font-medium text-white text-sm">
                    {chatSettings.title}
                  </h3>
                  <p className="text-xs text-gray-200">
                    {chatSettings.subtitle}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="text-gray-200 hover:text-white p-1"
                >
                  {isMinimized ? (
                    <Maximize2 size={14} />
                  ) : (
                    <Minimize2 size={14} />
                  )}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-200 hover:text-white p-1"
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            {/* Chat Messages */}
            <AnimatePresence>
              {!isMinimized && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: "200px" }}
                  exit={{ height: 0 }}
                  className="p-3 h-[200px] overflow-y-auto bg-gray-50 dark:bg-gray-950"
                >
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`mb-3 flex ${
                        message.sender === "user"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      {message.sender === "bot" && (
                        <div className="mr-1.5 flex-shrink-0">
                          <div
                            className="rounded-full h-6 w-6 flex items-center justify-center"
                            style={{ background: chatSettings.primaryColor }}
                          >
                            <MessageSquare className="h-3 w-3 text-white" />
                          </div>
                        </div>
                      )}
                      <div
                        className={`chat-bubble p-2 rounded-lg max-w-[75%] text-sm`}
                        style={{
                          background:
                            message.sender === "user"
                              ? chatSettings.userBubbleColor
                              : chatSettings.bubbleColor,
                          color:
                            message.sender === "user"
                              ? chatSettings.userTextColor || "#fff"
                              : chatSettings.botTextColor || "#000",
                        }}
                      >
                        <p className="text-xs">{message.content}</p>
                        <p className="text-[10px] mt-1 opacity-60">
                          {message.timestamp.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                      {message.sender === "user" && (
                        <div className="ml-1.5 flex-shrink-0">
                          <div className="bg-gray-300 dark:bg-gray-700 rounded-full h-6 w-6 flex items-center justify-center">
                            <span className="text-[10px] font-medium text-gray-800 dark:text-white">
                              Tú
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Chat Input */}
            {!isMinimized && (
              <div className="p-2 border-t border-gray-200 dark:border-gray-800">
                <div className="flex items-center">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={chatSettings.placeholderText}
                    className="flex-grow mr-1 h-8 text-xs"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    size="icon"
                    className="h-8 w-8"
                    style={{ background: chatSettings.buttonColor }}
                    disabled={!input.trim()}
                    onClick={() => handleSendMessage()}
                  >
                    <Send className="h-3 w-3 text-white" />
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Button */}
      {!isOpen && (
        <div className="flex justify-center mt-4">
          <button
            onClick={() => setIsOpen(true)}
            type="button"
            className="rounded-full p-3 shadow-lg text-white"
            style={{ background: chatSettings.buttonColor }}
          >
            <MessageSquare className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
}

// Helper function to adjust color brightness
function adjustColor(color: string, amount: number): string {
  return color;
  // En una implementación real, aquí se ajustaría el brillo del color
}
