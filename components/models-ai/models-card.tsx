"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Star } from "lucide-react";
import Link from "next/link";
import DashboardLayout from "@/app/dashboard/corporative-email/layout";

interface Model {
  id: number;
  name: string;
  provider: string;
  category: string;
  description: string;
  cost: string;
  tags: string[];
  image: string;
}

export default function ModelCard({ model }: { model: Model }) {
  const tagColors: { [key: string]: string } = {
    rápido: "bg-blue-500/20 text-blue-400",
    "alta calidad": "bg-purple-500/20 text-purple-400",
    popular: "bg-yellow-500/20 text-yellow-400",
    creativo: "bg-pink-500/20 text-pink-400",
    eficiente: "bg-green-500/20 text-green-400",
    potente: "bg-red-500/20 text-red-400",
    versátil: "bg-indigo-500/20 text-indigo-400",
    confiable: "bg-cyan-500/20 text-cyan-400",
    innovador: "bg-orange-500/20 text-orange-400",
    profesional: "bg-violet-500/20 text-violet-400",
    natural: "bg-emerald-500/20 text-emerald-400",
    multiidioma: "bg-teal-500/20 text-teal-400",
    musical: "bg-fuchsia-500/20 text-fuchsia-400",
    preciso: "bg-lime-500/20 text-lime-400",
  };

  return (
    <div className="group relative overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:border-foreground/20 hover:shadow-lg hover:-translate-y-1">
      {/* Image Container */}
      <div className="relative h-48 w-full overflow-hidden bg-muted">
        <div className="absolute inset-0 bg-gradient-to-br from-foreground/5 to-transparent flex items-center justify-center">
          <div className="w-16 h-16 rounded-lg bg-muted-foreground/10 flex items-center justify-center">
            <div className="text-3xl">🤖</div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Header */}
        <div className="mb-4">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-bold text-lg text-foreground mb-1 line-clamp-2">
                {model.name}
              </h3>
              <p className="text-sm text-muted-foreground">{model.provider}</p>
            </div>
            {model.tags.includes("popular") && (
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400 flex-shrink-0" />
            )}
          </div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
            {model.category}
          </p>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {model.description}
        </p>

        {/* Cost */}
        <div className="mb-4 inline-block rounded-lg bg-muted/50 px-3 py-1">
          <p className="text-xs font-semibold text-foreground">{model.cost}</p>
        </div>

        {/* Tags */}
        <div className="mb-6 flex flex-wrap gap-2">
          {model.tags.map((tag) => (
            <span
              key={tag}
              className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${
                tagColors[tag] || "bg-muted/50 text-muted-foreground"
              }`}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <Button
            className="flex-1 bg-foreground text-background hover:bg-foreground/90 font-semibold transition-all duration-200 group-hover:shadow-lg"
            onClick={() => alert(`Probando ${model.name}`)}
          >
            Probar modelo
          </Button>
          <Link href={`ai-models/${model.id}`} className="flex-1">
            <Button
              variant="outline"
              className="w-full border-border text-foreground hover:bg-muted"
            >
              Ver detalles
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
