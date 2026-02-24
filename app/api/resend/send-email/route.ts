// app/api/resend/send-email/route.ts
// Send email through Resend API

import { NextRequest, NextResponse } from "next/server";
import { getApiKeyFromSession } from "@/store/session-store";

export async function POST(request: NextRequest) {
  try {
    const sessionId = request.cookies.get("sessionId")?.value;

    if (!sessionId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const apiKey = getApiKeyFromSession(sessionId);
    if (!apiKey) {
      return NextResponse.json(
        { error: "Session expired or invalid" },
        { status: 401 },
      );
    }

    const body = await request.json();
    const { to, subject, html, text, from, replyTo } = body;

    if (!to || !subject) {
      return NextResponse.json(
        { error: "Missing required fields: to, subject" },
        { status: 400 },
      );
    }

    // Call Resend API
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: from || "onboarding@resend.dev",
        to,
        subject,
        html: html || text,
        reply_to: replyTo,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { error: error.message || "Failed to send email" },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    console.error("Send email error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
