// For full subscription capabilities, see capture-order.ts comments
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { planId, planName, amount, email } = await request.json();

    console.log("Creating PayPal order:", { planId, planName, amount });

    const response = await fetch(
      `${process.env.PAYPAL_BASE_URL}/v2/checkout/orders`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await getPayPalToken()}`,
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
            return_url: `${
              process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
            }/checkout/success`,
            cancel_url: `${
              process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
            }/checkout`,
          },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      console.error("PayPal error:", error);
      return NextResponse.json(error, { status: response.status });
    }

    const order = await response.json();
    console.log("Order created:", order.id);

    return NextResponse.json({ id: order.id });
  } catch (error: any) {
    console.error("Create order error:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

async function getPayPalToken() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("PayPal credentials not configured");
  }

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const response = await fetch(
    `${process.env.PAYPAL_BASE_URL}/v1/oauth2/token`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to get PayPal token");
  }

  const data = await response.json();
  return data.access_token;
}
