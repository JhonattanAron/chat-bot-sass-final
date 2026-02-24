// app/api/resend/list-domains/route.ts
// List domains from Resend

import { NextRequest, NextResponse } from "next/server";
import { getApiKeyFromSession } from "@/store/session-store";

export async function GET(request: NextRequest) {
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

    // Call Resend API to list domains
    const response = await fetch("https://api.resend.com/domains", {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { error: error.message || "Failed to fetch domains" },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("List domains error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
