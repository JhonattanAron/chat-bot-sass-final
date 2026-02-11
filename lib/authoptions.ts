import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    // tus providers
  ],
  callbacks: {
    async jwt({ token, user }) {
      // 🔥 SOLO en login
      if (user?.binding_id) {
        token.binding_id = String(user.binding_id);
      }
      return token;
    },

    async session({ session, token }) {
      // 🔥 SIEMPRE en cada request
      if (token?.binding_id) {
        session.binding_id = String(token.binding_id);
      }
      return session;
    },
  },
};
