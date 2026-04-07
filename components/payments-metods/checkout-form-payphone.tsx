"use client";

import { Button } from "@/components/ui/button";

interface PayphoneButtonProps {
  amount: any;
  reference?: any;
  email: any;
  onBeforePay?: () => Promise<{ invoiceNumber?: string }>; // Función opcional a ejecutar antes del pago
}

export function PayphoneButton({
  amount,
  reference,
  email,
  onBeforePay,
}: PayphoneButtonProps) {
  const handlePay = async () => {
    try {
      // 1️⃣ Ejecutar la función que venga desde el front (ej: createInvoice)
      let dynamicReference = reference;
      if (onBeforePay) {
        const result = await onBeforePay();
        if (result?.invoiceNumber) {
          dynamicReference = result.invoiceNumber; // usamos la referencia de la factura creada
        }
      }

      // 2️⃣ Abrir popup de PayPhone
      const popup = window.open("", "payphone-popup", "width=500,height=700");
      if (!popup) {
        alert("Permite popups para procesar el pago");
        return;
      }

      // 3️⃣ Pedimos al backend el HTML seguro
      const res = await fetch("/api/payphone/payment-html", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          reference: dynamicReference || "ORD_" + Date.now(),
          email,
        }),
      });

      const html = await res.text();
      popup.document.open();
      popup.document.write(html);
      popup.document.close();
    } catch (error) {
      console.error("Error en PayPhone:", error);
      alert("Error al procesar el pago: " + error);
    }
  };

  return (
    <Button onClick={handlePay} size="lg" className="w-full">
      Pagar con PayPhone
    </Button>
  );
}
