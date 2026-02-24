"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PaymentMethodsTab from "./tabs/payment-methods-tab";
import InvoicesTab from "./tabs/invoices-tab";
import { CreditCard, FileText, ShoppingCart } from "lucide-react";

export default function PaymentAdmin() {
  const [activeTab, setActiveTab] = useState("payment-methods");

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Centro de Pagos
          </h1>
          <p className="text-muted-foreground">
            Administra tu checkout, métodos de pago y facturación
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-card border border-border rounded-lg p-1">
            <TabsTrigger
              value="payment-methods"
              className="flex items-center gap-2"
            >
              <CreditCard className="w-4 h-4" />
              <span className="hidden sm:inline">Métodos de Pago</span>
            </TabsTrigger>
            <TabsTrigger value="invoices" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Facturación</span>
            </TabsTrigger>
          </TabsList>

          {/* Tab Contents */}

          <TabsContent value="payment-methods" className="mt-6">
            <PaymentMethodsTab />
          </TabsContent>

          <TabsContent value="invoices" className="mt-6">
            <InvoicesTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
