"use client";

import type React from "react";
import { Globe, Check, CreditCard, TrendingUp, BookText } from "lucide-react";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Bot,
  LayoutDashboard,
  Settings,
  HelpCircle,
  BarChart3,
  Bell,
  LogOut,
  Menu,
  X,
  Search,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { ModeToggle } from "@/components/mode-toggle";
import { useLanguage } from "@/contexts/language-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { TokenCounterCompact } from "@/components/token-counter-compact";
import { signOut, useSession } from "next-auth/react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hasNotifications, setHasNotifications] = useState(true);
  const { t, language, setLanguage } = useLanguage();
  const { data: session } = useSession();

  const [tokenUsage, setTokenUsage] = useState({
    input: 1250,
    output: 890,
    maxTokens: 10000,
  });

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const langParam = urlParams.get("lang");

    if (langParam === "en" || langParam === "es") {
      setLanguage(langParam);
    } else if (language !== "es") {
      setLanguage("es");
    }
  }, []);

  const changeLanguageWithUrl = (lang: "en" | "es") => {
    setLanguage(lang);
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("lang", lang);
    const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
    window.history.pushState({}, "", newUrl);
  };

  const routes = [
    {
      href: "/dashboard",
      label: t("dashboard"),
      icon: LayoutDashboard,
      active: pathname === "/dashboard",
    },
    {
      href: "/dashboard/bots",
      label: t("myBots"),
      icon: Bot,
      active:
        pathname === "/dashboard/bots" ||
        pathname.startsWith("/dashboard/bots/"),
    },
    {
      href: "/dashboard/batch",
      label: t("Lotes de Busqueda"),
      icon: BookText,
      active:
        pathname === "/dashboard/batch" ||
        pathname.startsWith("/dashboard/batch"),
    },
    {
      href: "/dashboard/campaign",
      label: t("campaigns"),
      icon: TrendingUp,
      active:
        pathname === "/dashboard/campaign" ||
        pathname.startsWith("/dashboard/campaign"),
    },
    {
      href: "/dashboard/analytics",
      label: t("analytics"),
      icon: BarChart3,
      active: pathname === "/dashboard/analytics",
    },
    {
      href: "/dashboard/facturacion",
      label: t("facturacion"),
      icon: CreditCard,
      active: pathname === "/dashboard/facturacion",
    },
    {
      href: "/dashboard/settings",
      label: t("settings"),
      icon: Settings,
      active: pathname === "/dashboard/settings",
    },
    {
      href: "/dashboard/help",
      label: t("helpSupport"),
      icon: HelpCircle,
      active: pathname === "/dashboard/help",
    },
  ];

  const notifications = [
    {
      id: 1,
      title: "Factura pendiente",
      description:
        "Tienes una factura pendiente de $7.00 para el plan Profesional",
      date: "Hace 2 horas",
      type: "billing",
    },
    {
      id: 2,
      title: "Límite de preguntas",
      description: "Has alcanzado el 80% de tu límite mensual de preguntas",
      date: "Hace 1 día",
      type: "warning",
    },
    {
      id: 3,
      title: "Soporte técnico",
      description:
        "Tu consulta #4582 ha sido respondida por el equipo de soporte",
      date: "Hace 3 días",
      type: "support",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-background via-background to-muted/20">
      <header className="sticky top-0 z-30 bg-white dark:bg-black flex h-16 items-center gap-4 glass-effect border-b border-border/50 px-4 md:px-6">
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="outline" size="icon" className="mr-2 glass-effect">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 sm:max-w-xs glass-effect">
            <SheetTitle>Menu</SheetTitle>
            <div className="flex h-full flex-col">
              <div className="flex items-center gap-2 border-b border-border/50 p-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/80">
                  <Bot className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="text-lg font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                  ChatBot Builder
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-auto"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <X className="h-5 w-5" />
                  <span className="sr-only">Close</span>
                </Button>
              </div>
              <div className="flex-1 overflow-auto py-2">
                <nav className="grid gap-1 px-2">
                  {routes.map((route) => (
                    <Link
                      key={route.href}
                      href={route.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                        route.active
                          ? "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg neon-glow"
                          : "hover:bg-gradient-to-r hover:from-muted/50 hover:to-muted/20"
                      }`}
                    >
                      <route.icon className="h-5 w-5" />
                      {route.label}
                    </Link>
                  ))}
                </nav>
              </div>
              <div className="border-t border-border/50 p-4">
                <div className="flex items-center gap-3 rounded-lg px-3 py-2">
                  <Avatar className="h-9 w-9 ring-2 ring-primary/20">
                    {session && (
                      <AvatarImage
                        src={session?.user?.image ?? undefined}
                        alt="Avatar"
                      />
                    )}
                    <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10">
                      JD
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">
                      {session?.user?.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {session?.user?.email}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
        <Link href="/dashboard" className="flex items-center gap-2 font-bold">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/80">
            <Bot className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="hidden md:inline-block bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            ChatBot Builder
          </span>
        </Link>
        <div className="relative ml-auto flex-1 md:grow-0 md:basis-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={t("search")}
            className="w-full rounded-lg glass-effect border-border/50 pl-8 md:w-72 focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div className="flex items-center gap-2">
          <TokenCounterCompact />
          <ModeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="relative glass-effect"
              >
                <Globe className="h-5 w-5" />
                <span className="sr-only">Cambiar idioma</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="glass-effect">
              <DropdownMenuItem
                onClick={() => changeLanguageWithUrl("es")}
                className="flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  <span>🇪🇸</span>
                  <span>Español</span>
                </span>
                {language === "es" && <Check className="h-4 w-4" />}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => changeLanguageWithUrl("en")}
                className="flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  <span>🇺🇸</span>
                  <span>English</span>
                </span>
                {language === "en" && <Check className="h-4 w-4" />}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="relative glass-effect"
              >
                <Bell className="h-5 w-5" />
                {hasNotifications && (
                  <span className="absolute right-1 top-1 flex h-2 w-2 rounded-full bg-gradient-to-r from-primary to-primary/80" />
                )}
                <span className="sr-only">Notificaciones</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 glass-effect">
              <div className="flex items-center justify-between p-2 border-b border-border/50">
                <h4 className="font-medium">Notificaciones</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs h-auto py-1"
                >
                  Marcar todas como leídas
                </Button>
              </div>
              {notifications.map((notification) => (
                <DropdownMenuItem key={notification.id} className="p-0">
                  <div className="flex flex-col w-full p-3 cursor-pointer hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{notification.title}</span>
                      <Badge
                        variant={
                          notification.type === "billing"
                            ? "default"
                            : notification.type === "warning"
                            ? "destructive"
                            : "outline"
                        }
                        className="text-xs"
                      >
                        {notification.type === "billing"
                          ? "Facturación"
                          : notification.type === "warning"
                          ? "Advertencia"
                          : "Soporte"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {notification.description}
                    </p>
                    <span className="text-xs text-muted-foreground mt-2">
                      {notification.date}
                    </span>
                  </div>
                </DropdownMenuItem>
              ))}
              <div className="p-2 border-t border-border/50">
                <Button variant="outline" size="sm" className="w-full">
                  Ver todas las notificaciones
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          <Avatar className="h-9 w-9 ring-2 ring-primary/20">
            {session && (
              <AvatarImage
                src={session?.user?.image ?? undefined}
                alt="Avatar"
              />
            )}
            <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10">
              JD
            </AvatarFallback>
          </Avatar>
        </div>
      </header>
      <div className="flex flex-1">
        {/* Navegador lateral mejorado */}
        <aside className="hidden w-64 border-r border-border/50 bg-background/80 md:block md:h-screen md:fixed md:left-0 md:top-0 md:z-20">
          <div className="flex h-full flex-col">
            <div className="flex-1 overflow-auto py-4 md:pt-20">
              <div className="px-3 pb-2">
                <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                  Navegación
                </h2>
                <div className="space-y-1">
                  {routes.map((route) => (
                    <Link
                      key={route.href}
                      href={route.href}
                      className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 ${
                        route.active
                          ? "bg-primary text-primary-foreground shadow-md"
                          : "text-foreground hover:bg-muted"
                      }`}
                    >
                      <route.icon
                        className={`h-5 w-5 ${
                          route.active
                            ? "text-primary-foreground"
                            : "text-muted-foreground"
                        }`}
                      />
                      {route.label}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="px-3 py-2">
                <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                  Acciones rápidas
                </h2>
                <div className="space-y-1">
                  <Button
                    variant="ghost"
                    className="w-full justify-start px-4 py-2 h-auto"
                  >
                    <Bot className="mr-2 h-5 w-5 text-muted-foreground" />
                    Crear nuevo bot
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start px-4 py-2 h-auto"
                  >
                    <BarChart3 className="mr-2 h-5 w-5 text-muted-foreground" />
                    Ver estadísticas
                  </Button>
                </div>
              </div>
            </div>
            <div className="border-t p-4 bg-background/95 backdrop-blur-sm">
              <div className="rounded-lg bg-muted p-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9 ring-2 ring-primary/20">
                    {session && (
                      <AvatarImage
                        src={session?.user?.image ?? undefined}
                        alt="Avatar"
                      />
                    )}
                    <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10">
                      AV
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="text-sm font-medium truncate">
                      {session?.user?.name}
                    </span>
                    <span className="text-xs text-muted-foreground truncate">
                      {session?.user?.email}
                    </span>
                  </div>
                  <div className="flex-shrink-0">
                    <Button
                      onClick={() => signOut()}
                      size="icon"
                      className="bg-primary aspect-square h-9 w-9"
                    >
                      <LogOut className="h-5 w-5" />
                      <span className="sr-only">Log out</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>
        <main className="flex-1 overflow-auto md:ml-64">{children}</main>
      </div>
    </div>
  );
}
