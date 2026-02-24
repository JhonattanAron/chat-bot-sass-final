// app/dashboard/layout.tsx
"use client";

import { DashboardNav } from "@/components/email-corporativo/DashboardNav";
import { DashboardSidebar } from "@/components/email-corporativo/DashboardSidebar";
import { useEmail } from "@/contexts/EmailContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isConnected } = useEmail();
  const router = useRouter();

  return (
    <div className="flex flex-col h-screen bg-slate-900">
      <DashboardNav />
      <div className="flex flex-1 overflow-hidden">
        <DashboardSidebar />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
