"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertCircle,
  Loader2,
  CheckCircle2,
  Clock,
  MapPin,
  Download,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface Batch {
  _id: string;
  query: string;
  location: { lat: number; lng: number };
  radius: number;
  status: "pending" | "running" | "done";
  total_places: number;
  createdAt: string;
  isDeepSearch?: boolean;
  previousBatchId?: string;
}

export function GoogleMapsBatchList() {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);
  const [extracting, setExtracting] = useState<string | null>(null);
  const { data: session } = useSession();

  useEffect(() => {
    fetchBatches();
  }, []);

  const fetchBatches = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/backend/google-maps-leads/${session?.binding_id}/list`,
      );
      if (response.ok) {
        const data = await response.json();
        setBatches(data);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleExtract = async (batchId: string) => {
    setExtracting(batchId);
    try {
      const response = await fetch(
        `/api/backend/google-maps-leads/${batchId}/extract`,
        {
          method: "POST",
        },
      );

      if (response.ok) {
        await fetchBatches();
        alert("Extraction completed!");
      } else {
        alert("Extraction failed");
      }
    } finally {
      setExtracting(null);
    }
  };

  const handleEnrich = async (batchId: string) => {
    setExtracting(batchId);
    try {
      const response = await fetch(`/api/google-maps-leads/${batchId}/enrich`, {
        method: "POST",
      });

      if (response.ok) {
        await fetchBatches();
        alert("Enrichment completed!");
      } else {
        alert("Enrichment failed");
      }
    } finally {
      setExtracting(null);
    }
  };

  const handleExportCSV = async (batchId: string) => {
    try {
      const response = await fetch(
        `/api/backend/google-maps-leads/${batchId}/export/csv`,
      );
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `batch-${batchId}.csv`;
        a.click();
      }
    } catch (error) {
      console.error("Export failed:", error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case "running":
        return <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />;
      case "done":
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-50">
            Pending
          </Badge>
        );
      case "running":
        return <Badge className="bg-blue-600">Running</Badge>;
      case "done":
        return <Badge className="bg-green-600">Done</Badge>;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (batches.length === 0) {
    return (
      <Card className="p-8 text-center">
        <AlertCircle className="w-12 h-12 mx-auto text-gray-400 mb-4" />
        <p className="text-gray-600">
          No batches yet. Create one to get started!
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {batches.map((batch) => (
        <Card
          key={batch._id}
          className="p-6 bg-white shadow-lg hover:shadow-xl transition-shadow"
        >
          {/* Deep Search Alert */}
          {batch.isDeepSearch && (
            <Alert className="mb-4 border-blue-200 bg-blue-50">
              <AlertCircle className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                <span className="font-semibold">Deep Search Mode</span>
                <p className="text-sm mt-1">
                  This zone was previously scraped. Searching for additional
                  businesses...
                </p>
              </AlertDescription>
            </Alert>
          )}

          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <Link href={`google-maps/leads/${batch._id}`}>
                  <h3 className="text-lg font-bold text-gray-900">
                    {batch.query}
                  </h3>
                </Link>
                {getStatusBadge(batch.status)}
              </div>

              <div className="space-y-1 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>
                    {batch.location.lat.toFixed(4)},{" "}
                    {batch.location.lng.toFixed(4)} • {batch.radius}m radius
                  </span>
                </div>
                <p>
                  Found leads:{" "}
                  <span className="font-semibold text-gray-900">
                    {batch.total_places}
                  </span>
                </p>
                <p className="text-xs text-gray-500">
                  Created: {new Date(batch.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 mt-4 flex-wrap">
            {batch.status === "pending" && (
              <Button
                onClick={() => handleExtract(batch._id)}
                disabled={extracting === batch._id}
                className="bg-blue-600 hover:bg-blue-700"
                size="sm"
              >
                {extracting === batch._id ? (
                  <>
                    <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                    Extracting...
                  </>
                ) : (
                  "Start Extraction"
                )}
              </Button>
            )}

            {batch.status === "done" && (
              <>
                <Button
                  onClick={() => handleEnrich(batch._id)}
                  variant="outline"
                  size="sm"
                  disabled={extracting === batch._id}
                >
                  {extracting === batch._id ? (
                    <>
                      <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                      Enriching...
                    </>
                  ) : (
                    "Enrich Data"
                  )}
                </Button>
                <Button
                  onClick={() => handleExportCSV(batch._id)}
                  variant="outline"
                  size="sm"
                  disabled={extracting === batch._id}
                >
                  <Download className="w-3 h-3 mr-1" />
                  Export CSV
                </Button>
              </>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}
