import { NextRequest, NextResponse } from "next/server";

const NEST_API_URL = process.env.NEST_API_URL || "http://localhost:8080";

// GET /api/products-tasks?user_id=xxx  --> findAll
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const user_id = searchParams.get("user_id");
  const assistant_id = searchParams.get("assistant_id");
  const id = searchParams.get("id");

  try {
    // Si hay id, busca uno solo (findOne)
    if (id) {
      const response = await fetch(`${NEST_API_URL}/products/${id}`);
      const data = await response.json();
      return NextResponse.json(data, { status: response.status });
    }

    // Si no hay id, busca todos (findAll)
    if (!user_id || !assistant_id) {
      return NextResponse.json(
        { error: "Missing user_id query parameter" },
        { status: 400 }
      );
    }
    const response = await fetch(
      `${NEST_API_URL}/products?user_id=${encodeURIComponent(
        user_id
      )}&assistant_id=${encodeURIComponent(assistant_id)}`
    );
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT /api/products-tasks?id=xxx
export async function PUT(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const user_id = searchParams.get("user_id");
  if (!id || !user_id) {
    return NextResponse.json(
      { error: "Missing id query parameter" },
      { status: 400 }
    );
  }
  try {
    const body = await req.json();
    const response = await fetch(
      `${NEST_API_URL}/products/${id}?user_id=${encodeURIComponent(user_id)}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    );
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/products-tasks?id=xxx
export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json(
      { error: "Missing id query parameter" },
      { status: 400 }
    );
  }
  try {
    const response = await fetch(`${NEST_API_URL}/products/${id}`, {
      method: "DELETE",
    });
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
