// app/api/resend/disconnect/route.ts
// End session and remove API key from memory

import { NextRequest, NextResponse } from "next/server";
import { deleteSession } from "@/store/session-store";

export async function POST(request: NextRequest) {
  try {
    const sessionId = request.cookies.get("sessionId")?.value;

    if (!sessionId) {
      return NextResponse.json({ error: "No active session" }, { status: 400 });
    }

    // Delete session from memory
    const deleted = deleteSession(sessionId);

    const response = NextResponse.json(
      {
        success: deleted,
        message: deleted ? "Disconnected" : "Session not found",
      },
      { status: deleted ? 200 : 404 },
    );

    // Clear cookie
    response.cookies.set("sessionId", "", {
      maxAge: 0,
    });

    return response;
  } catch (error) {
    console.error("Disconnect error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
