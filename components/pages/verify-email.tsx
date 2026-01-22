"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, XCircle, Loader2, Mail, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default function VerifyEmailClient() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [message, setMessage] = useState("Verificando tu correo...");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Token no encontrado");
      return;
    }

    const verifyEmail = async () => {
      try {
        const res = await fetch(
          `https://api.aurentric.com/auth/verify-email?token=${token}`,
          {
            method: "GET",
            credentials: "include",
          },
        );

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Error al verificar");
        }

        setStatus("success");
        setMessage(data.message || "Correo verificado correctamente");
      } catch (err: unknown) {
        setStatus("error");
        const errorMessage =
          err instanceof Error ? err.message : "Token inválido o expirado";
        setMessage(errorMessage);
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        {/* Decorative element */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
              <Mail className="w-10 h-10 text-primary" />
            </div>
            {status === "loading" && (
              <div className="absolute inset-0 w-20 h-20 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
            )}
          </div>
        </div>

        <Card className="border-0 shadow-xl shadow-primary/5">
          <CardContent className="pt-8 pb-8 px-8">
            <div className="text-center">
              {/* Status Icon */}
              <div className="mb-6">
                {status === "loading" && (
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted animate-pulse">
                    <Loader2 className="w-8 h-8 text-muted-foreground animate-spin" />
                  </div>
                )}
                {status === "success" && (
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 animate-in zoom-in-50 duration-300">
                    <CheckCircle2 className="w-8 h-8 text-primary" />
                  </div>
                )}
                {status === "error" && (
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10 animate-in zoom-in-50 duration-300">
                    <XCircle className="w-8 h-8 text-destructive" />
                  </div>
                )}
              </div>

              {/* Title */}
              <h1 className="text-2xl font-semibold text-foreground mb-2 text-balance">
                {status === "loading" && "Verificando"}
                {status === "success" && "Verificación exitosa"}
                {status === "error" && "Error de verificación"}
              </h1>

              {/* Message */}
              <p className="text-muted-foreground leading-relaxed mb-8">
                {message}
              </p>

              {/* Action Button */}
              {status === "success" && (
                <Button asChild className="w-full group" size="lg">
                  <Link href="/login">
                    Iniciar sesión
                    <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              )}

              {status === "error" && (
                <div className="space-y-3">
                  <Button
                    asChild
                    variant="outline"
                    className="w-full bg-transparent"
                    size="lg"
                  >
                    <Link href="/">Volver al inicio</Link>
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    {"¿Necesitas ayuda? "}
                    <Link
                      href="/contact"
                      className="text-primary hover:underline font-medium"
                    >
                      Contáctanos
                    </Link>
                  </p>
                </div>
              )}

              {status === "loading" && (
                <p className="text-sm text-muted-foreground">
                  Esto puede tomar unos segundos...
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Footer text */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          Tu seguridad es nuestra prioridad
        </p>
      </div>
    </div>
  );
}
