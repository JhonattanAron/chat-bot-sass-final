"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { LeadsFiltersType } from "@/lib/types/leads";

interface LeadsFiltersProps {
  filters: LeadsFiltersType;
  onFiltersChange: (filters: LeadsFiltersType) => void;
  batches: string[];
}

export function LeadsFilters({
  filters,
  onFiltersChange,
  batches,
}: LeadsFiltersProps) {
  const handleSearchChange = (value: string) => {
    onFiltersChange({ ...filters, search: value });
  };

  const handleRatingChange = (value: string) => {
    onFiltersChange({
      ...filters,
      rating: value as LeadsFiltersType["rating"],
    });
  };

  const handleBatchChange = (value: string) => {
    onFiltersChange({ ...filters, batch_id: value });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="space-y-2">
        <Label htmlFor="search">Search by name or address</Label>
        <Input
          id="search"
          placeholder="Search..."
          value={filters.search}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="rating">Minimum Rating</Label>
        <Select value={filters.rating} onValueChange={handleRatingChange}>
          <SelectTrigger id="rating">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All ratings</SelectItem>
            <SelectItem value="gte_4">4.0+</SelectItem>
            <SelectItem value="gte_4_5">4.5+</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
