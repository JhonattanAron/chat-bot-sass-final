"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const faqs = [
  {
    question: "¿Cómo configuro mi chatbot?",
    answer:
      "Configurar tu chatbot es muy sencillo. Una vez que te registres, serás guiado a través de un proceso paso a paso donde podrás personalizar las respuestas, el aspecto visual y las integraciones. Nuestro panel de control intuitivo te permite configurar todo sin necesidad de conocimientos técnicos.",
  },
  {
    question: "¿Puedo integrar el bot con mi sistema de gestión de pedidos?",
    answer:
      "Sí, nuestro chatbot puede integrarse con diversos sistemas de gestión de pedidos a través de nuestra API. Ofrecemos integraciones predefinidas con los sistemas más populares, y para casos específicos, nuestro equipo técnico puede ayudarte a desarrollar una integración personalizada.",
  },
  {
    question: "¿Cómo inicio con WhatsApp Business?",
    answer:
      "Para integrar nuestro chatbot con WhatsApp Business, primero necesitas tener una cuenta de WhatsApp Business API. Nosotros te guiamos en el proceso de solicitud y configuración. Una vez aprobada, podrás conectar tu cuenta desde nuestro panel y comenzar a automatizar tus conversaciones de WhatsApp.",
  },
  {
    question: "¿El servicio tiene soporte 24/7?",
    answer:
      "Ofrecemos soporte por email 24/7 para todos nuestros planes. Los clientes con planes Profesional y Enterprise también tienen acceso a soporte por chat en vivo durante horario laboral. Además, nuestro centro de ayuda contiene guías detalladas y tutoriales para resolver las dudas más comunes.",
  },
  {
    question: "¿Puedo personalizar el chatbot con mi marca?",
    answer:
      "Absolutamente. Nuestro chatbot es completamente personalizable. Puedes ajustar los colores, añadir tu logo, personalizar los mensajes de bienvenida y las respuestas para que reflejen el tono y la identidad de tu marca. En los planes superiores, incluso puedes personalizar la interfaz completa.",
  },
  {
    question: "¿Qué ocurre si el chatbot no puede responder a una pregunta?",
    answer:
      "Hemos diseñado nuestro sistema para que, cuando el chatbot no pueda responder a una pregunta, escale automáticamente la conversación a un agente humano si está disponible. También puedes configurar respuestas predeterminadas para estos casos, como ofrecer un formulario de contacto o proporcionar información alternativa.",
  },
  {
    question: "¿Puedo probar el servicio antes de pagar?",
    answer:
      "Sí, ofrecemos una prueba gratuita de 14 días con todas las funcionalidades del plan Profesional. No requerimos tarjeta de crédito para la prueba, por lo que puedes experimentar con todas las características sin compromiso.",
  },
  {
    question: "¿Cómo se manejan los datos de mis clientes?",
    answer:
      "La privacidad y seguridad de los datos son nuestra prioridad. Todos los datos se almacenan de forma segura y encriptada. Cumplimos con el RGPD y otras regulaciones de privacidad. No compartimos ni vendemos datos de tus clientes a terceros. Puedes consultar nuestra política de privacidad para más detalles.",
  },
]

const FaqSection = () => {
  const [openItems, setOpenItems] = useState<string[]>([])

  const handleToggle = (value: string) => {
    setOpenItems((prev) => (prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]))
  }

  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">Preguntas frecuentes</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Respuestas a las dudas más comunes sobre nuestro servicio
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="multiple" value={openItems} className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <AccordionItem value={`item-${index}`} className="border rounded-lg overflow-hidden bg-white shadow-sm">
                  <AccordionTrigger
                    onClick={() => handleToggle(`item-${index}`)}
                    className="px-6 py-4 hover:no-underline hover:bg-gray-50"
                  >
                    <span className="text-left font-medium text-gray-900">{faq.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4 pt-2 text-gray-600">{faq.answer}</AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">¿No encuentras la respuesta que buscas?</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="#soporte"
              className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-white font-medium hover:bg-primary/90 transition-colors"
            >
              Contacta con soporte
            </a>
            <a
              href="#documentacion"
              className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-6 py-3 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Ver documentación
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FaqSection
