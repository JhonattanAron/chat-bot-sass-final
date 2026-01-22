"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function VerifyEmailPage() {
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
          `http://localhost:8081/auth/verify-email?token=${token}`,
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
      } catch (err: any) {
        setStatus("error");
        setMessage(err.message || "Token inválido o expirado");
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          padding: "2rem",
          maxWidth: 420,
          textAlign: "center",
          border: "1px solid #e5e7eb",
          borderRadius: 8,
        }}
      >
        {status === "loading" && <p>⏳ {message}</p>}
        {status === "success" && <p>✅ {message}</p>}
        {status === "error" && <p>❌ {message}</p>}

        {status === "success" && (
          <a
            href="/login"
            style={{
              display: "inline-block",
              marginTop: "1rem",
              color: "#2563eb",
              textDecoration: "underline",
            }}
          >
            Ir a iniciar sesión
          </a>
        )}
      </div>
    </div>
  );
}
