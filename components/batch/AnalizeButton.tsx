"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Brain } from "lucide-react";

interface AnalyzeButtonProps {
  isAnalyzing?: boolean;
}

export default function AnalyzeButton({ isAnalyzing }: AnalyzeButtonProps) {
  const router = useRouter();

  return (
    <Button
      onClick={() => router.push("/dashboard/campaign")}
      variant="outline"
      className="gap-2 bg-transparent"
      disabled={isAnalyzing}
    >
      <Brain className="h-4 w-4" />
      Analizar Clientes y Crear Campañas
    </Button>
  );
}
