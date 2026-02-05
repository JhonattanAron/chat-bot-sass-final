"use client";

import React from "react";

import { Home, Settings, Users, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href?: string;
}

interface WhatsAppSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function WhatsAppSidebar({
  activeTab,
  onTabChange,
}: WhatsAppSidebarProps) {
  const pathname = usePathname();

  const navItems: SidebarItem[] = [
    {
      id: "home",
      label: "Home",
      icon: <Home className="w-5 h-5" />,
    },
    {
      id: "configuracion",
      label: "Configuración",
      icon: <Settings className="w-5 h-5" />,
    },
    {
      id: "crm",
      label: "CRM",
      icon: <Users className="w-5 h-5" />,
    },
  ];

  return (
    <aside className="w-64 h-1/2 bg-gradient from-primary/10 to-background border-r p-6 flex flex-col">
      {/* HEADER */}
      <div className="mb-8">
        <h2 className="text-xl font-bold">WhatsApp Hub</h2>
        <p className="text-xs text-muted-foreground">Campañas inteligentes</p>
      </div>

      {/* NAVIGATION */}
      <nav className="space-y-2 flex-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
              activeTab === item.id
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            {item.icon}
            <span className="font-medium text-sm">{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}
