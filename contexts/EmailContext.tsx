// context/EmailContext.tsx
"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { toast } from "sonner";

interface EmailContextType {
  isConnected: boolean;
  isLoading: boolean;
  sessionId: string | null;
  accountInfo: any;
  connect: (apiKey: string) => Promise<void>;
  disconnect: () => Promise<void>;
  sendEmail: (
    to: string,
    subject: string,
    html: string,
    from?: string,
  ) => Promise<void>;
  listEmails: (limit?: number, offset?: number) => Promise<any>;
  listDomains: () => Promise<any>;
  createDomain: (domain: string) => Promise<any>;
}

const EmailContext = createContext<EmailContextType | undefined>(undefined);

export function EmailProvider({ children }: { children: React.ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [accountInfo, setAccountInfo] = useState<any>(null);

  const connect = useCallback(async (apiKey: string) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/resend/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to connect");
      }

      const data = await response.json();
      setSessionId(data.sessionId);
      setAccountInfo(data.account);
      setIsConnected(true);
      toast.success("Connected to Resend!");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Connection failed";
      toast.error(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const disconnect = useCallback(async () => {
    setIsLoading(true);
    try {
      await fetch("/api/resend/disconnect", { method: "POST" });
      setIsConnected(false);
      setSessionId(null);
      setAccountInfo(null);
      toast.success("Disconnected from Resend");
    } catch (error) {
      toast.error("Failed to disconnect");
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const sendEmail = useCallback(
    async (to: string, subject: string, html: string, from?: string) => {
      if (!isConnected) throw new Error("Not connected to Resend");

      setIsLoading(true);
      try {
        const response = await fetch("/api/resend/send-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ to, subject, html, from }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Failed to send email");
        }

        toast.success("Email sent successfully!");
      } catch (error) {
        const message = error instanceof Error ? error.message : "Send failed";
        toast.error(message);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [isConnected],
  );

  const listEmails = useCallback(
    async (limit = 50, offset = 0) => {
      if (!isConnected) throw new Error("Not connected to Resend");

      try {
        const response = await fetch(
          `/api/resend/list-emails?limit=${limit}&offset=${offset}`,
          { method: "GET" },
        );

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Failed to fetch emails");
        }

        return await response.json();
      } catch (error) {
        const message = error instanceof Error ? error.message : "Fetch failed";
        toast.error(message);
        throw error;
      }
    },
    [isConnected],
  );

  const listDomains = useCallback(async () => {
    if (!isConnected) throw new Error("Not connected to Resend");

    try {
      const response = await fetch("/api/resend/list-domains", {
        method: "GET",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to fetch domains");
      }

      return await response.json();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Fetch failed";
      toast.error(message);
      throw error;
    }
  }, [isConnected]);

  const createDomain = useCallback(
    async (domain: string) => {
      if (!isConnected) throw new Error("Not connected to Resend");

      try {
        const response = await fetch("/api/resend/create-domain", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ domain }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Failed to create domain");
        }

        toast.success("Domain created successfully!");
        return await response.json();
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Creation failed";
        toast.error(message);
        throw error;
      }
    },
    [isConnected],
  );

  return (
    <EmailContext.Provider
      value={{
        isConnected,
        isLoading,
        sessionId,
        accountInfo,
        connect,
        disconnect,
        sendEmail,
        listEmails,
        listDomains,
        createDomain,
      }}
    >
      {children}
    </EmailContext.Provider>
  );
}

export function useEmail() {
  const context = useContext(EmailContext);
  if (!context) {
    throw new Error("useEmail must be used within EmailProvider");
  }
  return context;
}
