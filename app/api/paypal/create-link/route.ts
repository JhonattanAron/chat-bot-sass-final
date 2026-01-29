import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { planId, planName, amount, email } = await req.json();

  const token = await getPayPalToken();

  const res = await fetch(`${process.env.PAYPAL_BASE_URL}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: { currency_code: "USD", value: Number(amount).toFixed(2) },
          description: `${planName} - ${email}`,
          custom_id: planId.toString().slice(0, 127),
        },
      ],
      application_context: {
        return_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/cancel`,
      },
    }),
  });

  if (!res.ok) {
    const error = await res.json();
    return NextResponse.json({ error }, { status: res.status });
  }

  const data = await res.json();

  // Devuelve el link de aprobación para abrir en popup
  const approvalUrl = data.links.find((l: any) => l.rel === "approve")?.href;

  return NextResponse.json({ approvalUrl });
}

async function getPayPalToken() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const res = await fetch(`${process.env.PAYPAL_BASE_URL}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  const data = await res.json();
  return data.access_token;
}
