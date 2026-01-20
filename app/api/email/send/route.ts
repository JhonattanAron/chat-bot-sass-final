import { NextResponse } from "next/server";

interface Lead {
  email: string;
  nombre_empresa: string;
  fuente: string;
  nivel_interes: "alto" | "medio" | "bajo";
  razon: string;
}

export async function POST(request: Request) {
  try {
    const { leads } = await request.json();

    if (!leads || !Array.isArray(leads)) {
      return NextResponse.json(
        { error: "Leads no proporcionados" },
        { status: 400 }
      );
    }

    // Mock email sending result
    const emailResults = leads.map((lead: Lead) => ({
      email: lead.email,
      empresa: lead.nombre_empresa,
      estado: Math.random() > 0.2 ? "enviado" : "fallido",
      fecha_envio: new Date().toISOString(),
    }));

    return NextResponse.json(emailResults);
  } catch (error) {
    return NextResponse.json(
      { error: "Error al procesar la solicitud" },
      { status: 500 }
    );
  }
}

/**
 import { NextResponse } from "next/server"

interface Lead {
  email: string
  nombre_empresa: string
  nivel_interes: "alto" | "medio" | "bajo"
  razon: string
}

export async function POST(req: Request) {
  try {
    const { leads, userId } = await req.json()

    if (!Array.isArray(leads) || !userId) {
      return NextResponse.json(
        { error: "Datos inválidos" },
        { status: 400 }
      )
    }

    const results = []

    for (const lead of leads) {
      // 1️⃣ Generar correo con IA
      const prompt = `
Empresa: ${lead.nombre_empresa}
Nivel de interés: ${lead.nivel_interes}
Razón: ${lead.razon}

Redacta un correo profesional ofreciendo servicios digitales.
`

      const aiResponse = await fetch(
        "http://localhost:8081/chat/model/predict",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            prompt,
          }),
        }
      )

      const { text } = await aiResponse.json()

      // 2️⃣ Enviar correo (ejemplo conceptual)
      try {
        await sendEmail({
          to: lead.email,
          subject: `Propuesta para ${lead.nombre_empresa}`,
          html: text,
        })

        results.push({
          email: lead.email,
          empresa: lead.nombre_empresa,
          estado: "enviado",
          fecha_envio: new Date().toISOString(),
        })
      } catch {
        results.push({
          email: lead.email,
          empresa: lead.nombre_empresa,
          estado: "fallido",
          fecha_envio: new Date().toISOString(),
        })
      }
    }

    return NextResponse.json(results)
  } catch (error) {
    return NextResponse.json(
      { error: "Error interno" },
      { status: 500 }
    )
  }
}
 */
