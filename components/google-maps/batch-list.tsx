"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MapPin, Play, Download, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface Batch {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  radius: number;
  status: "pending" | "running" | "completed" | "failed";
  createdAt: string;
  resultsCount: number;
}

interface BatchListProps {
  refreshTrigger?: number;
}

export function GoogleMapsBatchList({ refreshTrigger }: BatchListProps) {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [executingId, setExecutingId] = useState<string | null>(null);
  const { data: session } = useSession();

  useEffect(() => {
    fetchBatches();
  }, [refreshTrigger]);

  const fetchBatches = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/backend/google-maps-leads/${session?.binding_id}/list`,
      );
      if (!response.ok) throw new Error("Failed to fetch batches");

      const data = await response.json();

      const normalized: Batch[] = data.map((item: any) => ({
        id: item._id,
        name: item.query,
        latitude: item.location.lat,
        longitude: item.location.lng,
        radius: item.radius,
        status: item.status,
        createdAt: item.createdAt,
        resultsCount: item.total_places ?? 0,
      }));

      setBatches(normalized);
    } catch (error) {
      console.error("[v0] Error fetching batches:", error);
      toast.error("Failed to load batches");
    } finally {
      setIsLoading(false);
    }
  };

  const handleExecute = async (batchId: string) => {
    setExecutingId(batchId);
    try {
      const response = await fetch(
        `/api/backend/google-maps-leads/${batchId}/extract`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ batchId }),
        },
      );

      if (!response.ok) throw new Error("Failed to execute batch");
      toast.success("Batch execution started!");
      fetchBatches();
    } catch (error) {
      console.error("[v0] Error executing batch:", error);
      toast.error("Failed to execute batch");
    } finally {
      setExecutingId(null);
    }
  };

  const handleExport = async (batchId: string) => {
    try {
      const response = await fetch(
        `/api/backend/batches/export?batchId=${batchId}`,
      );
      if (!response.ok) throw new Error("Failed to export");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `batch-${batchId}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success("Data exported successfully!");
    } catch (error) {
      console.error("[v0] Error exporting batch:", error);
      toast.error("Failed to export data");
    }
  };

  const handleDelete = async (batchId: string) => {
    if (!confirm("Are you sure you want to delete this batch?")) return;

    try {
      const response = await fetch("/api/backend/batches/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ batchId }),
      });

      if (!response.ok) throw new Error("Failed to delete batch");
      toast.success("Batch deleted successfully!");
      fetchBatches();
    } catch (error) {
      console.error("Error deleting batch:", error);
      toast.error("Failed to delete batch");
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "pending":
        return "outline";
      case "running":
        return "secondary";
      case "completed":
        return "default";
      case "failed":
        return "destructive";
      default:
        return "outline";
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          Your Batches
        </CardTitle>
        <CardDescription>
          Manage and execute your scraping batches
        </CardDescription>
      </CardHeader>
      <CardContent>
        {batches.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No batches yet. Create your first batch to get started!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Radius</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Results</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {batches.map((batch) => (
                  <TableRow key={batch.id}>
                    <TableCell className="font-medium">
                      <Link href={`google-maps/leads/${batch.id}`}>
                        {batch.name}
                      </Link>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {batch.latitude.toFixed(4)}, {batch.longitude.toFixed(4)}
                    </TableCell>
                    <TableCell className="text-sm">
                      {(batch.radius / 1000).toFixed(1)} km
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeColor(batch.status)}>
                        {batch.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {batch.resultsCount || "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleExecute(batch.id)}
                          disabled={
                            executingId === batch.id ||
                            batch.status === "running"
                          }
                          title="Execute batch"
                        >
                          {executingId === batch.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Play className="w-4 h-4" />
                          )}
                        </Button>
                        {batch.status === "completed" && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleExport(batch.id)}
                            title="Export as CSV"
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(batch.id)}
                          className="text-red-600 hover:text-red-700"
                          title="Delete batch"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
