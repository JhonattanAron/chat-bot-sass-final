import { DashboardHeader } from "@/components/batch/dashboard-header";
import { BatchList } from "@/components/batch/batch-list";
import { CreateBatchDialog } from "@/components/batch/create-batch-dialog";
import { DashboardLayout } from "@/components/dashboard-layout";
import { PlansCheckout } from "@/components/checkout-form";

export default async function BillingPage() {
  const DEMO_PLANS = [
    {
      id: "plan-1",
      name: "Básico",
      description: "Ideal para pequeños negocios y emprendedores",
      price: 54,
      interval: "yearly" as const,
      discount: "10%",
      features: [
        "$54/año",
        "10% de descuento",
        "Tokens totales: 10.0M",
        "Conversaciones/mes: 240",
        "Conversaciones/día: ~8",
        "Tokens/conversación: 40K",
        "Costo por token: $0.00000050",
        "1 chatbot activo",
        "Integración web básica",
        "Respuestas automáticas",
        "Personalización básica",
        "Soporte por email",
      ],
    },
    {
      id: "plan-2",
      name: "Estándar",
      description: "Perfecto para negocios en crecimiento",
      price: 97,
      interval: "yearly" as const,
      discount: "10%",
      highlighted: true,
      features: [
        "$97/año",
        "10% de descuento",
        "Tokens totales: 23.0M",
        "Conversaciones/mes: 570",
        "Conversaciones/día: ~19",
        "Tokens/conversación: 40K",
        "Costo por token: $0.00000039",
        "Comienza con Estándar",
        "2 chatbots activos",
        "Integración web completa",
        "Integración WhatsApp Business",
        "Personalización avanzada",
        "Soporte prioritario",
        "Analíticas básicas",
      ],
    },
    {
      id: "plan-3",
      name: "Avanzado",
      description: "Para negocios establecidos con mayor demanda",
      price: 238,
      interval: "yearly" as const,
      discount: "10%",
      features: [
        "$238/año",
        "10% de descuento",
        "Tokens totales: 60.0M",
        "Conversaciones/mes: 1500",
        "Conversaciones/día: ~50",
        "Tokens/conversación: 40K",
        "Costo por token: $0.00000037",
        "Comienza con Avanzado",
        "5 chatbots activos",
        "Integraciones personalizadas",
        "API básica",
        "Personalización completa",
        "Soporte prioritario",
        "Analíticas detalladas",
        "Entrenamiento básico",
      ],
    },
    {
      id: "plan-4",
      name: "Pro",
      description: "Para grandes empresas con necesidades específicas",
      price: 486,
      interval: "yearly" as const,
      discount: "10%",
      features: [
        "$486/año",
        "10% de descuento",
        "Tokens totales: 140.0M",
        "Conversaciones/mes: 3480",
        "Conversaciones/día: ~116",
        "Tokens/conversación: 40K",
        "Costo por token: $0.00000032",
        "Comienza con Pro",
        "Chatbots ilimitados",
        "Integraciones avanzadas",
        "API completa",
        "Personalización total",
        "Soporte 24/7 dedicado",
        "Analíticas avanzadas",
        "Entrenamiento personalizado",
      ],
    },
  ];

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <DashboardLayout>
        <div className="p-4">
          <PlansCheckout plans={DEMO_PLANS} />
        </div>
      </DashboardLayout>
    </div>
  );
}
