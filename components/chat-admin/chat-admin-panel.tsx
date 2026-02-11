"use client";

import React, { useEffect, useState } from "react";
import { useChatAdminStore } from "@/store/chatAdminStore";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Send, UserCheck, Phone, Clock, LogOut } from "lucide-react";

interface ChatAdminPanelProps {
  userId: string;
}

export function ChatAdminPanel({ userId }: ChatAdminPanelProps) {
  const { chats, currentChat, loading, error, success, getUserChats, getChat, sendMessage, transferChat, restoreChat, getStatistics } =
    useChatAdminStore();
  const [messageInput, setMessageInput] = useState("");
  const [showTransferForm, setShowTransferForm] = useState(false);
  const [agentId, setAgentId] = useState("");

  useEffect(() => {
    void getUserChats();
    void getStatistics();
  }, [userId]);

  const handleSelectChat = (chatId: string) => {
    void getChat(chatId);
  };

  const handleSendMessage = async () => {
    if (!currentChat || !messageInput.trim()) return;

    try {
      await sendMessage(currentChat._id, messageInput, "admin");
      setMessageInput("");
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  const handleTransfer = async () => {
    if (!currentChat) return;

    try {
      await transferChat(currentChat._id, agentId || undefined);
      setShowTransferForm(false);
      setAgentId("");
    } catch (err) {
      console.error("Error transferring chat:", err);
    }
  };

  const handleRestoreChat = async () => {
    if (!currentChat) return;

    try {
      await restoreChat(currentChat._id);
    } catch (err) {
      console.error("Error restoring chat:", err);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-screen">
      {/* Lista de Chats */}
      <div className="lg:col-span-1 border-r">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold mb-4">Chats Activos</h2>
          <Input placeholder="Buscar chats..." className="w-full" />
        </div>

        <div className="overflow-y-auto h-[calc(100vh-140px)]">
          {chats.map((chat) => (
            <div
              key={chat._id}
              onClick={() => handleSelectChat(chat._id)}
              className={`p-4 border-b cursor-pointer transition ${
                currentChat?._id === chat._id ? "bg-blue-50 border-l-4 border-blue-500" : "hover:bg-gray-50"
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <p className="font-semibold text-sm truncate">Chat #{chat._id.slice(-6)}</p>
                {chat.transferred && <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">Transferido</span>}
              </div>
              <p className="text-xs text-gray-500">
                <Clock className="inline w-3 h-3 mr-1" />
                {new Date(chat.lastActivityAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Panel de Chat */}
      <div className="lg:col-span-2 flex flex-col">
        {currentChat ? (
          <>
            {/* Header */}
            <div className="border-b p-4 bg-white sticky top-0">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-bold">Chat #{currentChat._id.slice(-6)}</h3>
                  <p className="text-sm text-gray-600">
                    {currentChat.transferred
                      ? `Transferido a: ${currentChat.transferredTo || "Agente sin asignar"}`
                      : "En conversación automática"}
                  </p>
                </div>
                <div className="flex gap-2">
                  {currentChat.transferred ? (
                    <Button size="sm" variant="outline" onClick={handleRestoreChat} disabled={loading}>
                      <LogOut className="w-4 h-4 mr-1" />
                      Restaurar
                    </Button>
                  ) : (
                    <Button size="sm" variant="outline" onClick={() => setShowTransferForm(!showTransferForm)} disabled={loading}>
                      <UserCheck className="w-4 h-4 mr-1" />
                      Transferir
                    </Button>
                  )}
                </div>
              </div>

              {/* Formulario de Transferencia */}
              {showTransferForm && !currentChat.transferred && (
                <div className="mt-4 flex gap-2">
                  <Input
                    placeholder="ID del agente (opcional)"
                    value={agentId}
                    onChange={(e) => setAgentId(e.target.value)}
                    className="flex-1"
                  />
                  <Button size="sm" onClick={handleTransfer} disabled={loading}>
                    Transferir
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setShowTransferForm(false)}>
                    Cancelar
                  </Button>
                </div>
              )}
            </div>

            {/* Mensajes */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {currentChat.messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      msg.role === "user" ? "bg-blue-500 text-white" : msg.role === "admin" ? "bg-green-500 text-white" : "bg-white text-gray-800 border"
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                    <p className="text-xs mt-1 opacity-70">{new Date(msg.createdAt).toLocaleTimeString()}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Input de Mensaje */}
            {!currentChat.transferred && (
              <div className="border-t p-4 bg-white">
                <div className="flex gap-2">
                  <Input
                    placeholder="Escribe un mensaje..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    className="flex-1"
                    disabled={loading}
                  />
                  <Button onClick={handleSendMessage} disabled={loading || !messageInput.trim()}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-500">Selecciona un chat para comenzar</p>
          </div>
        )}
      </div>

      {error && <div className="fixed bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded">{error}</div>}
      {success && <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded">{success}</div>}
    </div>
  );
}
