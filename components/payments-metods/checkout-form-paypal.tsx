"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface PayPalButtonProps {
  planId: string;
  planName: string;
  amount: number;
  email: string;
}

export function PayPalButton({
  planId,
  planName,
  amount,
  email,
}: PayPalButtonProps) {
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/paypal/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId, planName, amount, email }),
      });
      const data = await res.json();
      console.log(data);

      // Abrimos el popup inmediatamente con URL vacía
      const popup = window.open("", "paypal-popup", "width=500,height=700");
      if (!popup) {
        alert("Permite popups en tu navegador");
        return;
      }

      // Creamos la orden en backend

      if (!res.ok) throw new Error(data.message || "Error al crear la orden");
      console.log(data.approveLink);

      if (!data.approveLink)
        throw new Error("No se recibió link de aprobación");

      // Redirigimos el popup al link de PayPal
      popup.location.href = data.approveLink;
    } catch (err: any) {
      console.error(err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button size="lg" className="w-full" disabled={loading} onClick={handlePay}>
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
          Procesando...
        </>
      ) : (
        "Pagar con PayPal / Tarjeta"
      )}
    </Button>
  );
}
