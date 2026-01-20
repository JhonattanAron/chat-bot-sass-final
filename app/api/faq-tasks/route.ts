import { NextRequest, NextResponse } from "next/server";

const NEST_API_URL = process.env.NEST_API_URL || "http://localhost:8080";

// POST: Crear FAQs
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const response = await fetch(`${NEST_API_URL}/faqs`, {
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

// GET: Obtener FAQs
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
      `${NEST_API_URL}/faqs?user_id=${encodeURIComponent(
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

// PUT: Actualizar FAQ
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const response = await fetch(`${NEST_API_URL}/faqs`, {
      method: "PUT",
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

// DELETE: Eliminar FAQ
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const user_id = searchParams.get("user_id");
    const assistant_id = searchParams.get("assistant_id");
    const faqId = searchParams.get("faqId");

    if (!user_id || !assistant_id || !faqId) {
      return NextResponse.json(
        { error: "Missing parameters" },
        { status: 400 }
      );
    }

    const response = await fetch(
      `${NEST_API_URL}/faqs?user_id=${encodeURIComponent(
        user_id
      )}&assistant_id=${encodeURIComponent(
        assistant_id
      )}&faqId=${encodeURIComponent(faqId)}`,
      { method: "DELETE" }
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
