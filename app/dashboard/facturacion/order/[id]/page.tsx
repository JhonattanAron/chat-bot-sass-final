"use client";

import React, { useRef } from "react";
import html2pdf from "html2pdf.js";
import { Download } from "lucide-react";
import { DashboardLayout } from "@/components/pages/dashboard/dashboard-layout";
import Image from "next/image";

// Mock data para facturas
const mockInvoices = {
  1: {
    id: "INV-001",
    clientName: "Juan García López",
    clientEmail: "juan.garcia@empresa.com",
    clientAddress: "Calle Principal 123, Madrid 28001, España",
    clientPhone: "+34 91 123 4567",
    invoiceDate: "2024-02-15",
    dueDate: "2024-03-15",
    paymentStatus: "paid",
    paymentMethod: "Transferencia Bancaria",
    products: [
      {
        id: 1,
        name: "Servicio de Consultoría",
        quantity: 10,
        unitPrice: 150,
        description: "Horas de consultoría técnica",
      },
      {
        id: 2,
        name: "Desarrollo de Módulo",
        quantity: 1,
        unitPrice: 2500,
        description: "Implementación de módulo personalizado",
      },
      {
        id: 3,
        name: "Soporte Técnico 3 meses",
        quantity: 1,
        unitPrice: 1200,
        description: "Soporte técnico prioritario",
      },
    ],
    subtotal: 4700,
    taxRate: 0.21,
    discount: 0,
    notes:
      "Gracias por tu confianza. Para cualquier duda, contacta con nuestro equipo de facturación.",
    bankDetails: "ES91 2100 0418 4502 0005 1332",
    bankName: "Banco Principal S.A.",
  },
  2: {
    id: "INV-002",
    clientName: "María Rodríguez Santos",
    clientEmail: "maria.rodriguez@negocio.com",
    clientAddress: "Av. Central 456, Barcelona 08002, España",
    clientPhone: "+34 93 567 8901",
    invoiceDate: "2024-02-10",
    dueDate: "2024-02-28",
    paymentStatus: "pending",
    paymentMethod: "Pendiente de pago",
    products: [
      {
        id: 1,
        name: "Licencia Software Annual",
        quantity: 5,
        unitPrice: 500,
        description: "Licencia anual por puesto",
      },
      {
        id: 2,
        name: "Mantenimiento y Actualizaciones",
        quantity: 1,
        unitPrice: 800,
        description: "Incluye actualizaciones y parches",
      },
    ],
    subtotal: 3300,
    taxRate: 0.21,
    discount: 300,
    notes:
      "Pago en 30 días desde la fecha de factura. Descuento por volumen aplicado.",
    bankDetails: "ES92 3100 0800 5302 0001 7650",
    bankName: "Banco Financiero S.A.",
  },
  3: {
    id: "INV-003",
    clientName: "Carlos Moreno Díaz",
    clientEmail: "carlos.moreno@tech.es",
    clientAddress: "Plaza Mayor 789, Valencia 46001, España",
    clientPhone: "+34 96 234 5678",
    invoiceDate: "2024-02-01",
    dueDate: "2024-02-15",
    paymentStatus: "overdue",
    paymentMethod: "Crédito",
    products: [
      {
        id: 1,
        name: "Hosting Cloud Premium",
        quantity: 1,
        unitPrice: 1500,
        description: "Servidor cloud dedicado 12 meses",
      },
      {
        id: 2,
        name: "Certificado SSL Wildcard",
        quantity: 1,
        unitPrice: 299,
        description: "Certificado SSL de seguridad",
      },
      {
        id: 3,
        name: "Backups Automáticos",
        quantity: 12,
        unitPrice: 50,
        description: "Backup mensual automático",
      },
    ],
    subtotal: 2599,
    taxRate: 0.21,
    discount: 0,
    notes:
      "Esta factura se encuentra vencida. Por favor, proceda al pago inmediatamente.",
    bankDetails: "ES93 4100 1200 8803 0002 3456",
    bankName: "Banco Digital S.A.",
  },
};

