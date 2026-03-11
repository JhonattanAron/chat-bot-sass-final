"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useModelStore } from "@/store/Ai-models-store";
import FilterBar from "@/components/models-ai/filter-bar";
import ModelCard from "@/components/models-ai/models-card";
import { DashboardLayout } from "@/components/pages/dashboard/dashboard-layout";

const CATEGORIES = [
  "Todas",
  "Generación de Imágenes",
  "Texto",
  "Video",
  "Audio",
];

const SORT_OPTIONS = [
  { label: "Más populares", value: "popular" },
  { label: "Más recientes", value: "recent" },
  { label: "Menor costo", value: "cost" },
];

export default function Page() {
  const searchTerm = useModelStore((state) => state.searchTerm);
  const setSearchTerm = useModelStore((state) => state.setSearchTerm);
  const selectedCategory = useModelStore((state) => state.selectedCategory);
  const setSelectedCategory = useModelStore(
    (state) => state.setSelectedCategory,
  );
  const sortBy = useModelStore((state) => state.sortBy);
  const setSortBy = useModelStore((state) => state.setSortBy);
  const getFilteredModels = useModelStore((state) => state.getFilteredModels);

  const sortedModels = getFilteredModels();

  return (
    <DashboardLayout>
      <main className="min-h-screen bg-background text-foreground">
        <div className="px-6 py-12 lg:px-8">
          {/* Header */}
          <div className="mb-12 max-w-4xl">
            <h1 className="text-5xl font-bold tracking-tight mb-4 text-balance">
              Modelos de Inteligencia Artificial
            </h1>
            <p className="text-lg text-muted-foreground text-balance">
              Explora y utiliza modelos avanzados de IA para generar imágenes,
              texto, video y más.
            </p>
          </div>

          {/* Search Bar */}
          <div className="mb-8 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar modelos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-card border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>
          </div>

          {/* Filter Bar */}
          <FilterBar
            categories={CATEGORIES}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            sortOptions={SORT_OPTIONS}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />

          {/* Models Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedModels.map((model) => (
              <ModelCard key={model.id} model={model} />
            ))}
          </div>

          {sortedModels.length === 0 && (
            <div className="py-20 text-center">
              <p className="text-lg text-muted-foreground">
                No se encontraron modelos que coincidan con tu búsqueda.
              </p>
            </div>
          )}
        </div>
      </main>
    </DashboardLayout>
  );
}
