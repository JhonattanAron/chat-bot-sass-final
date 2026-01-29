import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { planId, planName, amount, email } = await req.json();

    if (!planId || !planName || !amount || !email) {
      return NextResponse.json(
        { message: "Missing parameters" },
        { status: 400 },
      );
    }

    const token = await getPayPalToken();

    const res = await fetch(
      `${process.env.PAYPAL_BASE_URL}/v2/checkout/orders`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          intent: "CAPTURE",
          purchase_units: [
            {
              amount: {
                currency_code: "USD",
                value: Number(amount).toFixed(2),
              },
              description: `${planName} - ${email}`,
              custom_id: planId.toString().slice(0, 127),
            },
          ],
          application_context: {
            return_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/cancel`,
            brand_name: "Mi Empresa",
            user_action: "PAY_NOW",
          },
        }),
      },
    );

    const data = await res.json();

    if (!res.ok) {
      console.error("PayPal error:", data);
      return NextResponse.json(data, { status: res.status });
    }

    // Aquí sacamos el link de aprobación
    const approveLink = data.links.find((l: any) => l.rel === "approve")?.href;

    if (!approveLink) {
      console.error("No se recibió link de aprobación", data);
      return NextResponse.json(
        { message: "No se recibió link de aprobación" },
        { status: 500 },
      );
    }

    return NextResponse.json({ approveLink });
  } catch (err: any) {
    console.error("Create order error:", err);
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
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

  if (!res.ok) throw new Error("Failed to get PayPal token");

  const data = await res.json();
  return data.access_token;
}
