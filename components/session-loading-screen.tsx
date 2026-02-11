import { Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";

interface SessionLoadingScreenProps {
  message?: string;
  isLoading?: boolean;
}

export default function SessionLoadingScreen({
  message = "Verifying Session",
}: SessionLoadingScreenProps) {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center z-50">
      <div className="w-full max-w-sm px-4">
        <Card className="p-8 flex flex-col items-center gap-6 shadow-lg border-0">
          {/* Animated Logo Container */}
          <div className="relative w-20 h-20 flex items-center justify-center">
            {/* Outer ring */}
            <div className="absolute inset-0 rounded-full border-4 border-slate-200 dark:border-slate-700" />
            
            {/* Spinning ring */}
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-indigo-500 border-r-indigo-500 animate-spin" />
            
            {/* Inner loader */}
            <Loader2 className="h-10 w-10 text-indigo-600 dark:text-indigo-400 animate-spin relative z-10" />
          </div>

          {/* Message Section */}
          <div className="text-center space-y-2 w-full">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50">
              {message}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Please wait while we verify your authentication and load your data
            </p>
          </div>

          {/* Progress Dots */}
          <div className="flex gap-2 mt-2">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full bg-indigo-500 dark:bg-indigo-400 animate-bounce"
                style={{
                  animationDelay: `${i * 0.15}s`,
                }}
              />
            ))}
          </div>

          {/* Status Steps */}
          <div className="w-full space-y-2 pt-4 border-t border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-3 text-sm">
              <div className="w-5 h-5 rounded-full bg-indigo-500 text-white flex items-center justify-center">
                <span className="text-xs font-semibold">✓</span>
              </div>
              <span className="text-slate-700 dark:text-slate-300">Checking authentication</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center animate-pulse">
                <Loader2 className="w-3 h-3 text-indigo-600 dark:text-indigo-400 animate-spin" />
              </div>
              <span className="text-slate-600 dark:text-slate-400">Loading session data</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="w-5 h-5 rounded-full border-2 border-slate-300 dark:border-slate-600" />
              <span className="text-slate-500 dark:text-slate-500">Initializing interface</span>
            </div>
          </div>

          {/* Helper Text */}
          <p className="text-xs text-slate-500 dark:text-slate-500 text-center">
            This usually takes less than 5 seconds...
          </p>
        </Card>
      </div>
    </div>
  );
}

export function BotDataLoadingScreen() {
  return (
    <div className="flex h-full items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <Card className="w-full max-w-sm mx-4 p-8 flex flex-col items-center gap-6 shadow-lg border-0">
        <div className="relative w-20 h-20 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-4 border-slate-200 dark:border-slate-700" />
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-indigo-500 border-r-indigo-500 animate-spin" />
          <Loader2 className="h-10 w-10 text-indigo-600 dark:text-indigo-400 animate-spin relative z-10" />
        </div>
        
        <div className="text-center space-y-2 w-full">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50">
            Loading Bot
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Please wait while we load your bot configuration and data...
          </p>
        </div>

        <div className="flex gap-2">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-indigo-500 dark:bg-indigo-400 animate-bounce"
              style={{
                animationDelay: `${i * 0.15}s`,
              }}
            />
          ))}
        </div>
      </Card>
    </div>
  );
}
