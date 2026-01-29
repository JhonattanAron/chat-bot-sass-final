"use client";

import { Button } from "@/components/ui/button";

export function PayphoneButton({ amount, reference, email }: any) {
  const handlePay = async () => {
    const popup = window.open("", "payphone-popup", "width=500,height=700");

    if (!popup) {
      alert("Permite popups para procesar el pago");
      return;
    }

    // Pedimos al backend el HTML seguro
    const res = await fetch("/api/payphone/payment-html", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount, reference, email }),
    });
    const html = await res.text();

    popup.document.open();
    popup.document.write(html);
    popup.document.close();
  };

  return (
    <Button onClick={handlePay} size="lg" className="w-full">
      Pagar con PayPhone
    </Button>
  );
}