type InvoiceStatus = "paid" | "pending" | "overdue";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function InvoicePage({ params }: PageProps) {
  const invoiceRef = useRef<HTMLDivElement>(null);
  const [resolvedParams, setResolvedParams] = React.useState<{
    id: string;
  } | null>(null);

  React.useEffect(() => {
    params.then(setResolvedParams);
  }, [params]);

  if (!resolvedParams) {
    return (
      <div className="flex items-center justify-center h-screen">
        Cargando...
      </div>
    );
  }

  const invoice = mockInvoices[1];

  if (!invoice) {
    return (
      <div className="flex items-center justify-center h-screen text-xl">
        Factura no encontrada
      </div>
    );
  }

  const tax = invoice.subtotal * invoice.taxRate;
  const total = invoice.subtotal + tax - invoice.discount;

  const getStatusColor = (status: InvoiceStatus) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "overdue":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: InvoiceStatus) => {
    switch (status) {
      case "paid":
        return "Pagada";
      case "pending":
        return "Pendiente";
      case "overdue":
        return "Vencida";
      default:
        return "Desconocido";
    }
  };

  const downloadPDF = () => {
    if (!invoiceRef.current) return;
    const opt = {
      margin: 10,
      filename: `${invoice.id}.pdf`,
      image: { type: "jpeg" as const, quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: {
        orientation: "portrait" as const,
        unit: "mm" as const,
        format: "a4" as const,
      },
    };

    const element = invoiceRef.current;

    html2pdf().set(opt).from(element).save();
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header con botón de descarga */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Factura {invoice.id}
              </h1>
              <p className="text-gray-600 mt-1">
                Gestión de facturas y documentos
              </p>
            </div>
            <button
              onClick={downloadPDF}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              <Download size={20} />
              Descargar PDF
            </button>
          </div>

          {/* Contenedor de la factura para PDF */}
          <div
            ref={invoiceRef}
            className="bg-white rounded-lg shadow-lg p-8 mb-8"
          >
            {/* Header de la factura */}
            <div className="grid grid-cols-2 gap-8 mb-8 pb-8 border-b border-gray-200">
              <div>
                <h2 className="text-2xl font-bold text-blue-600 mb-2">
                  <Image
                    src="/logos/favicon.png"
                    alt="Logo"
                    width={50}
                    height={50}
                    className="inline-block mr-2"
                  />
                  Aurentric AI labs
                </h2>
                <p className="text-gray-600 text-sm">
                  Número:{" "}
                  <span className="font-semibold text-gray-900">
                    {invoice.id}
                  </span>
                </p>
                <p className="text-gray-600 text-sm">
                  Fecha:{" "}
                  <span className="font-semibold text-gray-900">
                    {new Date(invoice.invoiceDate).toLocaleDateString("es-ES")}
                  </span>
                </p>
                <p className="text-gray-600 text-sm">
                  Vencimiento:{" "}
                  <span className="font-semibold text-gray-900">
                    {new Date(invoice.dueDate).toLocaleDateString("es-ES")}
                  </span>
                </p>
              </div>
              <div className="text-right">
                <div
                  className={`inline-block px-4 py-2 rounded-lg font-semibold ${getStatusColor(invoice.paymentStatus as InvoiceStatus)}`}
                >
                  {getStatusLabel(invoice.paymentStatus as InvoiceStatus)}
                </div>
                <p className="text-gray-600 text-sm mt-4">Método de pago:</p>
                <p className="font-semibold text-gray-900">
                  {invoice.paymentMethod}
                </p>
              </div>
            </div>

            {/* Datos del cliente */}
            <div className="grid grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
                  Facturado a
                </h3>
                <p className="font-semibold text-gray-900 text-lg">
                  {invoice.clientName}
                </p>
                <p className="text-gray-600 text-sm">{invoice.clientAddress}</p>
                <p className="text-gray-600 text-sm mt-2">
                  <span className="font-semibold">Email:</span>{" "}
                  {invoice.clientEmail}
                </p>
                <p className="text-gray-600 text-sm">
                  <span className="font-semibold">Teléfono:</span>{" "}
                  {invoice.clientPhone}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
                  Detalles bancarios
                </h3>
                <p className="text-gray-600 text-sm">
                  <span className="font-semibold">Banco:</span>{" "}
                  {invoice.bankName}
                </p>
                <p className="text-gray-600 text-sm mt-2">
                  <span className="font-semibold">IBAN:</span>
                </p>
                <p className="font-mono text-sm text-gray-900 break-all">
                  {invoice.bankDetails}
                </p>
              </div>
            </div>

            {/* Tabla de productos */}
            <div className="mb-8">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-300">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">
                      Descripción
                    </th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-900">
                      Cantidad
                    </th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-900">
                      P. Unitario
                    </th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-900">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.products.map((product) => (
                    <tr
                      key={product.id}
                      className="border-b border-gray-200 hover:bg-gray-50"
                    >
                      <td className="py-4 px-4">
                        <p className="font-semibold text-gray-900">
                          {product.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {product.description}
                        </p>
                      </td>
                      <td className="text-right py-4 px-4 text-gray-900">
                        {product.quantity}
                      </td>
                      <td className="text-right py-4 px-4 text-gray-900">
                        €{product.unitPrice.toFixed(2)}
                      </td>
                      <td className="text-right py-4 px-4 font-semibold text-gray-900">
                        €{(product.quantity * product.unitPrice).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Resumen de totales */}
            <div className="flex justify-end mb-8">
              <div className="w-full sm:w-80">
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-700">Subtotal:</span>
                  <span className="font-semibold text-gray-900">
                    €{invoice.subtotal.toFixed(2)}
                  </span>
                </div>
                {invoice.discount > 0 && (
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-700">Descuento:</span>
                    <span className="font-semibold text-red-600">
                      -€{invoice.discount.toFixed(2)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-700">
                    IVA ({(invoice.taxRate * 100).toFixed(0)}%):
                  </span>
                  <span className="font-semibold text-gray-900">
                    €{tax.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between py-3 bg-blue-50 px-4 rounded-lg">
                  <span className="font-semibold text-gray-900 text-lg">
                    Total:
                  </span>
                  <span className="font-bold text-blue-600 text-lg">
                    €{total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Notas y términos */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Notas:</h3>
              <p className="text-sm text-gray-700">{invoice.notes}</p>
            </div>
          </div>

          {/* Información adicional */}
          <div className="grid grid-cols-2 gap-4 text-center text-sm text-gray-600">
            <div>
              <p className="font-semibold text-gray-900">¿Preguntas?</p>
              <p>Contacta con facturación@empresa.com</p>
            </div>
            <div>
              <p className="font-semibold text-gray-900">Términos de pago</p>
              <p>Pago dentro de 30 días desde la emisión</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
