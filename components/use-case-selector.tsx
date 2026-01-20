"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Utensils,
  ShoppingBag,
  HeadphonesIcon,
  Home,
  Calendar,
  Building2,
  Briefcase,
  GraduationCap,
  ShoppingCart,
  Truck,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface UseCaseOption {
  value: string;
  label: string;
  icon: React.ElementType;
  description: string;
}

interface UseCaseSelectorProps {
  value: string;
  onChange: (value: string) => void;
  language?: "en" | "es";
}

export function UseCaseSelector({
  value,
  onChange,
  language = "en",
}: UseCaseSelectorProps) {
  const [open, setOpen] = useState(false);

  const useCases: UseCaseOption[] = [
    {
      value: "restaurant",
      label: language === "en" ? "Restaurant" : "Restaurante",
      icon: Utensils,
      description:
        language === "en"
          ? "For restaurants, cafes, and food delivery services"
          : "Para restaurantes, cafeterías y servicios de entrega de comida",
    },
    {
      value: "onlineStore",
      label: language === "en" ? "Online Store" : "Tienda Online",
      icon: ShoppingBag,
      description:
        language === "en"
          ? "For e-commerce and online retail businesses"
          : "Para comercio electrónico y negocios minoristas en línea",
    },
    {
      value: "customerSupport",
      label: language === "en" ? "Customer Support" : "Atención al Cliente",
      icon: HeadphonesIcon,
      description:
        language === "en"
          ? "For customer service and support teams"
          : "Para equipos de servicio y soporte al cliente",
    },
    {
      value: "realEstate",
      label: language === "en" ? "Real Estate" : "Bienes Raíces",
      icon: Home,
      description:
        language === "en"
          ? "For real estate agencies and property management"
          : "Para agencias inmobiliarias y administración de propiedades",
    },
    {
      value: "appointments",
      label: language === "en" ? "Appointments" : "Gestión de Citas",
      icon: Calendar,
      description:
        language === "en"
          ? "For healthcare, salons, and service scheduling"
          : "Para salud, salones y programación de servicios",
    },
    {
      value: "corporate",
      label: language === "en" ? "Corporate" : "Corporativo",
      icon: Building2,
      description:
        language === "en"
          ? "For corporate websites and business services"
          : "Para sitios web corporativos y servicios empresariales",
    },
    {
      value: "professional",
      label:
        language === "en" ? "Professional Services" : "Servicios Profesionales",
      icon: Briefcase,
      description:
        language === "en"
          ? "For lawyers, consultants, and other professionals"
          : "Para abogados, consultores y otros profesionales",
    },
    {
      value: "education",
      label: language === "en" ? "Education" : "Educación",
      icon: GraduationCap,
      description:
        language === "en"
          ? "For schools, universities, and online courses"
          : "Para escuelas, universidades y cursos en línea",
    },
    {
      value: "retail",
      label: language === "en" ? "Retail" : "Comercio Minorista",
      icon: ShoppingCart,
      description:
        language === "en"
          ? "For physical retail stores and showrooms"
          : "Para tiendas físicas y salas de exposición",
    },
    {
      value: "logistics",
      label: language === "en" ? "Logistics" : "Logística",
      icon: Truck,
      description:
        language === "en"
          ? "For shipping, delivery, and logistics services"
          : "Para servicios de envío, entrega y logística",
    },
  ];

  const selectedUseCase =
    useCases.find((useCase) => useCase.value === value) || useCases[0];

  const handleSelect = (useCaseValue: string) => {
    onChange(useCaseValue);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-start text-left font-normal h-auto py-3"
        >
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-md border bg-muted">
              <selectedUseCase.icon className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium">
                {selectedUseCase.label}
              </span>
              <span className="text-xs text-muted-foreground">
                {selectedUseCase.description}
              </span>
            </div>
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] h-[500px] flex flex-col border-0 bg-white dark:bg-black">
        <DialogHeader className="flex-shrink-0 text-center pb-6">
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            {language === "en" ? "Select Use Case" : "Seleccionar Caso de Uso"}
          </DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-3 gap-4 p-2">
            {useCases.map((useCase) => (
              <Button
                key={useCase.value}
                variant="ghost"
                className={cn(
                  "h-24 flex flex-col items-center justify-center gap-3 p-4 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg border border-transparent",
                  value === useCase.value
                    ? "bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 shadow-md"
                    : "hover:bg-gradient-to-br hover:from-muted/50 hover:to-muted/20 hover:border-muted-foreground/10"
                )}
                onClick={() => handleSelect(useCase.value)}
              >
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300",
                    value === useCase.value
                      ? "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg"
                      : "bg-gradient-to-br from-muted to-muted/80 text-muted-foreground"
                  )}
                >
                  <useCase.icon className="h-5 w-5" />
                </div>
                <span
                  className={cn(
                    "text-sm font-medium text-center leading-tight transition-colors duration-300",
                    value === useCase.value ? "text-primary" : "text-foreground"
                  )}
                >
                  {useCase.label}
                </span>
              </Button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
