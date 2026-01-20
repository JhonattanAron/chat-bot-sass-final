"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Search, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Batch {
  _id: string;
  search_query: string;
  status: string;
  created_at: string;
  total_urls?: number;
  processed_urls?: number;
}

export function BatchList() {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const res = await fetch("http://localhost:8081/batches?user_id=1"); // ajusta el user real
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Failed to fetch batches");
        setBatches(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error fetching batches");
      } finally {
        setLoading(false);
      }
    };

    fetchBatches();
  }, []);

  if (loading) return <p>Loading batches...</p>;

  if (error) {
    return (
      <Card className="border-destructive">
        <CardContent className="flex items-center gap-2 p-6 text-destructive">
          <AlertCircle className="h-5 w-5" />
          <p>Error loading batches: {error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!batches || batches.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center gap-4 p-12 text-center">
          <div className="rounded-full bg-muted p-4">
            <Search className="h-8 w-8 text-muted-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">No batches yet</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Create your first batch to start scraping company data
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {batches.map((batch) => (
        <Card key={batch._id} className="flex flex-col">
          <CardHeader>
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <CardTitle className="text-lg truncate">
                  {batch.search_query}
                </CardTitle>
                <CardDescription className="mt-1">
                  {new Date(batch.created_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </CardDescription>
              </div>
              <Badge
                variant={
                  batch.status === "completed"
                    ? "default"
                    : batch.status === "processing"
                    ? "secondary"
                    : batch.status === "failed"
                    ? "destructive"
                    : "outline"
                }
              >
                {batch.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Total URLs</p>
                <p className="text-2xl font-semibold">
                  {batch.total_urls || 0}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Processed</p>
                <p className="text-2xl font-semibold">
                  {batch.processed_urls || 0}
                </p>
              </div>
            </div>

            {batch.total_urls && batch.total_urls > 0 && (
              <div className="w-full bg-secondary rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{
                    width: `${
                      (batch.processed_urls! / batch.total_urls!) * 100
                    }%`,
                  }}
                />
              </div>
            )}

            <div className="flex gap-2 mt-auto pt-2">
              <Link href={`batch/reference/${batch._id}`} className="flex-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full gap-2 bg-transparent"
                >
                  <FileText className="h-4 w-4" />
                  View Details
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
