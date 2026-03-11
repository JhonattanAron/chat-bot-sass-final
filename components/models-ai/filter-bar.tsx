"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FilterBarProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  sortOptions: Array<{ label: string; value: string }>;
  sortBy: string;
  onSortChange: (sort: string) => void;
}

export default function FilterBar({
  categories,
  selectedCategory,
  onCategoryChange,
  sortOptions,
  sortBy,
  onSortChange,
}: FilterBarProps) {
  return (
    <div className="mb-8 flex flex-col gap-4">
      {/* Category Filters */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            className={`${
              selectedCategory === category
                ? "bg-foreground text-background hover:bg-foreground/90"
                : "border-border text-foreground hover:bg-muted"
            } transition-all`}
            onClick={() => onCategoryChange(category)}
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Sort Dropdown */}
      <div className="flex items-center gap-3">
        <label className="text-sm font-medium text-muted-foreground">
          Ordenar por:
        </label>
        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger className="w-48 bg-card border-border text-foreground">
            <SelectValue placeholder="Seleccionar orden" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            {sortOptions.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
                className="text-foreground"
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
