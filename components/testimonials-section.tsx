"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"
import { Button } from "@/components/ui/button"

const testimonials = [
  {
    id: 1,
    content:
      "Gracias a este chatbot, nuestra empresa ahorró más de 20 horas a la semana en atención al cliente. La integración con WhatsApp fue perfecta y nuestros clientes están encantados con la rapidez de respuesta.",
    author: "María Rodríguez",
    position: "Gerente de Atención al Cliente",
    company: "Restaurante El Sabor",
    avatar: "/placeholder.svg?height=80&width=80",
    rating: 5,
  },
  {
    id: 2,
    content:
      "Implementamos el chatbot en nuestra tienda online y las ventas aumentaron un 30%. Los clientes reciben recomendaciones personalizadas y pueden hacer pedidos directamente desde el chat. Una herramienta imprescindible.",
    author: "Carlos Méndez",
    position: "Director de E-commerce",
    company: "ModaExpress",
    avatar: "/placeholder.svg?height=80&width=80",
    rating: 5,
  },
  {
    id: 3,
    content:
      "La facilidad de configuración me sorprendió. En menos de una hora teníamos nuestro chatbot respondiendo las preguntas más frecuentes de nuestros clientes. El soporte técnico es excelente y siempre están disponibles.",
    author: "Laura Sánchez",
    position: "Propietaria",
    company: "Boutique Elegance",
    avatar: "/placeholder.svg?height=80&width=80",
    rating: 4,
  },
]

const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)

  const nextTestimonial = () => {
    setDirection(1)
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setDirection(-1)
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length)
  }

  useEffect(() => {
    const interval = setInterval(() => {
      nextTestimonial()
    }, 8000)

    return () => clearInterval(interval)
  }, [])

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  }

  return (
    <section className="py-16 md:py-24 bg-primary/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">Lo que dicen nuestros clientes</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Descubre cómo nuestros chatbots están transformando negocios de todos los tamaños
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: "tween", duration: 0.5 }}
              className="bg-white rounded-xl shadow-lg p-8 md:p-10"
            >
              <div className="flex flex-col items-center text-center">
                <div className="mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`inline-block h-6 w-6 ${
                        i < testimonials[currentIndex].rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>

                <p className="text-xl md:text-2xl text-gray-700 italic mb-8">"{testimonials[currentIndex].content}"</p>

                <div className="flex flex-col items-center">
                  <div className="mb-4 rounded-full overflow-hidden border-4 border-primary/20">
                    <Image
                      src={testimonials[currentIndex].avatar || "/placeholder.svg"}
                      alt={testimonials[currentIndex].author}
                      width={80}
                      height={80}
                      className="h-20 w-20 object-cover"
                    />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900">{testimonials[currentIndex].author}</h4>
                  <p className="text-gray-600">{testimonials[currentIndex].position}</p>
                  <p className="text-primary font-medium">{testimonials[currentIndex].company}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <Button
            variant="outline"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 bg-white shadow-md hover:bg-primary/5 z-10 hidden md:flex"
            onClick={prevTestimonial}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 bg-white shadow-md hover:bg-primary/5 z-10 hidden md:flex"
            onClick={nextTestimonial}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex justify-center mt-8 space-x-2 md:hidden">
          {testimonials.map((_, index) => (
            <button
              key={index}
              className={`h-2 w-2 rounded-full ${index === currentIndex ? "bg-primary" : "bg-gray-300"}`}
              onClick={() => {
                setDirection(index > currentIndex ? 1 : -1)
                setCurrentIndex(index)
              }}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default TestimonialsSection
