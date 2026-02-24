"use client";

import type React from "react";
import { LanguageProvider } from "@/contexts/language-context";
import { ThemeProvider } from "next-themes";
import { SessionProvider } from "next-auth/react";
import { EmailProvider } from "@/contexts/EmailContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <LanguageProvider>
        <EmailProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </EmailProvider>
      </LanguageProvider>
    </SessionProvider>
  );
}
