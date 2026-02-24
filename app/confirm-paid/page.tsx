"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  confirmPayment,
  ConfirmPaymentResponse,
} from "@/app/actions/confirm-payment";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader2, AlertCircle } from "lucide-react";

export default function ConfirmPaymentPage() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [transactionData, setTransactionData] =
    useState<ConfirmPaymentResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    if (transactionData?.transactionStatus === "Approved") {
      window.opener?.postMessage(
        {
          type: "payment_success",
          data: transactionData,
        },
        "*",
      );

      window.close();
    }
  }, [transactionData]);

  useEffect(() => {
    const id = searchParams.get("id");
    const clientTransactionId = searchParams.get("clientTransactionId");

    if (!id || !clientTransactionId) {
      setError("Parámetros de transacción inválidos");
      setLoading(false);
      return;
    }

    const fetchTransaction = async () => {
      const result = await confirmPayment(id, clientTransactionId);

      if (result.success && result.data) {
        setTransactionData(result.data);
      } else {
        setError(result.error || "Error desconocido");
      }
      setLoading(false);
    };

    fetchTransaction();
  }, [searchParams]);

  if (loading) {
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

  const isApproved = transactionData?.transactionStatus === "Approved";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="w-full max-w-2xl space-y-4">
        {error ? (
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <div className="flex items-center gap-3">
                <XCircle className="w-8 h-8 text-red-600 flex-shrink-0" />
                <div>
                  <CardTitle className="text-red-900">
                    Error en la transacción
                  </CardTitle>
                  <CardDescription className="text-red-700">
                    {error}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-center text-gray-600">
                  ✓ Ya puedes cerrar esta ventana
                </p>
                <Button onClick={() => window.close()} className="w-full">
                  Cerrar esta pestaña
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : transactionData ? (
          <>
            <Card
              className={
                isApproved
                  ? "border-green-200 bg-green-50"
                  : "border-yellow-200 bg-yellow-50"
              }
            >
              <CardHeader>
                <div className="flex items-center gap-3">
                  {isApproved ? (
                    <CheckCircle className="w-8 h-8 text-green-600 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="w-8 h-8 text-yellow-600 flex-shrink-0" />
                  )}
                  <div>
                    <CardTitle
                      className={
                        isApproved ? "text-green-900" : "text-yellow-900"
                      }
                    >
                      {isApproved ? "¡Pago aprobado!" : "Pago pendiente"}
                    </CardTitle>
                    <CardDescription
                      className={
                        isApproved ? "text-green-700" : "text-yellow-700"
                      }
                    >
                      Estado: {transactionData.transactionStatus}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Detalles de la transacción
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Información de transacción */}
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        ID de Transacción
                      </p>
                      <p className="text-lg font-mono text-gray-900">
                        {transactionData.transactionId}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        ID del Cliente
                      </p>
                      <p className="text-sm font-mono text-gray-900 break-all">
                        {transactionData.clientTransactionId}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Código de Autorización
                      </p>
                      <p className="text-lg font-mono text-gray-900">
                        {transactionData.authorizationCode}
                      </p>
                    </div>
                  </div>

                  {/* Información de monto */}
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Monto
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {transactionData.amount} {transactionData.currency}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Fecha
                      </p>
                      <p className="text-sm text-gray-900">
                        {new Date(transactionData.date).toLocaleString("es-ES")}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Tienda
                      </p>
                      <p className="text-sm text-gray-900">
                        {transactionData.storeName}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 my-6" />

                {/* Información de tarjeta */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Marca de tarjeta
                    </p>
                    <p className="text-sm text-gray-900">
                      {transactionData.cardBrand}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Tipo de tarjeta
                    </p>
                    <p className="text-sm text-gray-900">
                      {transactionData.cardType}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Últimos dígitos
                    </p>
                    <p className="text-lg font-mono text-gray-900">
                      ****{transactionData.lastDigits}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      BIN
                    </p>
                    <p className="text-lg font-mono text-gray-900">
                      {transactionData.bin}
                    </p>
                  </div>
                </div>

                <div className="border-t border-gray-200 my-6" />

                {/* Información del cliente */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Email
                    </p>
                    <p className="text-sm text-gray-900">
                      {transactionData.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Teléfono
                    </p>
                    <p className="text-sm text-gray-900">
                      {transactionData.phoneNumber}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Documento
                    </p>
                    <p className="text-sm font-mono text-gray-900">
                      {transactionData.document}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Región
                    </p>
                    <p className="text-sm text-gray-900">
                      {transactionData.regionIso}
                    </p>
                  </div>
                </div>

                {transactionData.optionalParameter3 && (
                  <>
                    <div className="border-t border-gray-200 my-6" />
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                        Descripción
                      </p>
                      <p className="text-sm text-gray-900">
                        {transactionData.optionalParameter3}
                      </p>
                    </div>
                  </>
                )}

                {transactionData.reference && (
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                      Referencia
                    </p>
                    <p className="text-sm text-gray-900">
                      {transactionData.reference}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button
                onClick={() => {
                  const content = `
Transacción ID: ${transactionData.transactionId}
Monto: ${transactionData.amount} ${transactionData.currency}
Estado: ${transactionData.transactionStatus}
Tarjeta: ****${transactionData.lastDigits}
Fecha: ${new Date(transactionData.date).toLocaleString("es-ES")}
Email: ${transactionData.email}
                  `;
                  navigator.clipboard.writeText(content);
                }}
                variant="outline"
                className="flex-1"
              >
                Copiar detalles
              </Button>
              <Button onClick={() => window.close()} className="flex-1">
                Cerrar esta pestaña
              </Button>
            </div>
            <p className="text-sm text-center text-green-600 font-medium">
              ✓ Ya puedes cerrar esta ventana
            </p>
          </>
        ) : null}
      </div>
    </div>
  );
}
