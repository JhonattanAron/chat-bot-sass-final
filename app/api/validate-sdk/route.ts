import { type NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { clientKey } = await req.json();

    // Validación básica
    if (!clientKey) {
      return NextResponse.json(
        { success: false, message: "Missing client key." },
        { status: 400 }
      );
    }

    // Llamar al backend NestJS para validar
    const response = await fetch(
      "http://localhost:8080/api-key-validate/validate-client-key",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientKey }),
      }
    );

    const result = await response.json();

    if (!response.ok || !result.success) {
      return NextResponse.json(
        { success: false, message: result.message || "Invalid key" },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { success: true, message: "SDK Validated successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error during SDK validation:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error during validation." },
      { status: 500 }
    );
  }
}
