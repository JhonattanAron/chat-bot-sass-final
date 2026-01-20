interface Lead {
  email: string
  nombre_empresa: string
  fuente: string
  nivel_interes: "alto" | "medio" | "bajo"
  razon: string
}

interface EmailResult {
  email: string
  empresa: string
  estado: "enviado" | "fallido"
  fecha_envio: string
}

interface ResultsSummaryProps {
  leads: Lead[]
  results: EmailResult[]
}

export function ResultsSummary({ leads, results }: ResultsSummaryProps) {
  const successCount = results.filter((r) => r.estado === "enviado").length
  const failureCount = results.filter((r) => r.estado === "fallido").length

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white rounded-lg p-4 border border-green-200">
        <p className="text-sm text-gray-600 mb-1">Total de leads encontrados</p>
        <p className="text-2xl font-bold text-green-700">{leads.length}</p>
      </div>
      <div className="bg-white rounded-lg p-4 border border-green-200">
        <p className="text-sm text-gray-600 mb-1">Correos enviados correctamente</p>
        <p className="text-2xl font-bold text-green-700">{successCount}</p>
      </div>
      <div className="bg-white rounded-lg p-4 border border-orange-200">
        <p className="text-sm text-gray-600 mb-1">Correos fallidos</p>
        <p className="text-2xl font-bold text-orange-700">{failureCount}</p>
      </div>
    </div>
  )
}
