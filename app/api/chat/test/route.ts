import { NextRequest, NextResponse } from "next/server";
import { NEST_API_URL } from "../message/route";

export async function POST(req: NextRequest) {
  const body = await req.json();

  try {
    const response = await fetch(`${NEST_API_URL}/chat/test`, {
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
