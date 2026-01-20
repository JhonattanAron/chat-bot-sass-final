import { NextResponse } from "next/server"

interface Lead {
  email: string
  nombre_empresa: string
  fuente: string
  nivel_interes: "alto" | "medio" | "bajo"
  razon: string
}

export async function POST(request: Request) {
  try {
    const { text } = await request.json()

    if (!text) {
      return NextResponse.json({ error: "Texto no proporcionado" }, { status: 400 })
    }

    // Mock extraction of leads
    const mockLeads: Lead[] = [
      {
        email: "contacto@empresa1.com",
        nombre_empresa: "Empresa X",
        fuente: "texto",
        nivel_interes: "alto",
        razon: "Búsqueda activa de consultoría",
      },
      {
        email: "info@tech-startup.io",
        nombre_empresa: "TechStartup Inc",
        fuente: "correo",
        nivel_interes: "alto",
        razon: "Startup en crecimiento, necesita soluciones",
      },
      {
        email: "ventas@marketing-pro.es",
        nombre_empresa: "MarketingPro",
        fuente: "web",
        nivel_interes: "medio",
        razon: "Agencia con demanda potencial",
      },
      {
        email: "contacto@empresa3.com",
        nombre_empresa: "Enterprise Solutions Ltd",
        fuente: "texto",
        nivel_interes: "alto",
        razon: "Enterprise con gran volumen",
      },
      {
        email: "support@digital-agency.com",
        nombre_empresa: "Digital Agency",
        fuente: "web",
        nivel_interes: "medio",
        razon: "Agencia digital en expansión",
      },
    ]

    return NextResponse.json(mockLeads)
  } catch (error) {
    return NextResponse.json({ error: "Error al procesar la solicitud" }, { status: 500 })
  }
}
