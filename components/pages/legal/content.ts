export type LegalSlug =
  | "terminos"
  | "privacidad"
  | "cookies"
  | "aviso-legal"
  | "devoluciones";

interface LegalContent {
  title: string;
  updatedAt: string;
  content: string;
}

export const LEGAL_CONTENT: Record<LegalSlug, LegalContent> = {
  terminos: {
    title: "Términos de Servicio",
    updatedAt: "1 de febrero de 2026",
    content: `
Bienvenido a Aurentric AI Labs. Al acceder, registrarte o utilizar nuestros servicios,
aceptas expresamente estos Términos de Servicio.

Aurentric AI Labs ofrece soluciones de inteligencia artificial, automatización,
chatbots conversacionales, campañas multicanal y herramientas de análisis basadas en IA.

USO DEL SERVICIO
El usuario se compromete a:
• Utilizar la plataforma únicamente con fines legales.
• No usar los servicios para enviar spam, fraude o contenido ilícito.
• No intentar acceder, alterar o interferir con sistemas, servidores o datos.
• No revender, sublicenciar o explotar comercialmente el servicio sin autorización.

CUENTAS Y RESPONSABILIDAD
El usuario es responsable de la confidencialidad de sus credenciales y del uso que
se realice desde su cuenta. Aurentric AI Labs no se responsabiliza por accesos no
autorizados causados por negligencia del usuario.

DISPONIBILIDAD DEL SERVICIO
Aurentric AI Labs se esfuerza por mantener la plataforma operativa, pero no garantiza
disponibilidad ininterrumpida. Pueden realizarse mantenimientos o actualizaciones.

SUSPENSIÓN Y TERMINACIÓN
Nos reservamos el derecho de suspender o cancelar cuentas que incumplan estos términos
o hagan un uso indebido de la plataforma.

MODIFICACIONES
Aurentric AI Labs puede actualizar estos términos en cualquier momento. El uso
continuado del servicio implica la aceptación de los cambios.
    `,
  },

  privacidad: {
    title: "Política de Privacidad",
    updatedAt: "1 de febrero de 2026",
    content: `
En Aurentric AI Labs respetamos y protegemos la privacidad de nuestros usuarios.

INFORMACIÓN QUE RECOPILAMOS
Podemos recopilar:
• Nombre y datos de contacto (como correo electrónico).
• Información de facturación.
• Datos de uso, interacción y métricas del sistema.
• Información técnica como navegador, IP y dispositivo.

USO DE LA INFORMACIÓN
Los datos se utilizan para:
• Proveer y mantener el servicio.
• Mejorar el rendimiento y funcionalidades.
• Soporte técnico y comunicación.
• Cumplimiento de obligaciones legales.

PROTECCIÓN DE DATOS
Aplicamos medidas técnicas y organizativas para proteger la información contra accesos
no autorizados, pérdida o uso indebido.

COMPARTICIÓN DE DATOS
No vendemos ni alquilamos datos personales. Solo compartimos información cuando es
necesario para:
• Procesadores de pago.
• Proveedores de infraestructura.
• Cumplimiento legal.

DERECHOS DEL USUARIO
El usuario puede solicitar acceso, rectificación o eliminación de sus datos personales
contactándonos directamente.

El uso de la plataforma implica la aceptación de esta Política de Privacidad.
    `,
  },

  cookies: {
    title: "Política de Cookies",
    updatedAt: "1 de febrero de 2026",
    content: `
Aurentric AI Labs utiliza cookies y tecnologías similares para mejorar la experiencia
del usuario.

¿QUÉ SON LAS COOKIES?
Son pequeños archivos almacenados en tu dispositivo que permiten reconocer tu
navegador y recordar preferencias.

TIPOS DE COOKIES UTILIZADAS
• Cookies técnicas: necesarias para el funcionamiento del sitio.
• Cookies de análisis: para métricas y mejoras de rendimiento.
• Cookies de personalización: para recordar configuraciones del usuario.

GESTIÓN DE COOKIES
Puedes configurar o desactivar las cookies desde la configuración de tu navegador.
La desactivación puede afectar algunas funcionalidades del servicio.

Al continuar navegando, aceptas el uso de cookies conforme a esta política.
    `,
  },

  "aviso-legal": {
    title: "Aviso Legal",
    updatedAt: "1 de febrero de 2026",
    content: `
Este sitio web es operado por Aurentric AI Labs, una plataforma dedicada al desarrollo
de soluciones tecnológicas basadas en inteligencia artificial.

PROPIEDAD INTELECTUAL
Todo el contenido, software, diseño, textos, marcas y logotipos son propiedad de
Aurentric AI Labs o de sus respectivos titulares y están protegidos por leyes de
propiedad intelectual.

RESPONSABILIDAD
Aurentric AI Labs no se hace responsable por daños derivados del uso incorrecto del
sitio o de interrupciones del servicio.

ENLACES EXTERNOS
Este sitio puede contener enlaces a terceros. Aurentric AI Labs no controla ni es
responsable del contenido o políticas de dichos sitios.

El acceso y uso de este sitio implica la aceptación del presente Aviso Legal.
    `,
  },

  devoluciones: {
    title: "Política de Devoluciones y Reembolsos",
    updatedAt: "1 de febrero de 2026",
    content: `
Aurentric AI Labs ofrece servicios digitales y suscripciones basadas en software.

NATURALEZA DEL SERVICIO
Debido a que los servicios se activan de forma inmediata, no se aceptan devoluciones
una vez iniciado el uso del plan contratado.

REEMBOLSOS EXCEPCIONALES
Podrán evaluarse reembolsos únicamente en casos de:
• Errores de facturación comprobables.
• Fallos técnicos atribuibles a la plataforma que impidan el uso del servicio.

SOLICITUDES
Las solicitudes deben realizarse dentro de los primeros días posteriores a la compra,
contactando al soporte oficial.

Aurentric AI Labs se reserva el derecho de evaluar cada caso individualmente.
    `,
  },
};
