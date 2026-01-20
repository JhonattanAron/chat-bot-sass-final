"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Bot, Crown, Zap } from "lucide-react"

interface BotCounterProps {
  activeBots: number
  plan: "basic" | "pro" | "enterprise"
  language?: "en" | "es"
}

const planLimits = {
  basic: 3,
  pro: 10,
  enterprise: 50,
}

const planIcons = {
  basic: Bot,
  pro: Zap,
  enterprise: Crown,
}

export function BotCounter({ activeBots, plan, language = "en" }: BotCounterProps) {
  const limit = planLimits[plan]
  const Icon = planIcons[plan]
  const isNearLimit = activeBots >= limit * 0.8
  const isAtLimit = activeBots >= limit

  return (
    <Card
      className={`transition-colors ${isAtLimit ? "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950" : isNearLimit ? "border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950" : ""}`}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-lg ${isAtLimit ? "bg-red-100 dark:bg-red-900" : isNearLimit ? "bg-yellow-100 dark:bg-yellow-900" : "bg-blue-100 dark:bg-blue-900"}`}
            >
              <Icon
                className={`h-5 w-5 ${isAtLimit ? "text-red-600 dark:text-red-400" : isNearLimit ? "text-yellow-600 dark:text-yellow-400" : "text-blue-600 dark:text-blue-400"}`}
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">{language === "en" ? "Active Bots" : "Bots Activos"}</span>
                <Badge variant={isAtLimit ? "destructive" : isNearLimit ? "outline" : "default"}>
                  {activeBots}/{limit}
                </Badge>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-xs">
                  <Icon className="h-3 w-3 mr-1" />
                  {plan.charAt(0).toUpperCase() + plan.slice(1)} Plan
                </Badge>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="hidden sm:block">
            <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${
                  isAtLimit ? "bg-red-500" : isNearLimit ? "bg-yellow-500" : "bg-blue-500"
                }`}
                style={{ width: `${Math.min((activeBots / limit) * 100, 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Mobile Progress Bar */}
        <div className="sm:hidden mt-3">
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${
                isAtLimit ? "bg-red-500" : isNearLimit ? "bg-yellow-500" : "bg-blue-500"
              }`}
              style={{ width: `${Math.min((activeBots / limit) * 100, 100)}%` }}
            />
          </div>
        </div>

        {isAtLimit && (
          <p className="text-xs text-red-600 dark:text-red-400 mt-2">
            {language === "en"
              ? "You've reached your bot limit. Upgrade to create more bots."
              : "Has alcanzado tu límite de bots. Actualiza para crear más bots."}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
