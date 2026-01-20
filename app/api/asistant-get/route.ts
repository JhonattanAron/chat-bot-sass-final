import { NextRequest, NextResponse } from "next/server";

// Cambia esto por la URL real de tu backend NestJS
const NEST_API_URL = process.env.NEST_API_URL || "http://localhost:3001";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const user_id = searchParams.get("user_id");
  const chat_id = searchParams.get("chat_id");
  if (!user_id || !chat_id) {
    return NextResponse.json(
      { error: "Missing user_id query parameter" },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `${NEST_API_URL}/users/assistant-chat?id=${encodeURIComponent(
        chat_id
      )}&user_id=${encodeURIComponent(user_id)}`
    );
    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || "Error fetching assistant chats" },
        { status: response.status }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
