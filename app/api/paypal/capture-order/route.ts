// NOTE: For real subscription management, you would:
// 1. Create a Billing Plan in PayPal (requires template setup)
// 2. Create a subscription against that plan
// 3. Store subscription ID in your database
// 4. Use webhooks to handle subscription events (billing.subscription.created, billing.subscription.updated, etc.)
// This current implementation handles one-time payments that you can track as subscriptions in your database

import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { orderId, email, planId, planName, amount } = await request.json();

    console.log("[v0] Capturing PayPal order:", orderId);

    const response = await fetch(
      `${process.env.PAYPAL_BASE_URL}/v2/checkout/orders/${orderId}/capture`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await getPayPalToken()}`,
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      console.error("[v0] PayPal capture error:", error);
      return NextResponse.json(error, { status: response.status });
    }

    const order = await response.json();
    console.log("[v0] Order captured:", order.id);

    // Example database operation:
    // await db.subscriptions.create({
    //   email,
    //   planId,
    //   planName,
    //   amount,
    //   paypalOrderId: orderId,
    //   status: 'active',
    //   startDate: new Date(),
    //   renewalDate: calculateRenewalDate(planId),
    //   createdAt: new Date(),
    // })

    return NextResponse.json({
      success: true,
      orderId: order.id,
      email,
      plan: planName,
      amount,
    });
  } catch (error: any) {
    console.error("[v0] Capture order error:", error);
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
