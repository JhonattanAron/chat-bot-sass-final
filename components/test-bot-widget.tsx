"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Send, Menu, X, MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface TestMessage {
  id: string;
  content: string;
  sender: "bot" | "user";
  timestamp: Date;
  analysis?: {
    intent?: string;
    confidence?: number;
    functionCalled?: string;
    parameters?: Record<string, any>;
  };
}

interface TestBotWidgetProps {
  messages: TestMessage[];
  onSendMessage: (message: string) => Promise<void>;
  isLoading?: boolean;
  botName?: string;
  botColor?: string;
  userBubbleColor?: string;
  bubbleColor?: string;
  buttonColor?: string;
  placeholderText?: string;
  welcomeMessage?: string;
  showAnalysis?: boolean;
}

export function TestBotWidget({
  messages,
  onSendMessage,
  isLoading = false,
  botName = "Bot",
  botColor = "#4f46e5",
  userBubbleColor = "#000000",
  bubbleColor = "#f9fafb",
  buttonColor = "#4f46e5",
  placeholderText = "Type your message...",
  welcomeMessage = "Hello! How can I help you?",
  showAnalysis = false,
}: TestBotWidgetProps) {
  const [input, setInput] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const messageToSend = input;
    setInput("");
    setIsSubmitting(true);

    try {
      await onSendMessage(messageToSend);
    } catch (error) {
      console.error("[v0] Error sending message:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Test Your Bot</CardTitle>
        <CardDescription>
          Test your bot's responses and functionality in real-time with analysis.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="flex h-[600px]">
          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {/* Chat Header */}
            <div
              className="p-4 border-b flex items-center gap-3 text-white"
              style={{ background: botColor }}
            >
              <div className="bg-white/20 rounded-full p-2">
                <MessageSquare className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-medium">{botName}</h3>
                <p className="text-sm text-gray-200">Testing Mode</p>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-950">
              {messages.map((message) => (
                <div key={message.id}>
                  <div
                    className={`flex ${
                      message.sender === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {message.sender === "bot" && (
                      <div className="mr-2 flex-shrink-0">
                        <div
                          className="rounded-full h-8 w-8 flex items-center justify-center"
                          style={{ background: botColor }}
                        >
                          <MessageSquare className="h-4 w-4 text-white" />
                        </div>
                      </div>
                    )}

                    <div
                      className="max-w-[70%] p-3 rounded-lg"
                      style={{
                        background:
                          message.sender === "user"
                            ? userBubbleColor
                            : bubbleColor,
                        color: message.sender === "user" ? "#fff" : "#000",
                      }}
                    >
                      <p className="text-sm">{message.content}</p>

                      {/* Analysis Display */}
                      {showAnalysis && message.analysis && (
                        <div className="mt-2 pt-2 border-t border-current/20 text-xs opacity-70">
                          {message.analysis.intent && (
                            <p>Intent: {message.analysis.intent}</p>
                          )}
                          {message.analysis.confidence && (
                            <p>
                              Confidence:{" "}
                              {(message.analysis.confidence * 100).toFixed(0)}%
                            </p>
                          )}
                          {message.analysis.functionCalled && (
                            <p>Function: {message.analysis.functionCalled}</p>
                          )}
                        </div>
                      )}
                    </div>

                    {message.sender === "user" && (
                      <div className="ml-2 flex-shrink-0">
                        <div className="bg-gray-300 dark:bg-gray-700 rounded-full h-8 w-8 flex items-center justify-center">
                          <span className="text-xs font-medium">You</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isSubmitting && (
                <div className="flex justify-start">
                  <div className="mr-2 flex-shrink-0">
                    <div
                      className="rounded-full h-8 w-8 flex items-center justify-center"
                      style={{ background: botColor }}
                    >
                      <Loader2 className="h-4 w-4 text-white animate-spin" />
                    </div>
                  </div>
                  <div
                    className="max-w-[70%] p-3 rounded-lg"
                    style={{ background: bubbleColor }}
                  >
                    <p className="text-sm text-gray-500">Typing...</p>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t bg-background">
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={placeholderText}
                  disabled={isSubmitting || isLoading}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !isSubmitting && !isLoading) {
                      handleSend();
                    }
                  }}
                />
                <Button
                  onClick={handleSend}
                  disabled={!input.trim() || isSubmitting || isLoading}
                  style={{ background: buttonColor }}
                  className="text-white"
                >
                  {isSubmitting || isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
