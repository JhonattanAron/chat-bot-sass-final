"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, Eye, Trash2, Plus, Filter, Link2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function InvoicesTab() {
  return (
    <div className="space-y-6">
      {/* Filtros y Acciones */}
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

      {/* Tabla de Facturas */}
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
                  <th className="text-left py-3 px-4 font-semibold text-foreground text-sm">
                    Factura
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground text-sm">
                    Cliente
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground text-sm">
                    Monto
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground text-sm">
                    Fecha
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground text-sm">
                    Estado
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground text-sm">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    id: "INV-2024-001",
                    client: "Empresa A",
                    amount: "$1,250.00",
                    date: "15 Feb 2024",
                    status: "Pagada",
                  },
                  {
                    id: "INV-2024-002",
                    client: "Empresa B",
                    amount: "$850.50",
                    date: "14 Feb 2024",
                    status: "Pendiente",
                  },
                  {
                    id: "INV-2024-003",
                    client: "Empresa C",
                    amount: "$2,500.00",
                    date: "13 Feb 2024",
                    status: "Pagada",
                  },
                  {
                    id: "INV-2024-004",
                    client: "Empresa D",
                    amount: "$450.00",
                    date: "12 Feb 2024",
                    status: "Vencida",
                  },
                  {
                    id: "INV-2024-005",
                    client: "Empresa E",
                    amount: "$1,800.00",
                    date: "11 Feb 2024",
                    status: "Pagada",
                  },
                ].map((invoice) => (
                  <tr
                    key={invoice.id}
                    className="border-b border-border hover:bg-input/50 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <Link
                        href={`facturacion/order/${invoice.id}`}
                        className="flex items-center gap-1 text-sm text-primary hover:underline"
                      >
                        <span className="font-mono text-sm text-primary">
                          <Link2 />
                          {invoice.id}
                        </span>
                      </Link>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-foreground">
                        {invoice.client}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-foreground">
                        {invoice.amount}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-muted-foreground">
                        {invoice.date}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        className={`text-xs font-semibold border-0 ${
                          invoice.status === "Pagada"
                            ? "bg-green-500/20 text-green-400"
                            : invoice.status === "Pendiente"
                              ? "bg-yellow-500/20 text-yellow-400"
                              : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {invoice.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-foreground hover:bg-border h-8 w-8 p-0"
                          title="Ver"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-foreground hover:bg-border h-8 w-8 p-0"
                          title="Descargar"
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-destructive hover:bg-destructive/10 h-8 w-8 p-0"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
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
            <p className="text-3xl font-bold text-foreground mb-2">$6,850.50</p>
            <p className="text-xs text-green-500">+12% vs mes anterior</p>
          </CardContent>
        </Card>

        <Card className="border border-border bg-card">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-2">
              Facturas Pagadas
            </p>
            <p className="text-3xl font-bold text-green-500 mb-2">3</p>
            <p className="text-xs text-muted-foreground">de 5 facturas</p>
          </CardContent>
        </Card>

        <Card className="border border-border bg-card">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-2">
              Pendientes de Pago
            </p>
            <p className="text-3xl font-bold text-yellow-500 mb-2">$850.50</p>
            <p className="text-xs text-muted-foreground">1 factura pendiente</p>
          </CardContent>
        </Card>

        <Card className="border border-border bg-card">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-2">Vencidas</p>
            <p className="text-3xl font-bold text-red-500 mb-2">$450.00</p>
            <p className="text-xs text-muted-foreground">1 factura vencida</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
