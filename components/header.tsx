"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white dark:bg-black shadow-md py-2"
          : "bg-transparent py-4"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Image
                src="logos/favicon.png"
                alt="ChatBot SaaS Logo"
                width={200}
                height={300}
                className="h-10 w-auto"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className="text-gray-800 dark:text-gray-200 hover:text-primary font-medium"
            >
              Inicio
            </Link>
            <Link
              href="#caracteristicas"
              className="text-gray-800 dark:text-gray-200 hover:text-primary font-medium"
            >
              Características
            </Link>
            <Link
              href="#precios"
              className="text-gray-800 dark:text-gray-200 hover:text-primary font-medium"
            >
              Precios
            </Link>
            <Link
              href="#casos-de-uso"
              className="text-gray-800 dark:text-gray-200 hover:text-primary font-medium"
            >
              Casos de Uso
            </Link>
            <Link
              href="#blog"
              className="text-gray-800 dark:text-gray-200 hover:text-primary font-medium"
            >
              Blog
            </Link>
            <Link
              href="#soporte"
              className="text-gray-800 dark:text-gray-200 hover:text-primary font-medium"
            >
              Soporte
            </Link>
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <Button
              onClick={() => router.push("/login")}
              variant="outline"
              className="font-medium border-black dark:border-white"
            >
              Iniciar sesión
            </Button>
            <Button className="bg-white text-primary hover:bg-gray-100 font-medium border border-primary">
              Crea tu bot ahora
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-800 dark:text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-black shadow-lg py-4 px-4 absolute top-full left-0 right-0">
          <nav className="flex flex-col space-y-4">
            <Link
              href="/"
              className="text-gray-800 dark:text-gray-200 hover:text-primary font-medium py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Inicio
            </Link>
            <Link
              href="#caracteristicas"
              className="text-gray-800 dark:text-gray-200 hover:text-primary font-medium py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Características
            </Link>
            <Link
              href="#precios"
              className="text-gray-800 dark:text-gray-200 hover:text-primary font-medium py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Precios
            </Link>
            <Link
              href="#casos-de-uso"
              className="text-gray-800 dark:text-gray-200 hover:text-primary font-medium py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Casos de Uso
            </Link>
            <Link
              href="#blog"
              className="text-gray-800 dark:text-gray-200 hover:text-primary font-medium py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Blog
            </Link>
            <Link
              href="#soporte"
              className="text-gray-800 dark:text-gray-200 hover:text-primary font-medium py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Soporte
            </Link>
            <div className="flex flex-col space-y-3 pt-2">
              <Button
                variant="outline"
                className="w-full font-medium border-black dark:border-white"
              >
                Iniciar sesión
              </Button>
              <Button className="w-full bg-white text-primary hover:bg-gray-100 font-medium border border-primary">
                Crea tu bot ahora
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
