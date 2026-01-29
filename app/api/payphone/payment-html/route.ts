import { env } from "@/env";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { amount, reference, email } = await req.json();
  const totalCents = Math.round(amount * 100);

  // Definimos impuestos y cargos
  const tax = 15; // en centavos
  const service = 0;
  const tip = 0;

  // Dividimos el monto en con/sin impuesto
  const amountWithTax = Math.floor(totalCents * 0.3); // 30% con impuesto
  const amountWithoutTax = totalCents - amountWithTax - tax - service - tip;

  if (!amount || !reference || !email) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  // Generamos el HTML seguro en el backend
  const html = `
<!doctype html>
<html lang="es">
  <head>
    <link
      rel="stylesheet"
      href="https://cdn.payphonetodoesposible.com/box/v1.1/payphone-payment-box.css"
    />
    <script
      type="module"
      src="https://cdn.payphonetodoesposible.com/box/v1.1/payphone-payment-box.js"
    ></script>
  </head>
  <body>
    <script>
      window.addEventListener("DOMContentLoaded", () => {
        new PPaymentButtonBox({
          token: "${env.PAYPHONE_TOKEN}",  
          storeId: "${env.PAYPHONE_STORE_ID}",
          clientTransactionId: "order-${Date.now()}",
          amount: ${totalCents},
          amountWithoutTax: ${amountWithoutTax}, 
          amountWithTax: ${amountWithTax},   
          tax: ${tax},
          service: ${service},
          tip: ${tip},
          currency: "USD",
          reference: "${reference}",
          email: "${email}",
          defaultMethod: "card",
          lang: "es",
          timeZone: -5,
          lat: "-1.831239",
          lng: "-78.183406",
          optionalParameter: "Parametro opcional",
          phoneNumber: "+593999999999",
          documentId: "1234567890",
          identificationType: 1
        }).render("pp-button");
      });
    </script>
    <div id="pp-button"></div>
  </body>
</html>
`;

  return new Response(html, {
    headers: { "Content-Type": "text/html" },
  });
}
