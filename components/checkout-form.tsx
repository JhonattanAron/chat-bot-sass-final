"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CheckCircle, Lock, Calendar } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useSession } from "next-auth/react";

declare global {
  interface Window {
    paypal: any;
  }
}

export interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  monthlyPrice?: number;
  interval: "yearly" | "monthly";
  discount?: string;
  features: string[];
  highlighted?: boolean;
}

interface PlanCheckoutProps {
  plans: Plan[];
  onSuccess?: (data: any) => void;
}

type BillingInterval = "monthly" | "yearly";

export function PlansCheckout({ plans, onSuccess }: PlanCheckoutProps) {
  const { toast } = useToast();
  const { data: session } = useSession();
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [billingInterval, setBillingInterval] =
    useState<BillingInterval>("yearly");
  const [visiblePlans, setVisiblePlans] = useState(true);
  const [userEmail, setUserEmail] = useState("");
  const [paypalReady, setPaypalReady] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const paypalContainerRef = useRef<HTMLDivElement>(null);
  const buttonRenderedRef = useRef(false);

  useEffect(() => {
    if (session?.user?.email) {
      setUserEmail(session.user.email);
    }
  }, [session]);

  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

    if (!clientId) {
      toast({
        title: "Error",
        description: "PayPal no está configurado",
        variant: "destructive",
      });
      return;
    }

    if (window.paypal?.Buttons) {
      setPaypalReady(true);
      return;
    }

    const script = document.createElement("script");
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=USD`;
    script.async = true;

    script.onload = () => {
      setPaypalReady(true);
    };

    script.onerror = () => {
      toast({
        title: "Error",
        description: "No se pudo cargar PayPal",
        variant: "destructive",
      });
    };

    document.head.appendChild(script);
  }, [toast]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getDisplayPrice = (plan: Plan) => {
    if (billingInterval === "monthly") {
      return plan.monthlyPrice || Math.round(plan.price / 12);
    }
    return plan.price;
  };

  useEffect(() => {
    if (
      !paypalReady ||
      !selectedPlan ||
      !userEmail ||
      !paypalContainerRef.current
    ) {
      return;
    }

    if (buttonRenderedRef.current) {
      return;
    }

    if (!window.paypal?.Buttons) {
      return;
    }

    buttonRenderedRef.current = true;

    try {
      setVisiblePlans(false);
      const finalPrice = getDisplayPrice(selectedPlan);

      window.paypal
        .Buttons({
          style: {
            layout: "vertical",
            color: "blue",
            shape: "rect",
            label: "pay",
          },
          createOrder: async () => {
            try {
              const response = await fetch("/api/paypal/create-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  planId: selectedPlan.id,
                  planName: selectedPlan.name,
                  amount: finalPrice.toString(),
                  email: userEmail,
                  interval: billingInterval,
                }),
              });

              if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || "Error creating order");
              }

              const data = await response.json();
              return data.id;
            } catch (error: any) {
              toast({
                title: "Error",
                description: error.message || "Error al crear la orden",
                variant: "destructive",
              });
              throw error;
            }
          },
          onApprove: async (data: any) => {
            try {
              setIsProcessing(true);

              const response = await fetch("/api/paypal/capture-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  orderId: data.orderID,
                  email: userEmail,
                  planId: selectedPlan.id,
                  planName: selectedPlan.name,
                  amount: getDisplayPrice(selectedPlan),
                  interval: billingInterval,
                }),
              });

              if (!response.ok) {
                throw new Error("Capture failed");
              }

              const result = await response.json();

              toast({
                title: "¡Pago exitoso!",
                description: `Tu suscripción a ${selectedPlan.name} ha sido activada. Recibirás confirmación en tu email.`,
              });

              setSelectedPlan(null);
              setUserEmail(session?.user?.email || "");
              buttonRenderedRef.current = false;

              onSuccess?.(result);
            } catch (error: any) {
              toast({
                title: "Error",
                description: error.message || "Error al procesar el pago",
                variant: "destructive",
              });
              buttonRenderedRef.current = false;
            } finally {
              setIsProcessing(false);
            }
          },
          onError: (error: any) => {
            toast({
              title: "Error",
              description: "Transacción cancelada",
              variant: "destructive",
            });
            buttonRenderedRef.current = false;
          },
        })
        .render(paypalContainerRef.current);
    } catch (error: any) {
      buttonRenderedRef.current = false;
    }
  }, [
    paypalReady,
    selectedPlan,
    userEmail,
    billingInterval,
    toast,
    onSuccess,
    session,
    getDisplayPrice,
  ]);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 text-balance">
          Planes y Precios
        </h1>
        <p className="text-lg text-muted-foreground">
          Elige el plan perfecto para tus necesidades
        </p>
      </div>

      <div className="mb-8 flex justify-center gap-4">
        <div className="inline-flex rounded-lg border border-input bg-muted p-1">
          <button
            onClick={() => setBillingInterval("monthly")}
            className={`px-6 py-2 rounded-md font-medium transition-colors ${
              billingInterval === "monthly"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Mensual
          </button>
          <button
            onClick={() => setBillingInterval("yearly")}
            className={`px-6 py-2 rounded-md font-medium transition-colors ${
              billingInterval === "yearly"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Anual
            {plans[0]?.discount && (
              <span className="ml-2 text-xs bg-green-500/20 text-green-700 dark:text-green-400 px-2 py-0.5 rounded">
                {plans[0].discount} OFF
              </span>
            )}
          </button>
        </div>
      </div>
      {visiblePlans && (
        <div className="mb-12 overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-4 px-4 font-semibold">Plan</th>
                <th className="text-center py-4 px-4 font-semibold">Precio</th>
                <th className="text-left py-4 px-4 font-semibold">
                  Características
                </th>
                <th className="text-center py-4 px-4 font-semibold">Acción</th>
              </tr>
            </thead>
            <tbody>
              {plans.map((plan) => (
                <tr
                  key={plan.id}
                  className={`border-b border-border hover:bg-accent/50 transition-colors ${
                    selectedPlan?.id === plan.id ? "bg-accent" : ""
                  }`}
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <div>
                        <div className="font-semibold">{plan.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {plan.description}
                        </div>
                      </div>
                      {plan.highlighted && (
                        <span className="ml-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                          Más Popular
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="text-center py-4 px-4">
                    <div className="font-bold text-lg">
                      ${getDisplayPrice(plan)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      /{billingInterval === "monthly" ? "mes" : "año"}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <ul className="text-sm space-y-1">
                      {plan.features.slice(0, 2).map((feature, i) => (
                        <li key={i} className="text-muted-foreground">
                          ✓ {feature}
                        </li>
                      ))}
                      {plan.features.length > 2 && (
                        <li className="text-muted-foreground">
                          ✓ +{plan.features.length - 2} más
                        </li>
                      )}
                    </ul>
                  </td>
                  <td className="text-center py-4 px-4">
                    <Button
                      variant={
                        selectedPlan?.id === plan.id ? "default" : "outline"
                      }
                      onClick={() => {
                        setSelectedPlan(plan);
                        buttonRenderedRef.current = false;
                        setTimeout(() => {
                          document
                            .getElementById("checkout-section")
                            ?.scrollIntoView({ behavior: "smooth" });
                        }, 100);
                      }}
                    >
                      {selectedPlan?.id === plan.id
                        ? "Seleccionado"
                        : "Seleccionar"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedPlan && (
        <div id="checkout-section" className="max-w-2xl mx-auto">
          <Alert className="mb-6 border-green-500/50 bg-green-500/5">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-700 dark:text-green-400">
              Activación inmediata después del pago. Recibirás confirmación por
              email.
            </AlertDescription>
          </Alert>

          <Card>
            <CardHeader>
              <CardTitle>Confirmación y Pago</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Selected plan summary */}
              <div className="bg-muted p-4 rounded-lg space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">
                      {selectedPlan.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {selectedPlan.description}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">
                      ${getDisplayPrice(selectedPlan)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {billingInterval === "monthly" ? "por mes" : "por año"}
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => {
                    setSelectedPlan(null);
                    setVisiblePlans(true);
                    setUserEmail(session?.user?.email || "");
                    buttonRenderedRef.current = false;
                  }}
                  className="w-full"
                >
                  Cambiar de plan
                </Button>

                <div className="border-t pt-3 text-sm text-muted-foreground flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Se renovará automáticamente cada{" "}
                    {billingInterval === "monthly" ? "mes" : "año"}
                  </span>
                </div>
              </div>

              {/* Features list */}
              <div>
                <h4 className="font-semibold mb-3">
                  Características incluidas:
                </h4>
                <ul className="space-y-2">
                  {selectedPlan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Email input */}
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  placeholder="tu@email.com"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-input bg-background"
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Recibirás confirmación y factura en este correo
                </p>
              </div>

              {/* PayPal button */}
              <div>
                {!paypalReady ? (
                  <div className="flex items-center justify-center gap-2 py-8 text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Cargando opciones de pago...</span>
                  </div>
                ) : (
                  <div
                    ref={paypalContainerRef}
                    className={
                      isProcessing ? "opacity-50 pointer-events-none" : ""
                    }
                  />
                )}
              </div>

              <div className="flex items-center gap-2 text-xs text-muted-foreground pt-4 border-t">
                <Lock className="h-4 w-4" />
                <span>Tu información está segura y encriptada</span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
