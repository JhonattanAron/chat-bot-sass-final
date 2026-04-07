"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/shop/cart-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  CheckCircle,
  ShoppingCart,
  Plus,
  Loader2,
  X,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { PayphoneButton } from "../payments-metods/checkout-form-payphone";
import { tr } from "date-fns/locale";

// Mock data for saved addresses and payment methods
const SAVED_ADDRESSES = [
  {
    id: "1",
    name: "Casa",
    address: "Calle Principal 123",
    city: "Madrid",
    zipCode: "28001",
  },
  {
    id: "2",
    name: "Oficina",
    address: "Avenida Negocios 456",
    city: "Barcelona",
    zipCode: "08002",
  },
];

const SAVED_PAYMENT_METHODS = [
  {
    id: "1",
    name: "Visa ****1234",
    cardNumber: "4532123456781234",
    expiryDate: "12/26",
  },
  {
    id: "2",
    name: "Mastercard ****5678",
    cardNumber: "5555555555555678",
    expiryDate: "08/25",
  },
];

export default function CheckoutPage() {
  const router = useRouter();
  const cart = useCartStore((state) => state.cart);
  const loading = useCartStore((state) => state.loading);
  const syncCart = useCartStore((state) => state.syncCart);
  const clearCart = useCartStore((state) => state.clearCart);
  const { removeItem } = useCartStore();

  const items = cart?.items || [];
  const { data: session } = useSession();

  const [selectedAddressId, setSelectedAddressId] = useState<string>("1");
  const [selectedPaymentId, setSelectedPaymentId] = useState<string>("1");
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    company: "",
    address: "",
    city: "",
    zipCode: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderData, setOrderData] = useState<any>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const createInvoice = async () => {
    const totalPrice = cart?.total || 0;

    const response = await fetch("/api/backend/invoices/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        clientName: session?.user?.email,
        clientEmail: session?.user?.email,
        clientAddress: "Quito Pifo Ecuador",
        items: cart?.items,
        transactionId: "",
        clientTransactionId: "",
        subtotal: totalPrice,
        tax: 15,
        total: totalPrice,
        notes: ``,
      }),
    });

    if (!response.ok) throw new Error("Error al crear la factura");

    const invoice = await response.json();

    // Guardamos en localStorage
    localStorage.setItem("invoiceNumber", invoice.invoiceNumber);

    setOrderData(invoice);

    return invoice;
  };

  // Cargar carrito al montar
  useEffect(() => {
    syncCart();
  }, []);

  const selectedAddress = SAVED_ADDRESSES.find(
    (a) => a.id === selectedAddressId,
  );
  const selectedPayment = SAVED_PAYMENT_METHODS.find(
    (p) => p.id === selectedPaymentId,
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePaymentConfirm = async (paymentData: any) => {
    console.log(paymentData.reference);

    if (!paymentData?.reference) return;
    console.log("handle paymem te ejecutado");

    setIsProcessing(true);
    setPaymentError(null);

    try {
      const totalPrice = cart?.total || 0;

      // Actualizamos la factura existente en vez de crear otra
      const response = await fetch(
        `/api/backend/invoices/${paymentData.reference}/number`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            transactionId: paymentData.transactionId,
            clientTransactionId: paymentData.clientTransactionId,
            notes: `Pago confirmado ID: ${paymentData.transactionId}`,
            total: totalPrice,
          }),
        },
      );

      if (!response.ok) throw new Error("Error al actualizar la factura");

      const result = await response.json();
      setOrderData(result.order);
      setOrderComplete(true);

      setTimeout(() => {
        router.push(`/dashboard/facturacion/order/${paymentData.reference}`);
      }, 2000);
    } catch (error) {
      setPaymentError("Error al procesar el pago. Intenta de nuevo.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Escuchar mensajes del popup de pago
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      console.log("Evento de pago:", event.data.type);

      if (event.data.type === "payment_success") {
        console.log("Pago confirmado, procesando...", event.data.data);
        handlePaymentConfirm(event.data.data);
      } else if (event.data.type === "payment_error") {
        setPaymentError("Error en el pago: " + event.data.error);
      } else if (event.data.type === "payment_cancelled") {
        setPaymentError(null);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [router, orderData?.orderId]);

  const totalPrice = cart?.total || 0;

  // Si no hay carrito o está cargando
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Cargando carrito...</p>
        </div>
      </div>
    );
  }

  // Si no hay items en el carrito
  if (!cart?.items || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <ShoppingCart className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h1 className="text-2xl font-bold mb-2">Carrito Vacío</h1>
          <p className="text-muted-foreground mb-6">
            No hay productos en tu carrito. Selecciona un plan o addons para
            continuar.
          </p>
          <Button
            onClick={() => router.push("/")}
            className="bg-primary hover:bg-primary/90"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a Planes
          </Button>
        </div>
      </div>
    );
  }

  // Order complete state
  if (orderComplete) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full mb-6 shadow-lg">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold mb-3">¡Pedido Completado!</h1>
            <p className="text-lg text-muted-foreground">
              Gracias por tu compra. Un correo de confirmación ha sido enviado a
              <br />
              <span className="font-semibold text-primary">
                {orderData?.billing?.email || formData.email}
              </span>
            </p>
          </div>

          <div className="bg-gradient-to-br from-secondary to-background border border-border rounded-2xl p-8 mb-8">
            <h2 className="text-xl font-bold mb-2">Número de Pedido</h2>
            <p className="text-2xl font-bold text-primary mb-6">
              {orderData?.orderId}
            </p>

            <h3 className="text-xl font-bold mb-6">Detalles del Pedido</h3>

            <div className="space-y-3 mb-6 pb-6 border-b border-border">
              {cart?.items?.map((item: any, idx) => (
                <div key={idx} className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold">
                      {item.name || item.description}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {item.type === "plan"
                        ? "Plan " + item.billingInterval
                        : "Addon"}
                      {item.quantity &&
                        item.quantity > 1 &&
                        ` x${item.quantity}`}
                    </p>
                  </div>
                  <span className="font-bold text-lg">
                    ${(item.price * (item.quantity || 1)).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-4 rounded-xl">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-lg">Total</span>
                <span className="text-3xl font-bold text-primary">
                  ${totalPrice.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              onClick={async () => {
                await clearCart();
                router.push("/");
              }}
              className="flex-1 bg-gradient-to-r from-primary to-accent hover:shadow-lg py-3 text-lg font-semibold"
            >
              Volver a Planes
            </Button>
            <Button
              onClick={() => router.push("/")}
              variant="outline"
              className="flex-1 py-3 text-lg font-semibold"
            >
              Continuar Comprando
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-6xl mx-auto px-4">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-8 font-semibold"
        >
          <ArrowLeft className="h-5 w-5" />
          Volver
        </button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Formulario */}
          <div className="lg:col-span-2">
            <div className="bg-card border border-border rounded-2xl p-8">
              <h2 className="text-3xl font-bold mb-8">
                Información de Facturación
              </h2>

              <form className="space-y-6">
                {/* Información Personal y Dirección de Facturación */}
                <div className="pb-6 border-b border-border">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-bold flex items-center justify-center">
                      1
                    </span>
                    Dirección de Facturación
                  </h3>

                  <div className="space-y-4">
                    {/* Select de direcciones guardadas */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Dirección guardada
                      </label>
                      <Select
                        value={selectedAddressId}
                        onValueChange={setSelectedAddressId}
                      >
                        <SelectTrigger className="h-12 rounded-lg">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {SAVED_ADDRESSES.map((addr) => (
                            <SelectItem key={addr.id} value={addr.id}>
                              {addr.name} - {addr.address}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Form para nueva dirección de facturación */}
                    {showAddressForm ? (
                      <div className="bg-secondary p-4 rounded-lg space-y-3 border border-border">
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-sm font-semibold">
                            Nueva Dirección de Facturación
                          </p>
                          <button
                            type="button"
                            onClick={() => setShowAddressForm(false)}
                            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                          >
                            Cancelar
                          </button>
                        </div>

                        <div>
                          <label className="block text-xs font-medium mb-1">
                            Email *
                          </label>
                          <Input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required={showAddressForm}
                            placeholder="tu@email.com"
                            className="h-10 rounded-lg text-sm"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium mb-1">
                            Nombre completo *
                          </label>
                          <Input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            required={showAddressForm}
                            placeholder="Juan Pérez"
                            className="h-10 rounded-lg text-sm"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium mb-1">
                            Empresa
                          </label>
                          <Input
                            type="text"
                            name="company"
                            value={formData.company}
                            onChange={handleInputChange}
                            placeholder="Tu empresa"
                            className="h-10 rounded-lg text-sm"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium mb-1">
                            Dirección *
                          </label>
                          <Input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            required={showAddressForm}
                            placeholder="Calle 123"
                            className="h-10 rounded-lg text-sm"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium mb-1">
                              Ciudad *
                            </label>
                            <Input
                              type="text"
                              name="city"
                              value={formData.city}
                              onChange={handleInputChange}
                              required={showAddressForm}
                              placeholder="Madrid"
                              className="h-10 rounded-lg text-sm"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-medium mb-1">
                              Código postal *
                            </label>
                            <Input
                              type="text"
                              name="zipCode"
                              value={formData.zipCode}
                              onChange={handleInputChange}
                              required={showAddressForm}
                              placeholder="28001"
                              className="h-10 rounded-lg text-sm"
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <>
                        {/* Resumen de dirección seleccionada */}
                        {selectedAddress && (
                          <div className="bg-secondary p-4 rounded-lg border border-border">
                            <p className="text-sm font-semibold mb-2">
                              {selectedAddress.name}
                            </p>
                            <div className="space-y-1 text-sm text-muted-foreground">
                              <p>{selectedAddress.address}</p>
                              <p>
                                {selectedAddress.city},{" "}
                                {selectedAddress.zipCode}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Botón para agregar nueva */}
                        <button
                          type="button"
                          onClick={() => setShowAddressForm(true)}
                          className="w-full py-2 px-4 border border-dashed border-border rounded-lg text-sm font-medium text-primary hover:bg-secondary transition-colors flex items-center justify-center gap-2"
                        >
                          <Plus className="w-4 h-4" />
                          Agregar nueva dirección
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Método de Pago */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-bold flex items-center justify-center">
                        2
                      </span>
                      Método de Pago
                    </h3>
                  </div>

                  <div className="space-y-4">
                    {/* Select de métodos de pago guardados */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Tarjeta guardada
                      </label>
                      <Select
                        value={selectedPaymentId}
                        onValueChange={setSelectedPaymentId}
                      >
                        <SelectTrigger className="h-12 rounded-lg">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {SAVED_PAYMENT_METHODS.map((payment) => (
                            <SelectItem key={payment.id} value={payment.id}>
                              {payment.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Form para nueva tarjeta */}
                    {showPaymentForm && (
                      <div className="bg-secondary p-4 rounded-lg space-y-3 border border-border">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm font-semibold">Nueva Tarjeta</p>
                          <button
                            type="button"
                            onClick={() => setShowPaymentForm(false)}
                            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                          >
                            Cancelar
                          </button>
                        </div>

                        <div>
                          <label className="block text-xs font-medium mb-1">
                            Número de tarjeta *
                          </label>
                          <Input
                            type="text"
                            name="cardNumber"
                            value={formData.cardNumber}
                            onChange={handleInputChange}
                            required={showPaymentForm}
                            placeholder="4532 1234 5678 9010"
                            className="h-10 rounded-lg text-sm"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium mb-1">
                              Expiración *
                            </label>
                            <Input
                              type="text"
                              name="expiryDate"
                              value={formData.expiryDate}
                              onChange={handleInputChange}
                              required={showPaymentForm}
                              placeholder="MM/YY"
                              className="h-10 rounded-lg text-sm"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-medium mb-1">
                              CVV *
                            </label>
                            <Input
                              type="text"
                              name="cvv"
                              value={formData.cvv}
                              onChange={handleInputChange}
                              required={showPaymentForm}
                              placeholder="123"
                              className="h-10 rounded-lg text-sm"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Resumen de tarjeta seleccionada */}
                    {selectedPayment && !showPaymentForm && (
                      <div className="bg-secondary p-4 rounded-lg border border-border">
                        <p className="text-sm font-semibold">
                          {selectedPayment.name}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Vence: {selectedPayment.expiryDate}
                        </p>
                      </div>
                    )}

                    {/* Botón para agregar nuevo */}
                    {!showPaymentForm && (
                      <button
                        type="button"
                        onClick={() => setShowPaymentForm(true)}
                        className="w-full py-2 px-4 border border-dashed border-border rounded-lg text-sm font-medium text-primary hover:bg-secondary transition-colors flex items-center justify-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Agregar nueva tarjeta
                      </button>
                    )}
                  </div>
                </div>
              </form>

              {/* Error Message */}
              {paymentError && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-700">{paymentError}</p>
                </div>
              )}

              {/* Payment Button */}
              <div className="mt-8">
                <PayphoneButton
                  amount={totalPrice}
                  reference={"ORD_" + Date.now()}
                  email={session?.user?.email}
                  onBeforePay={createInvoice}
                />
              </div>
            </div>
          </div>

          {/* Resumen del Pedido */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 bg-card border border-border rounded-2xl p-6">
              <h3 className="text-xl font-bold mb-6">Resumen del Pedido</h3>

              <div className="space-y-3 mb-6 pb-6 border-b border-border">
                {items.map((item: any) => (
                  <div
                    key={item.itemId}
                    className="bg-secondary p-4 rounded-xl space-y-2"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold">{item.name}</h3>

                        <p className="text-sm text-muted-foreground">
                          {item.currency} {item.price} x {item.quantity}
                        </p>

                        {item.billingInterval && (
                          <p className="text-xs text-muted-foreground">
                            {item.billingInterval}
                          </p>
                        )}
                      </div>

                      <button
                        onClick={() => removeItem(item.itemId)}
                        className="p-1 hover:bg-border rounded"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-sm font-semibold text-primary">
                      {item.currency} {(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Impuestos</span>
                  <span>$0.00</span>
                </div>
              </div>

              <div className="bg-gradient-to-br from-primary/15 to-accent/10 p-4 rounded-xl border border-primary/20">
                <p className="text-xs text-muted-foreground mb-1">
                  Total a pagar
                </p>
                <p className="text-3xl font-bold text-primary">
                  ${totalPrice.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
