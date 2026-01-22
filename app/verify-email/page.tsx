import VerifyEmailClient from "@/components/pages/verify-email";
import { Suspense } from "react";

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<p>Verificando correo...</p>}>
      <VerifyEmailClient />
    </Suspense>
  );
}
