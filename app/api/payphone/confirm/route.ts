import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { id, clientTxId } = await req.json();

    const token = process.env.PAYPHONE_TOKEN;

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Token no configurado" },
        { status: 500 },
      );
    }

    const response = await fetch(
      "https://pay.payphonetodoesposible.com/api/button/V2/Confirm",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: Number(id),
          clientTxId: clientTxId,
        }),
      },
    );

    const text = await response.text();
    console.log("RESPUESTA CRUDA PAYPHONE:", text);

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: text },
        { status: response.status },
      );
    }

    const data = JSON.parse(text);

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("ERROR CONFIRM:", error);

    return NextResponse.json(
      { success: false, error: "Error interno confirmando pago" },
      { status: 500 },
    );
  }
}
