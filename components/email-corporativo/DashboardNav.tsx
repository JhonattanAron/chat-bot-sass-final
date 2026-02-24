// components/DashboardNav.tsx
"use client";

import { useEmail } from "@/contexts/EmailContext";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Mail, LogOut, Settings } from "lucide-react";

export function DashboardNav() {
  const { disconnect, accountInfo } = useEmail();
  const router = useRouter();

  const handleDisconnect = async () => {
    try {
      await disconnect();
      router.push("/");
    } catch (error) {
      // Error handled by toast
    }
  };

  return (
    <nav className="border-b border-slate-700 bg-slate-800/50 backdrop-blur-xl sticky top-0 z-50">
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-600/20">
            <Mail className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h1 className="font-semibold text-white">Email Manager</h1>
            {accountInfo?.from_email && (
              <p className="text-xs text-slate-400">{accountInfo.from_email}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {accountInfo?.quota && (
            <div className="text-sm text-slate-400">
              <span className="text-white font-medium">
                {accountInfo.quota}
              </span>{" "}
              quota
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDisconnect}
            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Disconnect
          </Button>
        </div>
      </div>
    </nav>
  );
}
