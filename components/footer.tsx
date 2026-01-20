import Link from "next/link"
import Image from "next/image"
import { Facebook, Twitter, Linkedin, Instagram, Youtube, Mail, MapPin, Phone } from "lucide-react"

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div>
            <Link href="/" className="inline-block mb-6">
              <Image
                src="/placeholder.svg?height=40&width=180"
                alt="ChatBot SaaS Logo"
                width={180}
                height={40}
                className="h-10 w-auto brightness-200"
              />
            </Link>
            <p className="mb-6">
              Automatiza tu servicio al cliente con chatbots inteligentes para WhatsApp y tu página web. Sin necesidad
              de programación.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Youtube size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-6">Enlaces rápidos</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="#caracteristicas" className="hover:text-white transition-colors">
                  Características
                </Link>
              </li>
              <li>
                <Link href="#precios" className="hover:text-white transition-colors">
                  Precios
                </Link>
              </li>
              <li>
                <Link href="#casos-de-uso" className="hover:text-white transition-colors">
                  Casos de uso
                </Link>
              </li>
              <li>
                <Link href="#blog" className="hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="#soporte" className="hover:text-white transition-colors">
                  Soporte
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-6">Legal</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/terminos" className="hover:text-white transition-colors">
                  Términos de servicio
                </Link>
              </li>
              <li>
                <Link href="/privacidad" className="hover:text-white transition-colors">
                  Política de privacidad
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="hover:text-white transition-colors">
                  Política de cookies
                </Link>
              </li>
              <li>
                <Link href="/legal" className="hover:text-white transition-colors">
                  Aviso legal
                </Link>
              </li>
              <li>
                <Link href="/devoluciones" className="hover:text-white transition-colors">
                  Política de devoluciones
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-6">Contacto</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-3 mt-0.5 text-emerald-500" />
                <span>Calle Innovación 123, 28001 Madrid, España</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-3 text-emerald-500" />
                <span>+34 91 123 45 67</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-3 text-emerald-500" />
                <a href="mailto:info@chatbotsaas.com" className="hover:text-white transition-colors">
                  info@chatbotsaas.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} ChatBot SaaS. Todos los derechos reservados.
            </p>
            <div className="flex space-x-4 text-sm">
              <Link href="/terminos" className="hover:text-white transition-colors">
                Términos
              </Link>
              <Link href="/privacidad" className="hover:text-white transition-colors">
                Privacidad
              </Link>
              <Link href="/cookies" className="hover:text-white transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
