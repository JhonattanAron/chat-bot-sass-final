import { Card } from "@/components/ui/card";
import CardContent from "@mui/material/CardContent";
import { Loader2 } from "lucide-react";

export default function LoadConfirmPaidClient() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mb-4" />
          <p className="text-lg font-medium text-gray-800">
            Verificando pago...
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Por favor espera mientras confirmamos tu transacción
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
