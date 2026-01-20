"use server"

interface Lead {
  email: string
  nombre_empresa: string
  fuente: string
  nivel_interes: "alto" | "medio" | "bajo"
  razon: string
}

interface CampaignResult {
  leads: Lead[] | null
  error?: string
}

export async function executeCampaign(): Promise<CampaignResult> {
  try {
    const textResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/source/text`, {
      cache: "no-store",
    })

    if (!textResponse.ok) {
      return { leads: null, error: "Error al obtener el texto de origen" }
    }

    const { text } = await textResponse.json()

    const aiResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/ai/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
      cache: "no-store",
    })

    if (!aiResponse.ok) {
      return { leads: null, error: "Error al analizar el texto con IA" }
    }

    const leads: Lead[] = await aiResponse.json()

    const emailResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/email/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ leads }),
      cache: "no-store",
    })

    if (!emailResponse.ok) {
      return { leads: null, error: "Error al enviar correos" }
    }

    return { leads }
  } catch (error) {
    return {
      leads: null,
      error: error instanceof Error ? error.message : "Error desconocido en el servidor",
    }
  }
}
