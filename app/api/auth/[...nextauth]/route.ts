import ROUTES from "@/constants/routes";

import NextAuth, { Session, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import jwt from "jsonwebtoken";
import { env } from "@/env";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    binding_id?: string;
    name?: string;
    email?: string;
    image?: string;
  }
  interface User {
    binding_id?: string;
    token?: string;
  }
}

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID!,
      clientSecret: env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        try {
          const res = await fetch(`https://api.aurentric.com/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials?.email,
              password: credentials?.password,
            }),
          });

          console.log("Estado de la respuesta:", res.status);

          if (!res.ok) {
            const errorData = await res.json();
            console.error("Error del backend:", errorData);

            // Propaga el mensaje de error específico del backend
            throw new Error(errorData.message || "Credenciales inválidas");
          }

          // Extraer el token JWT de la cookie
          const setCookieHeader = res.headers.get("set-cookie");
          if (!setCookieHeader) {
            throw new Error("No se encontró el token en las cookies");
          }

          // Extraer el token de la cookie
          const tokenMatch = setCookieHeader.match(/jwt=([^;]+)/);
          if (!tokenMatch) {
            throw new Error("No se pudo extraer el token JWT de la cookie");
          }

          const token = tokenMatch[1];
          console.log("Token extraído:", token);

          // Decodificar el token JWT para extraer los datos del usuario
          const decodedToken = jwt.decode(token) as jwt.JwtPayload;
          console.log("Datos decodificados del token:", decodedToken);

          return {
            id: String(decodedToken.sub),
            token,
            name: decodedToken.name as string,
            email: decodedToken.email,
            image: decodedToken.image,
            binding_id: decodedToken.binding_id,
          };
        } catch (error) {
          console.error("Error en authorize:", error);
          if (error instanceof Error) {
            throw new Error(
              error.message || "Error al conectar con el servidor",
            );
          } else {
            throw new Error("Error desconocido al conectar con el servidor");
          }
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        console.log(env.NEST_API_URL);

        try {
          // Solicitar el token personalizado al backend
          const response = await fetch(
            `https://api.aurentric.com/auth/google-login`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: user.email,
                name: user.name,
                image: user.image,
                googleId: user.id,
              }),
            },
          );

          const data = await response.json();
          console.log({ data: data });

          if (!response.ok) {
            throw new Error(data.message || "Error en el login con Google");
          }

          // Adjuntar el token personalizado al usuario
          user.token = data.token; // Aquí se espera que el backend devuelva el token personalizado
          return true;
        } catch (error) {
          console.error("Error en Google SignIn:", error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        if (account?.provider === "google" && user.token) {
          // Decodificar el token enviado desde el backend (Google)
          const decoded = jwt.decode(user.token) as jwt.JwtPayload;
          console.log("Token decodificado desde el backend (Google):", decoded);

          if (decoded) {
            token.accessToken = user.token;
            token.name = decoded.name;
            token.email = decoded.email;
            token.image = decoded.image;
            token.binding_id = decoded.binding_id;
          }
        } else if (account?.provider === "credentials" && user.token) {
          // Decodificar el token enviado desde el backend (Credenciales)
          const decoded = jwt.decode(user.token) as jwt.JwtPayload;
          console.log(
            "Token decodificado desde el backend (Credentials):",
            decoded,
          );

          if (decoded) {
            token.accessToken = user.token;
            token.name = decoded.name;
            token.email = decoded.email;
            token.image = decoded.image;
            token.binding_id = decoded.binding_id; // Asegúrate de que el binding_id se extraiga
          }
        }
      }
      return token;
    },
    async session({ session, token }) {
      session.binding_id = token.binding_id as string;
      return session;
    },
  },
  events: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          const response = await fetch(
            `https://api.aurentric.com/auth/google-login`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: user.email,
                name: user.name,
                image: user.image,
                googleId: user.id,
              }),
            },
          );

          const data = await response.json();
          if (!response.ok)
            throw new Error(data.message || "Error en el login");
        } catch (error) {
          console.error("Error en Google SignIn:", error);
        }
      }
    },
  },

  secret: env.NEXTAUTH_SECRET,
  pages: {
    signIn: ROUTES.PUBLIC.LOGIN, // Página personalizada de inicio de sesión
    signOut: ROUTES.PUBLIC.LOGIN, // Página personalizada de cierre de sesión
  },
});

export { handler as GET, handler as POST };
