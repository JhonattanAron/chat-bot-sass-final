"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import {
  UtensilsCrossed,
  ShoppingBag,
  HeadphonesIcon,
  Building,
  CalendarClock,
  Briefcase,
  Shield,
  AlertTriangle,
} from "lucide-react"

const useCases = [
  {
    id: "restaurantes",
    title: "Restaurantes",
    icon: <UtensilsCrossed className="h-5 w-5" />,
    description:
      "Automatiza pedidos y reservas, responde preguntas sobre el menú y horarios, y mejora la experiencia de tus clientes.",
    image: "/placeholder.svg?height=400&width=600",
    features: [
      "Toma de pedidos automática",
      "Gestión de reservas",
      "Información sobre el menú",
      "Promociones personalizadas",
      "Seguimiento de pedidos",
    ],
    chatExample: [
      { role: "bot", message: "¡Hola! Bienvenido a Restaurante El Sabor. ¿En qué puedo ayudarte hoy?" },
      { role: "user", message: "¿Tienen mesas disponibles para esta noche?" },
      {
        role: "bot",
        message:
          "Sí, tenemos disponibilidad para esta noche. ¿Para cuántas personas y a qué hora le gustaría reservar?",
      },
      { role: "user", message: "Para 4 personas a las 8:30 PM" },
      {
        role: "bot",
        message:
          "¡Perfecto! He reservado una mesa para 4 personas hoy a las 8:30 PM. ¿Le gustaría ver nuestro menú mientras tanto?",
      },
    ],
  },
  {
    id: "tiendas",
    title: "Tiendas Online",
    icon: <ShoppingBag className="h-5 w-5" />,
    description:
      "Ofrece soporte y recomendaciones de productos, gestiona devoluciones y mantén a tus clientes informados sobre sus pedidos.",
    image: "/placeholder.svg?height=400&width=600",
    features: [
      "Recomendaciones de productos",
      "Estado de pedidos",
      "Gestión de devoluciones",
      "Respuestas a preguntas frecuentes",
      "Notificaciones de stock",
    ],
    chatExample: [
      { role: "bot", message: "¡Hola! Bienvenido a ModaExpress. ¿En qué puedo ayudarte hoy?" },
      { role: "user", message: "Estoy buscando una chaqueta de cuero" },
      {
        role: "bot",
        message:
          "Tenemos varias chaquetas de cuero disponibles. ¿Prefieres un estilo clásico o moderno? También puedo filtrar por color y talla.",
      },
      { role: "user", message: "Moderno, en negro, talla M" },
      {
        role: "bot",
        message:
          "He encontrado 3 chaquetas que coinciden con tu búsqueda. Te muestro la más popular: Chaqueta Biker Negra, talla M - $89.99. ¿Te gustaría ver más detalles o añadirla al carrito?",
      },
    ],
  },
  {
    id: "soporte",
    title: "Soporte al Cliente",
    icon: <HeadphonesIcon className="h-5 w-5" />,
    description:
      "Responde preguntas frecuentes de tus clientes de manera instantánea y escala a agentes humanos cuando sea necesario.",
    image: "/placeholder.svg?height=400&width=600",
    features: [
      "Respuestas automáticas 24/7",
      "Escalado a agentes humanos",
      "Base de conocimientos integrada",
      "Seguimiento de tickets",
      "Encuestas de satisfacción",
    ],
    chatExample: [
      { role: "bot", message: "¡Hola! Soy el asistente virtual de TechSupport. ¿Cómo puedo ayudarte hoy?" },
      { role: "user", message: "Mi dispositivo no enciende" },
      {
        role: "bot",
        message:
          "Lamento escuchar eso. Vamos a solucionar este problema. Primero, ¿has intentado mantener presionado el botón de encendido durante 10 segundos y luego soltarlo?",
      },
      { role: "user", message: "Sí, ya lo intenté y no funciona" },
      {
        role: "bot",
        message:
          "Entiendo. En ese caso, vamos a intentar conectarlo a otra fuente de alimentación. Si eso no funciona, puedo conectarte con un técnico especializado. ¿Te gustaría intentar primero la solución o prefieres hablar con un técnico?",
      },
    ],
  },
  {
    id: "inmobiliarias",
    title: "Inmobiliarias",
    icon: <Building className="h-5 w-5" />,
    description: "Gestiona consultas sobre propiedades, programa visitas y califica leads automáticamente.",
    image: "/placeholder.svg?height=400&width=600",
    features: [
      "Búsqueda de propiedades",
      "Programación de visitas",
      "Calificación de leads",
      "Información detallada",
      "Seguimiento automático",
    ],
    chatExample: [
      { role: "bot", message: "¡Hola! Soy el asistente virtual de InmoCasa. ¿En qué puedo ayudarte hoy?" },
      { role: "user", message: "Busco un apartamento de 2 habitaciones en el centro" },
      {
        role: "bot",
        message:
          "Tenemos 5 apartamentos de 2 habitaciones disponibles en el centro. ¿Tienes alguna preferencia en cuanto a precio o metros cuadrados?",
      },
      { role: "user", message: "Máximo 1200€ al mes" },
      {
        role: "bot",
        message:
          "Perfecto. He encontrado 3 apartamentos que se ajustan a tu presupuesto. El más destacado es un apartamento de 75m² por 1150€/mes. ¿Te gustaría ver más detalles o programar una visita?",
      },
    ],
  },
  {
    id: "citas",
    title: "Gestión de Citas",
    icon: <CalendarClock className="h-5 w-5" />,
    description: "Automatiza la programación de citas para consultorios médicos, salones de belleza y otros servicios.",
    image: "/placeholder.svg?height=400&width=600",
    features: [
      "Programación automática",
      "Recordatorios de citas",
      "Reprogramación sencilla",
      "Integración con calendario",
      "Confirmaciones automáticas",
    ],
    chatExample: [
      { role: "bot", message: "¡Hola! Soy el asistente virtual de Clínica Bienestar. ¿En qué puedo ayudarte hoy?" },
      { role: "user", message: "Necesito programar una cita con el Dr. García" },
      {
        role: "bot",
        message:
          "Claro, puedo ayudarte con eso. El Dr. García tiene disponibilidad el próximo martes a las 10:00 AM y el jueves a las 3:30 PM. ¿Alguna de estas opciones te funciona?",
      },
      { role: "user", message: "El martes a las 10 está bien" },
      {
        role: "bot",
        message:
          "¡Perfecto! He programado tu cita con el Dr. García para el próximo martes a las 10:00 AM. Te enviaré un recordatorio 24 horas antes. ¿Necesitas algo más?",
      },
    ],
  },
]

