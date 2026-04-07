"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, Eye, Trash2, Filter, Link2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Invoice, useInvoicesStore } from "@/store/facturas-store";
import { PayphoneButton } from "@/components/payments-metods/checkout-form-payphone";
import { useRouter } from "next/navigation";

export default function InvoicesTab() {
  const { invoices, fetchInvoices, loading } = useInvoicesStore();
  const router = useRouter();
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const totalFacturado = invoices.reduce(
    (acc, inv) => acc + (inv.total || 0),
    0,
  );

  const facturasPagadas = invoices.filter((inv) => inv.status === "Pagada");

  const facturasPendientes = invoices.filter(
    (inv) => inv.status === "Pendiente",
  );

  const facturasVencidas = invoices.filter((inv) => inv.status === "Vencida");

  const totalPendiente = facturasPendientes.reduce(
    (acc, inv) => acc + (inv.total || 0),
    0,
  );

  const totalVencido = facturasVencidas.reduce(
    (acc, inv) => acc + (inv.total || 0),
    0,
  );

  useEffect(() => {
    fetchInvoices();
  }, []);

  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      if (event.data?.type === "payment_success") {
        const paymentData = event.data.data;

        if (!selectedInvoice) return;

        try {
          await fetch(`/api/backend/invoices/${selectedInvoice._id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              status: "Pagada",
              transactionId: paymentData.transactionId,
              clientTransactionId: paymentData.clientTransactionId,
              notes: `Pago confirmado ID: ${paymentData.transactionId}`,
            }),
          });

          fetchInvoices();
        } catch (error) {
          console.error("Error actualizando factura", error);
        }
      }
    };

    window.addEventListener("message", handleMessage);

    return () => window.removeEventListener("message", handleMessage);
  }, [selectedInvoice]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Pagada":
        return "bg-green-500/20 text-green-400";
      case "Pendiente":
        return "bg-yellow-500/20 text-yellow-400";
      case "Vencida":
        return "bg-red-500/20 text-red-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };
  const canPay = (status: string) =>
    status === "Pendiente" || status === "Vencida";

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex gap-2 flex-1">
          <Input
            placeholder="Buscar factura..."
            className="bg-input border-border text-foreground flex-1"
          />
          <Button
            variant="outline"
            className="border-border text-foreground hover:bg-input"
          >
            <Filter className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Tabla */}
      <Card className="border border-border bg-card overflow-hidden">
        <CardHeader>
          <CardTitle className="text-foreground">Mis Facturas</CardTitle>
          <CardDescription>Historial completo de facturación</CardDescription>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-semibold">
                    Factura
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold">
                    Cliente
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold">
                    Monto
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold">
                    Fecha
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold">
                    Estado
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold">
                    Acciones
                  </th>
                </tr>
              </thead>

              <tbody>
                {loading && (
                  <tr>
                    <td colSpan={6} className="text-center py-6">
                      Cargando facturas...
                    </td>
                  </tr>
                )}

                {!loading && invoices.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="text-center py-6 text-muted-foreground"
                    >
                      No tienes facturas todavía
                    </td>
                  </tr>
                )}

                {invoices.map((invoice, indx) => (
                  <tr
                    key={indx}
                    className="border-b border-border hover:bg-input/50 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <Link
                        href={`facturacion/order/${invoice.invoiceNumber}`}
                        className="flex items-center gap-2 text-primary hover:underline"
                      >
                        <Link2 className="w-4 h-4" />
                        <span className="font-mono text-sm">
                          {invoice.invoiceNumber}
                        </span>
                      </Link>
                    </td>

                    <td className="py-3 px-4 text-sm">{invoice.clientName}</td>

                    <td className="py-3 px-4 font-semibold">
                      ${invoice.total}
                    </td>

                    <td className="py-3 px-4 text-sm text-muted-foreground">
                      {new Date(invoice.createdAt).toLocaleDateString()}
                    </td>

                    <td className="py-3 px-4">
                      <Badge
                        className={`text-xs font-semibold border-0 ${getStatusBadge(
                          invoice.status,
                        )}`}
                      >
                        {invoice.status}
                      </Badge>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        {canPay(invoice.status) ? (
                          <div className="flex">
                            <div onClick={() => setSelectedInvoice(invoice)}>
                              <PayphoneButton
                                amount={Math.round(invoice.total)}
                                reference={invoice.invoiceNumber}
                                email={invoice.clientEmail}
                              />
                            </div>
                            <Button
                              onClick={() =>
                                router.push(
                                  `facturacion/order/${invoice.invoiceNumber}`,
                                )
                              }
                              className="w-full ml-2 bg-green-500 hover:bg-green-600"
                            >
                              Ver Factura
                            </Button>
                          </div>
                        ) : (
                          <div className="flex">
                            <Button
                              onClick={() =>
                                router.push(
                                  `/confirm-paid-client?id=${invoice.transactionId}&clientTransactionId=${invoice.clientTransactionId}`,
                                )
                              }
                              size="lg"
                              className="w-full mr-2 bg-blue-500 hover:bg-blue-600"
                            >
                              Ver Detalles de Pago
                            </Button>
                            <Button
                              onClick={() =>
                                router.push(
                                  `facturacion/order/${invoice.invoiceNumber}`,
                                )
                              }
                              className="w-full bg-green-500 hover:bg-green-600"
                            >
                              Ver Factura
                            </Button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border border-border bg-card">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-2">
              Total Facturado
            </p>
            <p className="text-3xl font-bold text-foreground mb-2">
              ${totalFacturado.toFixed(2)}
            </p>
            <p className="text-xs text-green-500">+12% vs mes anterior</p>
          </CardContent>
        </Card>

        <Card className="border border-border bg-card">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-2">
              Facturas Pagadas
            </p>
            <p className="text-3xl font-bold text-green-500 mb-2">
              {facturasPagadas.length}
            </p>
            <p className="text-xs text-muted-foreground">
              de {invoices.length} facturas
            </p>
          </CardContent>
        </Card>

        <Card className="border border-border bg-card">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-2">
              Pendientes de Pago
            </p>
            <p className="text-3xl font-bold text-yellow-500 mb-2">
              ${totalPendiente.toFixed(2)}
            </p>
            <p className="text-xs text-muted-foreground">
              {facturasPendientes.length} factura(s) pendiente(s)
            </p>
          </CardContent>
        </Card>

        <Card className="border border-border bg-card">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-2">Vencidas</p>
            <p className="text-3xl font-bold text-red-500 mb-2">
              ${totalVencido.toFixed(2)}
            </p>
            <p className="text-xs text-muted-foreground">
              {facturasVencidas.length} factura(s) vencida(s)
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
