"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { LeadsFilters } from "@/components/google-maps/leads-filters";
import { GoogleMapsLeadsTable } from "@/components/google-maps/leads-table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { Lead, LeadsFiltersType } from "@/lib/types/leads";
import { DashboardLayout } from "@/components/pages/dashboard/dashboard-layout";
import {
  DialogHeader,
  DialogFooter,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { Label } from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function LeadsContent() {
  const params = useParams();
  const batchId = params.id as string;
  const isPremium = true; // TODO: obtener del usuario
  const [isNormalizeOpen, setIsNormalizeOpen] = useState(false);
  const [country, setCountry] = useState("EC");
  const [isNormalizing, setIsNormalizing] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEnriching, setIsEnriching] = useState(false);

  const [filters, setFilters] = useState<LeadsFiltersType>({
    search: "",
    source: "all",
    rating: "all",
    batch_id: "",
  });

  /* ======================
     FETCH LEADS BY BATCH
  ====================== */

  useEffect(() => {
    if (!batchId) return;

    const fetchLeads = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(
          `/api/backend/google-maps-leads/${batchId}/leads`,
        );
        if (!res.ok) throw new Error("Failed to load leads");

        const data = await res.json();
        console.log(data);

        setLeads(Array.isArray(data) ? data : data.leads || []);
      } catch (e) {
        toast.error("Failed to load leads");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeads();
  }, [batchId]);

  /* ======================
     ENRICH
  ====================== */

  const handleEnrich = async () => {
    setIsEnriching(true);
    try {
      const res = await fetch(
        `/api/backend/google-maps-leads/${batchId}/enrich`,
        { method: "POST" },
      );

      if (!res.ok) throw new Error();
      toast.success("Enrichment started");

      // Reload leads after enrich
      setTimeout(() => window.location.reload(), 1500);
    } catch {
      toast.error("Failed to enrich leads");
    } finally {
      setIsEnriching(false);
    }
  };
  const handleDeleteLeadsWithoutPhone = async () => {
    setIsDeleting(true);

    try {
      const res = await fetch(
        `/api/backend/google-maps-leads/${batchId}/delete-without-phone`,
        {
          method: "POST",
        },
      );

      if (!res.ok) throw new Error();

      const data = await res.json();

      toast.success(`Se eliminaron ${data.deleted} leads sin teléfono`);

      // refrescar tabla
      setLeads((prev) =>
        prev.filter((lead) => lead.phone && lead.phone !== ""),
      );

      setOpenDeleteModal(false);
    } catch {
      toast.error("Error eliminando leads");
    } finally {
      setIsDeleting(false);
    }
  };
  const handleNormalize = async () => {
    try {
      setIsNormalizing(true);

      const res = await fetch(
        `/api/backend/google-maps-leads/${batchId}/normalize-phones`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ country }),
        },
      );

      if (!res.ok) throw new Error();

      const data = await res.json();

      toast.success(
        `Normalized ${data.updated} numbers (${data.skipped} skipped)`,
      );

      setIsNormalizeOpen(false);
      window.location.reload();
    } catch {
      toast.error("Failed to normalize phones");
    } finally {
      setIsNormalizing(false);
    }
  };

  /* ======================
     FILTERS
  ====================== */

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      if (filters.search) {
        const s = filters.search.toLowerCase();
        if (
          !lead.name.toLowerCase().includes(s) &&
          !lead.address.toLowerCase().includes(s)
        )
          return false;
      }

      if (filters.rating === "gte_4" && (!lead.rating || lead.rating < 4))
        return false;

      if (filters.rating === "gte_4_5" && (!lead.rating || lead.rating < 4.5))
        return false;

      if (filters.source !== "all" && lead.source !== filters.source)
        return false;

      return true;
    });
  }, [filters, leads]);

  /* ======================
     UI
  ====================== */

  return (
    <DashboardLayout>
      <div className="space-y-6 p-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Leads</CardTitle>
              <CardDescription>
                Businesses extracted from Google Maps
              </CardDescription>
            </div>
            <div className="flex justify-around w-1/2">
              <Button
                onClick={handleEnrich}
                disabled={!isPremium || isEnriching}
                className={
                  isPremium ? "" : "cursor-not-allowed opacity-70 border-dashed"
                }
                variant={isPremium ? "default" : "outline"}
              >
                {isEnriching
                  ? "Enriching..."
                  : isPremium
                    ? "Enrich Leads"
                    : "Enrich Leads (Premium)"}
              </Button>
              <Button
                onClick={() => setIsNormalizeOpen(true)}
                variant="default"
              >
                Normalize Phones (Premium)
              </Button>
              <Button
                variant="destructive"
                onClick={() => setOpenDeleteModal(true)}
              >
                Eliminar leads sin teléfono
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <LeadsFilters
              filters={filters}
              onFiltersChange={setFilters}
              batches={[]} // ya estamos en un batch fijo
            />

            <div className="flex justify-between text-sm text-muted-foreground">
              <p>
                Showing {filteredLeads.length} of {leads.length} leads
              </p>
            </div>

            <GoogleMapsLeadsTable leads={filteredLeads} isLoading={isLoading} />
          </CardContent>
        </Card>
      </div>
      <Dialog open={isNormalizeOpen} onOpenChange={setIsNormalizeOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Normalize phone numbers</DialogTitle>
            <DialogDescription>
              Convert phone numbers to international format
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <Label>Country</Label>
            <Select value={country} onValueChange={setCountry}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="EC">🇪🇨 Ecuador</SelectItem>
                <SelectItem value="CO">🇨🇴 Colombia</SelectItem>
                <SelectItem value="PE">🇵🇪 Perú</SelectItem>
                <SelectItem value="MX">🇲🇽 México</SelectItem>
                <SelectItem value="US">🇺🇸 USA</SelectItem>
                <SelectItem value="ES">🇪🇸 España</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button
              variant="secondary"
              onClick={() => setIsNormalizeOpen(false)}
            >
              Cancel
            </Button>

            <Button onClick={handleNormalize} disabled={isNormalizing}>
              {isNormalizing ? "Normalizing..." : "Normalize"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <AlertDialog open={openDeleteModal} onOpenChange={setOpenDeleteModal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar leads sin teléfono?</AlertDialogTitle>

            <AlertDialogDescription>
              Esta acción eliminará permanentemente todos los leads que no
              tengan número de teléfono.
              <br />
              <span className="font-semibold text-destructive">
                Esta acción no se puede deshacer.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>
              Cancelar
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={handleDeleteLeadsWithoutPhone}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Eliminando..." : "Sí, eliminar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}
