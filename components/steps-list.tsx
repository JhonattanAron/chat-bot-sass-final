import { CheckCircle2, Clock } from "lucide-react"

const STEPS = ["Analizando texto", "Extrayendo leads", "Preparando correos", "Enviando correos", "Proceso finalizado"]

interface StepsListProps {
  currentStep: number
}

export function StepsList({ currentStep }: StepsListProps) {
  return (
    <div className="space-y-3">
      {STEPS.map((step, index) => (
        <div key={index} className="flex items-center gap-3">
          {index < currentStep ? (
            <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
          ) : index === currentStep ? (
            <Clock className="h-5 w-5 text-blue-600 flex-shrink-0 animate-spin" />
          ) : (
            <div className="h-5 w-5 rounded-full border-2 border-muted-foreground flex-shrink-0" />
          )}
          <span className={index <= currentStep ? "text-foreground font-medium" : "text-muted-foreground"}>{step}</span>
        </div>
      ))}
    </div>
  )
}
