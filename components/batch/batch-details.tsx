"use client";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Search,
  Download,
  FileText,
  RefreshCw,
  Brain,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import AnalyzeButton from "./AnalizeButton";

interface Batch {
  _id: string;
  search_query: string;
  total_urls: number;
  processed_urls: number;
  status: string;
  created_at: string;
  updated_at: string;
}

interface BatchDetailsProps {
  batch: Batch;
  onExtract?: () => void;
}

export function BatchDetails({ batch, onExtract }: BatchDetailsProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isExtracting, setIsExtracting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleExtract = async () => {
    setIsExtracting(true);
    try {
      const response = await fetch(
        `http://localhost:8081/batches/${batch._id}/extract`,
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to extract data");
      }

      const data = await response.json();

      toast({
        title: "Extraction started",
        description: `Processing ${data.processed} leads. This may take a few minutes.`,
      });
      onExtract?.();
      router.refresh();
      window.location.reload();
    } catch (error) {
      toast({
        title: "Extraction failed",
        description:
          error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    } finally {
      setIsExtracting(false);
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch(
        `http://localhost:8081/batches/${batch._id}/generate`,
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to generate text");
      }

      const data = await response.json();

      toast({
        title: "Plain text generated",
        description: `Successfully generated export for ${data.leadsCount} leads.`,
      });

      router.refresh();
    } catch (error) {
      toast({
        title: "Generation failed",
        description:
          error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const response = await fetch(
        `http://localhost:8081/batches/${batch._id}/export`
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to export data");
      }

      // Get the filename from Content-Disposition header (opcional)
      const filename = "export.txt";

      // Download the file
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Export successful",
        description: "Your plain text file has been downloaded.",
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description:
          error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">
              {batch.search_query}
            </h1>
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
          <p className="text-muted-foreground mt-1">
            Created on{" "}
            {new Date(batch.created_at).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total URLs</CardDescription>
            <CardTitle className="text-3xl">{batch.total_urls}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Processed</CardDescription>
            <CardTitle className="text-3xl">{batch.processed_urls}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Progress</CardDescription>
            <CardTitle className="text-3xl">
              {batch.total_urls > 0
                ? Math.round((batch.processed_urls / batch.total_urls) * 100)
                : 0}
              %
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Status</CardDescription>
            <CardTitle className="text-xl capitalize">{batch.status}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {batch.total_urls > 0 && (
        <div className="w-full bg-secondary rounded-full h-3">
          <div
            className="bg-primary h-3 rounded-full transition-all"
            style={{
              width: `${(batch.processed_urls / batch.total_urls) * 100}%`,
            }}
          />
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <Button
          onClick={handleExtract}
          disabled={
            isExtracting ||
            batch.status === "processing" ||
            batch.total_urls === 0
          }
          className="gap-2"
        >
          {isExtracting ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              Extracting...
            </>
          ) : (
            <>
              <Search className="h-4 w-4" />
              Extract Information
            </>
          )}
        </Button>
        <Button
          onClick={handleGenerate}
          disabled={isGenerating || batch.processed_urls === 0}
          variant="outline"
          className="gap-2 bg-transparent"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <FileText className="h-4 w-4" />
              Generate Plain Text
            </>
          )}
        </Button>
        <Button
          onClick={handleExport}
          variant="outline"
          className="gap-2 bg-transparent"
          disabled={isExporting || batch.processed_urls === 0}
        >
          {isExporting ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              Exporting...
            </>
          ) : (
            <>
              <Download className="h-4 w-4" />
              Export Data
            </>
          )}
        </Button>
        <AnalyzeButton />
      </div>
    </div>
  );
}
