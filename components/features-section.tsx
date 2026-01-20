"use client";

import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { motion, useAnimation } from "framer-motion";
import {
  MessageSquare,
  Palette,
  Code,
  Phone,
  ShoppingCart,
  BarChart4,
} from "lucide-react";

const features = [
  {
    icon: <MessageSquare className="h-10 w-10 text-primary" />,
    title: "Automatización completa",
    description:
      "Responde a preguntas frecuentes automáticamente y mantén a tus clientes informados sin intervención humana.",
  },
  {
    icon: <Palette className="h-10 w-10 text-primary" />,
    title: "Configuración personalizada",
    description:
      "Personaliza tu bot con tu logo, colores y tono de voz para mantener la identidad de tu marca.",
  },
  {
    icon: <Code className="h-10 w-10 text-primary" />,
    title: "Integración en página web",
    description:
      "Fácil integración en React/Next.js con solo copiar y pegar el código proporcionado.",
  },
  {
    icon: <Phone className="h-10 w-10 text-primary" />,
    title: "Soporte de WhatsApp Business",
    description:
      "Integración con la API de WhatsApp para atender mensajes desde la aplicación más usada.",
  },
  {
    icon: <ShoppingCart className="h-10 w-10 text-primary" />,
    title: "Gestión de productos y servicios",
    description:
      "Agrega tus productos, precios y más para una experiencia de cliente completa y automatizada.",
  },
  {
    icon: <BarChart4 className="h-10 w-10 text-primary" />,
    title: "Analíticas detalladas",
    description:
      "Analiza el rendimiento de tu bot con reportes detallados sobre interacciones y conversiones.",
  },
];

const FeatureCard = ({
  feature,
  index,
}: {
  feature: (typeof features)[0];
  index: number;
}) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: 50 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.5,
            delay: index * 0.1,
          },
        },
      }}
      className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100 dark:border-gray-800"
    >
      <div className="mb-4">{feature.icon}</div>
      <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
        {feature.title}
      </h3>
      <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
    </motion.div>
  );
};

const FeaturesSection = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  return (
    <section
      id="caracteristicas"
      className="py-16 md:py-24 bg-gray-50 dark:bg-gray-950"
    >
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={controls}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.5 },
            },
          }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            Características clave de nuestro chatbot
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Nuestro chatbot está diseñado para ofrecer una experiencia completa
            tanto para ti como para tus clientes.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
