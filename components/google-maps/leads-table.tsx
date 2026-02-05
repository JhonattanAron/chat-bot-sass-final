"use client";

import { Star, MapPin, Copy, Trash2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Lead } from "@/lib/types/leads";
import { toast } from "sonner";

interface LeadsTableProps {
  leads: Lead[];
  isLoading?: boolean;
}

export function GoogleMapsLeadsTable({ leads, isLoading }: LeadsTableProps) {
  const handleCopyPhone = (phone: string | undefined) => {
    if (!phone) return;
    navigator.clipboard.writeText(phone);
    toast.success("Phone copied to clipboard");
  };

  const handleViewOnMaps = (lat: number, lng: number) => {
    const mapsUrl = `https://www.google.com/maps/?q=${lat},${lng}`;
    window.open(mapsUrl, "_blank");
  };

  const handleDelete = (id: string) => {
    toast.success(`Lead ${id} would be deleted`);
  };

  const renderRating = (rating?: number) => {
    if (!rating) return <span className="text-gray-400">No rating</span>;

    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    return (
      <div className="flex items-center gap-1">
        <div className="flex gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={14}
              className={
                i < fullStars
                  ? "fill-yellow-400 text-yellow-400"
                  : i === fullStars && hasHalfStar
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
              }
            />
          ))}
        </div>
        <span className="text-sm text-gray-600">{rating.toFixed(1)}</span>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-12 bg-gray-200 rounded animate-pulse" />
        ))}
      </div>
    );
  }

  if (leads.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <MapPin className="w-12 h-12 text-gray-300 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900">No leads found</h3>
        <p className="text-sm text-gray-600 mt-1">
          Try adjusting your filters or create a new batch
        </p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="font-semibold">Business Name</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Website</TableHead>
            <TableHead>Address</TableHead>
            <TableHead className="text-center">Rating</TableHead>
            <TableHead>Source</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads.map((lead) => (
            <TableRow key={lead._id} className="hover:bg-gray-50 transition">
              <TableCell className="font-medium text-gray-900">
                {lead.name}
              </TableCell>
              <TableCell>
                {lead.phone ? (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">{lead.phone}</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCopyPhone(lead.phone)}
                            className="h-6 w-6 p-0"
                          >
                            <Copy size={14} />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Copy phone</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                ) : (
                  <span className="text-gray-400 text-sm">-</span>
                )}
              </TableCell>
              <TableCell>
                {lead.website ? (
                  <a
                    href={lead.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Visit
                    <ExternalLink size={14} />
                  </a>
                ) : (
                  <span className="text-gray-400 text-sm">-</span>
                )}
              </TableCell>
              <TableCell>
                <span className="text-sm text-gray-600">{lead.address}</span>
              </TableCell>
              <TableCell className="text-center">
                {renderRating(lead.rating)}
              </TableCell>
              <TableCell>
                <Badge variant="secondary" className="text-xs">
                  {lead.source === "google_places"
                    ? "Google Places"
                    : lead.source}
                </Badge>
              </TableCell>
              <TableCell>
                <span className="text-sm text-gray-600">
                  {new Date(lead.createdAt).toLocaleDateString()}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex justify-end gap-1">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            handleViewOnMaps(
                              lead.location.lat,
                              lead.location.lng,
                            )
                          }
                          className="h-8 w-8 p-0"
                        >
                          <MapPin size={16} />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>View on Maps</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(lead._id)}
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Delete lead</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
