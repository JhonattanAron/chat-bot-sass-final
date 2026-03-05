import ConfirmPaymentClient from "@/components/pages/confirms/loadingConfirmPaid";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<div>Verificando pago...</div>}>
      <ConfirmPaymentClient />
    </Suspense>
  );
}
