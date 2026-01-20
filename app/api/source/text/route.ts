import { NextResponse } from "next/server"

export async function GET() {
  const mockText = `
    Contacto: contacto@empresa1.com - Empresa X - Servicios de consultoría
    Email: info@tech-startup.io - TechStartup Inc - Soluciones de software
    correo: ventas@marketing-pro.es - MarketingPro - Agencia de marketing digital
    contacto@empresa3.com - Enterprise Solutions Ltd - Consultoría empresarial
    support@digital-agency.com - Digital Agency - Diseño web y branding
  `

  return NextResponse.json({ text: mockText })
}
