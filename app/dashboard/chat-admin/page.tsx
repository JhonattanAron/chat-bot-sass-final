"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { ChatAdminPanel } from "@/components/chat-admin/chat-admin-panel";

export default function ChatAdminPage() {
  const { data: session, status } = useSession();

  if (status === "unauthenticated") {
    redirect("/login");
  }

  if (status === "loading") {
    return <div className="flex items-center justify-center h-screen">Cargando...</div>;
  }

  return (
    <div className="h-screen">
      <ChatAdminPanel userId={session?.user?.id || ""} />
    </div>
  );
}
