"use client";

import React, { useRef, useEffect, useState } from "react";
import html2pdf from "html2pdf.js";
import { Download } from "lucide-react";
import { DashboardLayout } from "@/components/pages/dashboard/dashboard-layout";
import Image from "next/image";
import { Invoice, useInvoicesStore } from "@/store/facturas-store";
import { PayphoneButton } from "@/components/payments-metods/checkout-form-payphone";

type InvoiceStatus =
  | "Pagada"
  | "Pendiente"
  | "Vencida"
  | "Borrador"
  | "Enviada";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function InvoicePage({ params }: PageProps) {
  const invoiceRef = useRef<HTMLDivElement>(null);

  const { fetchInvoiceByNumber } = useInvoicesStore();

  const [invoice, setInvoice] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(
    null,
  );

  useEffect(() => {
    params.then(setResolvedParams);
  }, [params]);

  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      if (event.data?.type === "payment_success") {
        const paymentData = event.data.data;

        try {
          await fetch(`/api/backend/invoices/${invoice._id}`, {
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

          setLoading(true);

          if (!resolvedParams) return;

          const data = await fetchInvoiceByNumber(resolvedParams.id);

          setInvoice(data);

          setLoading(false);
        } catch (error) {
          console.error("Error actualizando factura", error);
        }
      }
    };

    window.addEventListener("message", handleMessage);

    return () => window.removeEventListener("message", handleMessage);
  }, [resolvedParams, fetchInvoiceByNumber]);

  useEffect(() => {
    const loadInvoice = async () => {
      if (!resolvedParams) return;

      setLoading(true);

      const data = await fetchInvoiceByNumber(resolvedParams.id);

      setInvoice(data);

      setLoading(false);
    };

    loadInvoice();
  }, [resolvedParams, fetchInvoiceByNumber]);

  if (!resolvedParams) {
    return (
      <div className="flex items-center justify-center h-screen">
        Cargando...
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="flex items-center justify-center h-screen text-xl">
        Factura no encontrada
      </div>
    );
  }

  const products = invoice.items || [];
  const invoiceDate = invoice.issuedDate;
  const dueDate = invoice.dueDate;
  const paymentStatus = invoice.status;

  const subtotal = invoice.subtotal || 0;
  const tax = invoice.tax || 0;
  const discount = 0;
  const total = invoice.total || 0;

  const getStatusColor = (status: InvoiceStatus) => {
    switch (status) {
      case "Pagada":
        return "bg-green-100 text-green-800";
      case "Pendiente":
        return "bg-yellow-100 text-yellow-800";
      case "Vencida":
        return "bg-red-100 text-red-800";
      case "Borrador":
        return "bg-gray-100 text-gray-800";
      case "Enviada":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: InvoiceStatus) => {
    switch (status) {
      case "Pagada":
        return "Pagada";
      case "Pendiente":
        return "Pendiente";
      case "Vencida":
        return "Vencida";
      case "Borrador":
        return "Borrador";
      case "Enviada":
        return "Enviada";
      default:
        return "Desconocido";
    }
  };

  const downloadPDF = () => {
    if (!invoiceRef.current) return;

    const opt = {
      margin: 10,
      filename: `${invoice.invoiceNumber}.pdf`,
      image: { type: "jpeg" as const, quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: {
        orientation: "portrait" as const,
        unit: "mm" as const,
        format: "a4" as const,
      },
    };

    html2pdf().set(opt).from(invoiceRef.current).save();
  };

  const canPay = paymentStatus === "Pendiente" || paymentStatus === "Vencida";

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Factura {invoice.invoiceNumber}
              </h1>
              <p className="text-gray-600 mt-1">
                Gestión de facturas y documentos
              </p>
            </div>

            <div className=" ">
              <button
                onClick={downloadPDF}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-7 mb-3 py-2 rounded-lg font-medium transition-colors"
              >
                <Download size={20} />
                Descargar PDF
              </button>
              {canPay && (
                <PayphoneButton
                  amount={total}
                  reference={invoice.invoiceNumber}
                  email={invoice.clientEmail}
                />
              )}
            </div>
          </div>

          {/* Factura */}
          <div
            ref={invoiceRef}
            className="bg-white rounded-lg shadow-lg p-8 mb-8"
          >
            {/* Header factura */}
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
                  Aurentric AI Labs
                </h2>

                <p className="text-gray-600 text-sm">
                  Número:{" "}
                  <span className="font-semibold text-gray-900">
                    {invoice.invoiceNumber}
                  </span>
                </p>

                <p className="text-gray-600 text-sm">
                  Fecha:{" "}
                  <span className="font-semibold text-gray-900">
                    {invoiceDate
                      ? new Date(invoiceDate).toLocaleDateString("es-ES")
                      : "-"}
                  </span>
                </p>

                <p className="text-gray-600 text-sm">
                  Vencimiento:{" "}
                  <span className="font-semibold text-gray-900">
                    {dueDate
                      ? new Date(dueDate).toLocaleDateString("es-ES")
                      : "-"}
                  </span>
                </p>
              </div>

              <div className="text-right">
                <div
                  className={`inline-block px-4 py-2 rounded-lg font-semibold ${getStatusColor(
                    paymentStatus,
                  )}`}
                >
                  {getStatusLabel(paymentStatus)}
                </div>

                <p className="text-gray-600 text-sm mt-4">Método de pago:</p>
                <p className="font-semibold text-gray-900">
                  {"Online - Credit Card"}
                </p>
              </div>
            </div>

            {/* Cliente */}
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
              </div>
            </div>

            {/* Productos */}
            <div className="mb-8">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-300">
                    <th className="text-left py-3 px-4 font-semibold">
                      Descripción
                    </th>
                    <th className="text-right py-3 px-4 font-semibold">
                      Cantidad
                    </th>
                    <th className="text-right py-3 px-4 font-semibold">
                      P. Unitario
                    </th>
                    <th className="text-right py-3 px-4 font-semibold">
                      Total
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {products.map((product: any, index: number) => (
                    <tr key={index} className="border-b border-gray-200">
                      <td className="py-4 px-4">
                        <p className="font-semibold">{product.description}</p>
                      </td>

                      <td className="text-right py-4 px-4">
                        {product.quantity}
                      </td>

                      <td className="text-right py-4 px-4">
                        ${product.unitPrice.toFixed(2)}
                      </td>

                      <td className="text-right py-4 px-4 font-semibold">
                        ${(product.quantity * product.unitPrice).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totales */}
            <div className="flex justify-end mb-8">
              <div className="w-full sm:w-80">
                <div className="flex justify-between py-2 border-b">
                  <span>Subtotal:</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between py-2 border-b">
                    <span>Descuento:</span>
                    <span className="text-red-600">
                      -${discount.toFixed(2)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between py-2 border-b">
                  <span>Impuestos:</span>
                  <span>${tax.toFixed(2)}</span>
                </div>

                <div className="flex justify-between py-3 bg-blue-50 px-4 rounded-lg">
                  <span className="font-semibold text-lg">Total:</span>
                  <span className="font-bold text-blue-600 text-lg">
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Notas */}
            {invoice.notes && (
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold mb-2">Notas:</h3>
                <p className="text-sm">{invoice.notes}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
