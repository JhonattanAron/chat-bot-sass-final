import { NextRequest, NextResponse } from "next/server";

const NEST_API_URL = process.env.NEST_API_URL || "http://localhost:3001";

// PUT: Actualizar función
export async function PUT(
  req: NextRequest,
  { params }: { params: { functionId: string } }
) {
  try {
    const body = await req.json();
    const { functionId } = params;
    const response = await fetch(
      `${NEST_API_URL}/users/functions/${functionId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
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

// DELETE: Eliminar función
export async function DELETE(
  req: NextRequest,
  { params }: { params: { functionId: string } }
) {
  try {
    const { searchParams } = new URL(req.url);
    const user_id = searchParams.get("user_id");
    const assistant_id = searchParams.get("assistant_id");
    const { functionId } = params;

    if (!user_id || !assistant_id) {
      return NextResponse.json(
        { error: "Missing parameters" },
        { status: 400 }
      );
    }

    const url = `${NEST_API_URL}/users/functions/${functionId}?user_id=${encodeURIComponent(
      user_id
    )}&assistant_id=${encodeURIComponent(assistant_id)}`;

    const response = await fetch(url, { method: "DELETE" });
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