const UseCasesSection = () => {
  const [activeTab, setActiveTab] = useState("restaurantes")

  return (
    <section id="casos-de-uso" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">Casos de uso de nuestros chatbots</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Descubre cómo nuestros chatbots pueden adaptarse a diferentes industrias y necesidades
          </p>
        </div>

        <Tabs defaultValue="restaurantes" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-8">
            {useCases.map((useCase) => (
              <TabsTrigger
                key={useCase.id}
                value={useCase.id}
                className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow"
              >
                <span className="flex items-center">
                  <span className="mr-2">{useCase.icon}</span>
                  <span className="hidden md:inline">{useCase.title}</span>
                  <span className="md:hidden">{useCase.title.split(" ")[0]}</span>
                </span>
              </TabsTrigger>
            ))}
          </TabsList>

          {useCases.map((useCase) => (
            <TabsContent key={useCase.id} value={useCase.id} className="mt-0">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
              >
                <div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-900">Chatbot para {useCase.title}</h3>
                  <p className="text-gray-600 mb-6">{useCase.description}</p>

                  <ul className="space-y-2 mb-6">
                    {useCase.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <div className="h-2 w-2 rounded-full bg-primary mr-2"></div>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button className="bg-primary hover:bg-primary/90 text-white">Ver demostración</Button>
                </div>

                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                  <div className="p-4 bg-primary text-white font-medium">Ejemplo de conversación</div>
                  <div className="p-4 max-h-96 overflow-y-auto">
                    {useCase.chatExample.map((message, index) => (
                      <div key={index} className={`mb-4 ${message.role === "user" ? "text-right" : "text-left"}`}>
                        <div
                          className={`inline-block p-3 rounded-lg max-w-[80%] ${
                            message.role === "user" ? "bg-primary/10 text-gray-800" : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {message.message}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Asistente Virtual Empresarial - Sección Especial */}
        <div className="mt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-8 md:p-12 border border-primary/20"
          >
            <div className="flex items-center mb-6">
              <Briefcase className="h-8 w-8 text-primary mr-4" />
              <h3 className="text-3xl font-bold text-gray-900">Asistente Virtual Empresarial</h3>
            </div>

            <p className="text-xl text-gray-700 mb-4">Tu colaborador digital 24/7</p>

            <p className="text-gray-600 mb-8 text-lg leading-relaxed">
              Este asistente virtual no es solo un chatbot. Es un asistente inteligente que trabaja dentro de tu
              empresa, apoyando al equipo en tareas clave como si fuera un colaborador más. Actúa como un copiloto de
              operaciones capaz de interactuar con sistemas, bases de datos y plataformas internas para ayudarte a tomar
              decisiones, ahorrar tiempo y mantener el control.
            </p>

            {/* Advertencia técnica */}
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-8 flex items-start">
              <AlertTriangle className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-gray-900 font-medium mb-1">Configuración técnica requerida</p>
                <p className="text-gray-700 text-sm">
                  Este caso de uso requiere configuración avanzada y debe ser administrado por un desarrollador o
                  programador con conocimientos en APIs e integraciones de sistemas.
                </p>
              </div>
            </div>

            <h4 className="text-2xl font-semibold text-gray-900 mb-6">Funcionalidades principales:</h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="space-y-6">
                <div>
                  <h5 className="font-semibold text-primary mb-2 flex items-center">
                    <Shield className="h-4 w-4 mr-2" />
                    Verificación de seguridad digital
                  </h5>
                  <ul className="text-gray-600 space-y-1 text-sm">
                    <li>"¿Hubo intentos de acceso fallidos hoy?"</li>
                    <li>"¿Los sistemas están protegidos con doble autenticación?"</li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-semibold text-primary mb-2">Estado financiero y control de cuentas</h5>
                  <ul className="text-gray-600 space-y-1 text-sm">
                    <li>"¿Cuánto se ha cobrado esta semana?"</li>
                    <li>"¿Qué facturas siguen pendientes de pago?"</li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-semibold text-primary mb-2">Reportes y resúmenes automatizados</h5>
                  <ul className="text-gray-600 space-y-1 text-sm">
                    <li>"Genera el reporte de ventas mensual."</li>
                    <li>"Prepárame el resumen de rendimiento de cada área."</li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-semibold text-primary mb-2">Gestión de tareas y recordatorios</h5>
                  <ul className="text-gray-600 space-y-1 text-sm">
                    <li>"Agrega una tarea para revisar los contratos."</li>
                    <li>"Recuérdame hacer seguimiento a ese cliente el viernes."</li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-semibold text-primary mb-2">Análisis de desempeño y productividad</h5>
                  <ul className="text-gray-600 space-y-1 text-sm">
                    <li>"¿Qué empleado resolvió más tickets de soporte esta semana?"</li>
                    <li>"¿Cuántas visitas tuvo la web hoy?"</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h5 className="font-semibold text-primary mb-2">Soporte al área de Recursos Humanos</h5>
                  <ul className="text-gray-600 space-y-1 text-sm">
                    <li>"¿Quién está de vacaciones esta semana?"</li>
                    <li>"¿Cuántos días de permiso pidió Juan este mes?"</li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-semibold text-primary mb-2">Control de stock e inventario</h5>
                  <ul className="text-gray-600 space-y-1 text-sm">
                    <li>"¿Cuánto queda del producto estrella?"</li>
                    <li>"Envía alerta si hay menos de 10 unidades."</li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-semibold text-primary mb-2">Seguimiento a proyectos o clientes</h5>
                  <ul className="text-gray-600 space-y-1 text-sm">
                    <li>"¿En qué estado está el proyecto con el cliente Acme?"</li>
                    <li>"¿El equipo ya entregó la cotización?"</li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-semibold text-primary mb-2">Automatización de tareas diarias</h5>
                  <ul className="text-gray-600 space-y-1 text-sm">
                    <li>"Envía el resumen del día al canal de Slack del equipo."</li>
                    <li>"Cierra las tareas pendientes de la semana pasada."</li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-semibold text-primary mb-2">🆕 Verificación de cumplimiento legal</h5>
                  <ul className="text-gray-600 space-y-1 text-sm">
                    <li>"¿Hay documentos legales por renovar este mes?"</li>
                    <li>"¿Cumplimos con las políticas de privacidad actuales (GDPR)?"</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 border border-primary/20">
              <h5 className="font-semibold text-gray-900 mb-3">Integraciones disponibles:</h5>
              <p className="text-gray-600 mb-4">
                Este asistente puede ser accesible por voz, chat o panel web interno, y se integra con herramientas
                como:
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  "Slack",
                  "Microsoft Teams",
                  "Notion",
                  "Google Drive",
                  "Trello",
                  "Asana",
                  "Zapier",
                  "APIs personalizadas",
                ].map((tool) => (
                  <span key={tool} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                    {tool}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-8 text-center">
              <p className="text-gray-600 mb-4">
                Ideal para pequeñas y medianas empresas que quieren optimizar procesos sin contratar más personal.
              </p>
              <Button className="bg-primary hover:bg-primary/90 text-white" size="lg">
                Consultar implementación
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default UseCasesSection
