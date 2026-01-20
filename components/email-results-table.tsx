import { CheckCircle2, XCircle } from "lucide-react"

interface EmailResult {
  email: string
  empresa: string
  estado: "enviado" | "fallido"
  fecha_envio: string
  mensaje_error?: string
}

interface EmailResultsTableProps {
  results: EmailResult[]
}

export function EmailResultsTable({ results }: EmailResultsTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-3 px-4 font-semibold text-foreground">Email</th>
            <th className="text-left py-3 px-4 font-semibold text-foreground">Empresa</th>
            <th className="text-left py-3 px-4 font-semibold text-foreground">Estado</th>
            <th className="text-left py-3 px-4 font-semibold text-foreground">Fecha de envío</th>
          </tr>
        </thead>
        <tbody>
          {results.map((result, index) => (
            <tr key={index} className="border-b border-border hover:bg-muted/50">
              <td className="py-3 px-4 text-foreground">{result.email}</td>
              <td className="py-3 px-4 text-foreground">{result.empresa}</td>
              <td className="py-3 px-4">
                <div className="flex items-center gap-2">
                  {result.estado === "enviado" ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <span className="text-green-600 font-medium">Enviado</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-4 w-4 text-red-600" />
                      <span className="text-red-600 font-medium">Fallido</span>
                    </>
                  )}
                </div>
              </td>
              <td className="py-3 px-4 text-muted-foreground text-xs">
                {new Date(result.fecha_envio).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
