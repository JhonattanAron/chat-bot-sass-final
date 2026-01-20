import { NextRequest, NextResponse } from "next/server";

const NEST_API_URL = process.env.NEST_API_URL || "http://localhost:3001";

// POST: Crear función
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const response = await fetch(`${NEST_API_URL}/users/functions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET: Obtener funciones
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const user_id = searchParams.get("user_id");
    const assistant_id = searchParams.get("assistant_id");

    if (!user_id || !assistant_id) {
      return NextResponse.json(
        { error: "Missing parameters" },
        { status: 400 }
      );
    }

    const response = await fetch(
      `${NEST_API_URL}/users/functions?user_id=${encodeURIComponent(
        user_id
      )}&assistant_id=${encodeURIComponent(assistant_id)}`
    );
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
