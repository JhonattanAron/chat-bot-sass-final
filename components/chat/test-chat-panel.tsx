'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageSquare, Plus, Menu, X, Send, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useChatStore } from '@/store/chatControlStore';
import { useChatAssistantStore } from '@/store/chatAsistantStore';

interface TestChatPanelProps {
  assistantId: string;
}

const adjustColor = (hex: string, amount: number) => {
  return (
    '#' +
    hex
      .replace(/^#/, '')
      .replace(/../g, (color) =>
        (
          '0' +
          Math.min(
            255,
            Math.max(0, Number.parseInt(color, 16) + amount),
          ).toString(16)
        ).substr(-2),
      )
  );
};

export function TestChatPanel({ assistantId }: TestChatPanelProps) {
  const { currentChat, chats, startChat, sendMessage, fetchChat, loading, error } =
    useChatStore();
  const { assistant } = useChatAssistantStore();
  const { toast } = useToast();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [messageInput, setMessageInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const chatSettings = assistant?.chatSettings || {};
  const welcomeMessage =
    assistant?.welcome_message || '¡Hola! ¿Cómo puedo ayudarte?';
  const primaryColor = chatSettings?.primaryColor || '#4f46e5';
  const bubbleColor = chatSettings?.bubbleColor || '#f9fafb';
  const userBubbleColor = chatSettings?.userBubbleColor || '#000000';
  const headerStyle = chatSettings?.headerStyle || 'gradient';
  const subtitle = chatSettings?.subtitle || 'Testing Mode';

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentChat?.messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!messageInput.trim()) return;

    const messageToSend = messageInput.trim();
    setMessageInput('');
    setIsSubmitting(true);

    try {
      if (!currentChat) {
        // Crear nuevo chat
        const result = await startChat({
          assistant_id: assistantId,
          promt: messageToSend,
        });

        if (result && result.chat_id) {
          await fetchChat(result.chat_id);
        }
      } else {
        // Enviar mensaje a chat existente
        await sendMessage({
          chatId: currentChat.id,
          assistant_id: assistantId,
          role: 'user',
          content: messageToSend,
        });
      }
      scrollToBottom();
    } catch (err: any) {
      console.error('Error sending message:', err);
      toast({
        title: 'Error',
        description: err.message || 'No se pudo enviar el mensaje',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNewChat = () => {
    setMessageInput('');
    setSidebarOpen(true);
  };

  const handleSelectChat = async (chatId: string) => {
    try {
      await fetchChat(chatId);
    } catch (err: any) {
      toast({
        title: 'Error',
        description: 'Error al cargar el chat',
        variant: 'destructive',
      });
    }
  };

  const headerGradient =
    headerStyle === 'gradient'
      ? `linear-gradient(to right, ${primaryColor}, ${adjustColor(
          primaryColor,
          -30,
        )})`
      : primaryColor;

  const messages = currentChat?.messages || [];

  return (
    <div className="flex h-[600px] bg-white dark:bg-gray-950 rounded-lg shadow-md overflow-hidden">
      {/* Sidebar - Chat Sessions */}
      <div
        className={cn(
          'border-r bg-gray-50 dark:bg-gray-900 transition-all duration-300 flex flex-col',
          sidebarOpen ? 'w-80' : 'w-0 overflow-hidden',
        )}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b flex-shrink-0">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-sm text-gray-900 dark:text-white">
              Chat Sessions
            </h3>
            <Button
              onClick={() => setSidebarOpen(false)}
              size="sm"
              variant="ghost"
              className="lg:hidden h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <Button
            onClick={handleNewChat}
            size="sm"
            className="w-full gap-2"
            variant="default"
          >
            <Plus className="h-4 w-4" />
            New Chat
          </Button>
        </div>

        {/* Chats List */}
        <div className="overflow-y-auto flex-1 min-h-0">
          {chats && Array.isArray(chats) && chats.length > 0 ? (
            chats.map((chat, index) => (
              <button
                key={chat.id}
                onClick={() => handleSelectChat(chat.id)}
                className={cn(
                  'w-full text-left px-4 py-3 transition-colors border-b hover:bg-gray-100 dark:hover:bg-gray-800',
                  currentChat?.id === chat.id
                    ? 'bg-blue-50 dark:bg-blue-900/30 border-l-2 border-l-blue-500 font-semibold'
                    : 'bg-white dark:bg-gray-900',
                )}
              >
                <div className="flex flex-col w-full gap-1">
                  <p className="text-sm text-gray-900 dark:text-white truncate font-medium">
                    💬 Chat {index + 1}
                  </p>
                  <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {chat.lastActivity || 'No messages yet'}
                  </span>
                </div>
              </button>
            ))
          ) : (
            <div className="p-4 text-center text-muted-foreground text-sm">
              No chats yet. Start a new conversation!
            </div>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-gray-50 dark:bg-gray-950">
        {/* Mobile Sidebar Toggle */}
        {!sidebarOpen && (
          <div className="p-2 border-b lg:hidden bg-white dark:bg-gray-900">
            <Button
              onClick={() => setSidebarOpen(true)}
              size="sm"
              variant="outline"
              className="gap-2"
            >
              <Menu className="h-4 w-4" />
              Chats
            </Button>
          </div>
        )}

        {/* Chat Header */}
        <div
          className="p-4 border-b flex-shrink-0 text-white shadow-sm"
          style={{ background: headerGradient }}
        >
          <div className="flex items-center gap-3">
            <div className="bg-white/20 rounded-full p-2 flex-shrink-0">
              <MessageSquare className="h-5 w-5 text-white" />
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-white truncate">
                {currentChat ? `Chat` : 'New Chat'}
              </h3>
              <p className="text-sm text-gray-100">{subtitle}</p>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto p-4 space-y-4 flex flex-col"
        >
          {/* Welcome Message */}
          {messages.length === 0 && (
            <div className="flex justify-start">
              <div className="flex gap-2 max-w-[80%] sm:max-w-[70%]">
                <div
                  className="rounded-full h-8 w-8 flex-shrink-0 flex items-center justify-center text-white flex-none"
                  style={{ background: primaryColor }}
                >
                  <MessageSquare className="h-4 w-4" />
                </div>
                <div
                  className="p-3 rounded-lg"
                  style={{
                    background: bubbleColor,
                    color: '#000',
                  }}
                >
                  <p className="text-sm leading-relaxed">{welcomeMessage}</p>
                </div>
              </div>
            </div>
          )}

          {/* Messages */}
          {messages.map((message, index) => (
            <div
              key={`${message.role}-${index}`}
              className={`flex ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.role === 'assistant' && (
                <div className="flex gap-2 max-w-[80%] sm:max-w-[70%]">
                  <div
                    className="rounded-full h-8 w-8 flex-shrink-0 flex items-center justify-center text-white flex-none"
                    style={{ background: primaryColor }}
                  >
                    <MessageSquare className="h-4 w-4" />
                  </div>
                  <div
                    className="p-3 rounded-lg"
                    style={{
                      background: bubbleColor,
                      color: '#000',
                    }}
                  >
                    <p className="text-sm leading-relaxed">{message.content}</p>
                    {message.createdAt && (
                      <p className="text-xs mt-2 opacity-60">
                        {new Date(message.createdAt).toLocaleTimeString(
                          'es-EC',
                          {
                            hour: '2-digit',
                            minute: '2-digit',
                          },
                        )}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {message.role === 'user' && (
                <div className="flex gap-2 max-w-[80%] sm:max-w-[70%] flex-row-reverse">
                  <div className="bg-gray-300 dark:bg-gray-700 rounded-full h-8 w-8 flex-shrink-0 flex items-center justify-center flex-none">
                    <span className="text-xs font-medium text-gray-800 dark:text-white">
                      You
                    </span>
                  </div>
                  <div
                    className="p-3 rounded-lg"
                    style={{
                      background: userBubbleColor,
                      color: '#fff',
                    }}
                  >
                    <p className="text-sm leading-relaxed">{message.content}</p>
                    {message.createdAt && (
                      <p className="text-xs mt-2 opacity-60">
                        {new Date(message.createdAt).toLocaleTimeString(
                          'es-EC',
                          {
                            hour: '2-digit',
                            minute: '2-digit',
                          },
                        )}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Loading State */}
          {isSubmitting || loading ? (
            <div className="flex justify-start">
              <div className="flex gap-2 max-w-[80%] sm:max-w-[70%]">
                <div
                  className="rounded-full h-8 w-8 flex-shrink-0 flex items-center justify-center text-white animate-pulse"
                  style={{ background: primaryColor }}
                >
                  <MessageSquare className="h-4 w-4" />
                </div>
                <div
                  className="p-3 rounded-lg flex items-center gap-2"
                  style={{
                    background: bubbleColor,
                    color: '#000',
                  }}
                >
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" />
                    <div
                      className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                      style={{ animationDelay: '0.1s' }}
                    />
                    <div
                      className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                      style={{ animationDelay: '0.2s' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {/* Error Display */}
          {error && (
            <div className="flex justify-center">
              <div className="text-center text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                {error}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t bg-white dark:bg-gray-900 flex-shrink-0 shadow-md">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <Input
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder="Write a message..."
              disabled={isSubmitting || loading}
              className="flex-1"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey && !isSubmitting) {
                  e.preventDefault();
                  handleSendMessage(e);
                }
              }}
            />
            <Button
              type="submit"
              disabled={isSubmitting || loading || !messageInput.trim()}
              className="gap-2 flex-shrink-0 text-white"
              style={{
                background: primaryColor,
              }}
            >
              {isSubmitting || loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              <span className="hidden sm:inline">Send</span>
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
