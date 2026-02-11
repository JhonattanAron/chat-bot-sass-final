'use client';

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface UseSessionCheckOptions {
  redirectTo?: string;
  onSessionVerified?: () => void;
  onSessionError?: () => void;
  showLoadingScreen?: boolean;
}

interface SessionCheckResult {
  session: any;
  isSessionValid: boolean;
  isSessionLoading: boolean;
  hasExpired: boolean;
  sessionTimeRemaining: number | null;
  userId: string | null;
}

const SESSION_CHECK_INTERVAL = 30000; // 30 seconds
const SESSION_TIMEOUT = 3600000; // 1 hour

export function useSessionCheck(
  options: UseSessionCheckOptions = {}
): SessionCheckResult {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [isSessionValid, setIsSessionValid] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const [hasExpired, setHasExpired] = useState(false);
  const [sessionStart, setSessionStart] = useState<number | null>(null);
  const [sessionTimeRemaining, setSessionTimeRemaining] = useState<number | null>(null);

  useEffect(() => {
    console.log("[v0] Session status changed:", { status, hasSession: !!session });
    
    const verifySession = async () => {
      setIsVerifying(true);

      if (status === "loading") {
        // Still loading
        return;
      }

      if (status === "unauthenticated") {
        console.log("[v0] Session unauthenticated");
        setIsSessionValid(false);
        setHasExpired(true);
        toast({
          title: "Session Error",
          description: "Por favor inicia sesión para continuar.",
          variant: "destructive",
        });
        router.push(options.redirectTo || "/auth/signin");
        options.onSessionError?.();
        setIsVerifying(false);
        return;
      }

      if (status === "authenticated") {
        // Verify binding_id exists
        if (!session?.binding_id) {
          console.log("[v0] Session missing binding_id");
          setIsSessionValid(false);
          setHasExpired(true);
          toast({
            title: "Session Error",
            description: "Intenta cerrar sesión y volver a ingresar.",
            variant: "destructive",
          });
          router.push("/api/auth/signout");
          options.onSessionError?.();
          setIsVerifying(false);
          return;
        }

        // Session is valid
        const now = Date.now();
        if (!sessionStart) {
          setSessionStart(now);
        }

        const start = sessionStart || now;
        const elapsed = now - start;
        const remaining = SESSION_TIMEOUT - elapsed;

        if (remaining <= 0) {
          console.log("[v0] Session expired");
          setHasExpired(true);
          setIsSessionValid(false);
        } else {
          console.log("[v0] Session valid, remaining:", remaining);
          setIsSessionValid(true);
          setHasExpired(false);
          setSessionTimeRemaining(remaining);
        }

        options.onSessionVerified?.();
      }

      setIsVerifying(false);
    };

    verifySession();
  }, [status, session, router, toast, options, sessionStart]);

  // Periodic session check
  useEffect(() => {
    if (!isSessionValid) return;

    const interval = setInterval(() => {
      if (sessionStart) {
        const elapsed = Date.now() - sessionStart;
        const remaining = SESSION_TIMEOUT - elapsed;
        setSessionTimeRemaining(remaining);

        if (remaining <= 0) {
          setHasExpired(true);
          setIsSessionValid(false);
          toast({
            title: "Session Expired",
            description: "Your session has expired. Please log in again.",
            variant: "destructive",
          });
          router.push("/api/auth/signout");
        }
      }
    }, SESSION_CHECK_INTERVAL);

    return () => clearInterval(interval);
  }, [isSessionValid, sessionStart, router, toast]);

  return {
    session,
    isSessionValid,
    isSessionLoading: isVerifying || status === "loading",
    hasExpired,
    sessionTimeRemaining,
    userId: session?.binding_id as string | null,
  };
}
