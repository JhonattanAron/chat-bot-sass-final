import { NextRequest, NextResponse } from "next/server";
export const NEST_API_URL = process.env.NEST_API_URL || "http://localhost:8080";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { chatId, assistant_id, role, content } = body;

    if (!chatId || !assistant_id || !role || !content) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Missing required fields: chatId, assistant_id, role, and content are required",
          received: body,
        },
        { status: 400 }
      );
    }

    const response = await fetch(`${NEST_API_URL}/chat/message`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
