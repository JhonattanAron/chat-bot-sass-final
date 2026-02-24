// app/api/resend/create-domain/route.ts
// Create a new domain in Resend

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
    const { domain } = body;

    if (!domain) {
      return NextResponse.json(
        { error: "Domain is required" },
        { status: 400 },
      );
    }

    // Call Resend API to create domain
    const response = await fetch("https://api.resend.com/domains", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ domain }),
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { error: error.message || "Failed to create domain" },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error) {
    console.error("Create domain error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
