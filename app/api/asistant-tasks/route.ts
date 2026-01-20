import { NextRequest, NextResponse } from "next/server";

// Cambia esto por la URL real de tu backend NestJS
const NEST_API_URL = process.env.NEST_API_URL || "http://localhost:8081";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const user_id = searchParams.get("user_id");

  if (!user_id) {
    return NextResponse.json(
      { error: "Missing user_id query parameter" },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `${NEST_API_URL}/users/assistant-chats?user_id=${encodeURIComponent(
        user_id
      )}`
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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validar campos requeridos
    const requiredFields = [
      "user_id",
      "name",
      "description",
      "funciones",
      "type",
      "status",
      "use_case",
      "welcome_message",
    ];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Llama al endpoint de NestJS
    const response = await fetch(`${NEST_API_URL}/users/assistant-chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || "Error creating assistant chat" },
        { status: response.status }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...updateFields } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Missing assistant chat id" },
        { status: 400 }
      );
    }

    // Llama al endpoint de actualización de tu backend (ajusta la ruta según tu API)
    const response = await fetch(`${NEST_API_URL}/users/assistant-chat/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updateFields),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || "Error updating assistant chat" },
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

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "Missing assistant chat id" },
        { status: 400 }
      );
    }

    // Llama al endpoint de eliminación de tu backend (ajusta la ruta según tu API)
    const response = await fetch(`${NEST_API_URL}/users/assistant-chat/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || "Error deleting assistant chat" },
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
