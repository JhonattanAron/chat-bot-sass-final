import LoadConfirmPaidClient from "@/components/pages/confirms/confirmPaidClient";
import ConfirmPaymentClient from "@/components/pages/confirms/loadingConfirmPaid";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<LoadConfirmPaidClient />}>
      <ConfirmPaymentClient />
    </Suspense>
  );
}
