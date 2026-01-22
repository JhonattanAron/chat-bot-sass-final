"use client";

import Link from "next/link";
import { Bot, Mail, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ROUTES from "@/constants/routes";

export default function VerifyEmailPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted p-4">
      <Link
        href="/"
        className="absolute left-8 top-8 flex items-center gap-2 font-bold md:left-12 md:top-12"
      >
        <Bot className="h-6 w-6" />
        <span>Aurentric Labs</span>
      </Link>

      <Card className="w-full max-w-md text-center">
        <CardHeader className="space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Mail className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">
            Verifica tu correo
          </CardTitle>
          <CardDescription className="text-base">
            Hemos enviado un enlace de verificación a tu correo electrónico.
            Revisa tu bandeja de entrada para iniciar sesión.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-muted/50 p-4">
            <p className="text-sm text-muted-foreground">
              Si no recibes el correo en unos minutos, revisa tu carpeta de spam
              o correo no deseado.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Button asChild className="w-full">
            <Link href={ROUTES.PUBLIC.LOGIN}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Ir a iniciar sesión
            </Link>
          </Button>
          <div className="text-sm text-muted-foreground">
            ¿No recibiste el correo?{" "}
            <button
              type="button"
              className="text-primary underline-offset-4 hover:underline"
            >
              Reenviar correo
            </button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
