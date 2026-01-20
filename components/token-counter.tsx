"use client"

import { useLanguage } from "@/contexts/language-context"

interface TokenCounterProps {
  count: number
  limit?: number
}

export function TokenCounter({ count, limit }: TokenCounterProps) {
  const { language } = useLanguage()

  // Determinar el color basado en el porcentaje del límite
  const getColor = () => {
    if (!limit) return "text-muted-foreground"

    const percentage = (count / limit) * 100
    if (percentage < 75) return "text-muted-foreground"
    if (percentage < 90) return "text-amber-500"
    return "text-red-500"
  }

  return (
    <div className={`text-xs ${getColor()}`}>
      {limit ? (
        <span>
          {count} / {limit} {language === "en" ? "tokens" : "tokens"}
        </span>
      ) : (
        <span>
          {count} {language === "en" ? "tokens" : "tokens"}
        </span>
      )}
    </div>
  )
}
