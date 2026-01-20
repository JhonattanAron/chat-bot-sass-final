import { redirect, notFound } from "next/navigation";
import { DashboardHeader } from "@/components/batch/dashboard-header";
import { BatchDetails } from "@/components/batch/batch-details";
import { LeadsList } from "@/components/batch/leads-list";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { DashboardLayout } from "@/components/dashboard-layout";

interface Batch {
  _id: string;
  id?: string; // para compatibilidad con componentes que usan batch.id
  user_id: string;
  search_query: string;
  total_urls: number;
  processed_urls: number;
  status: string;
  created_at: string;
  updated_at: string;
}

interface BatchPageProps {
  params: { id: string };
  batchFromApi: Batch;
}

export default async function BatchPage({ params }: BatchPageProps) {
  const { id } = params;

  try {
    const res = await fetch(`http://localhost:8081/batches/${id}`, {
      cache: "no-store",
    });

    const batchFromApi: Batch = await res.json();
    // Mapear _id a id para compatibilidad con componentes
    const batch: Batch = { ...batchFromApi, id: batchFromApi._id };

    return (
      <div className="flex min-h-screen flex-col bg-background">
        <DashboardLayout>
          <main className="flex-1">
            <div className="container mx-auto px-4 py-8 md:px-6">
              <BatchDetails batch={batch} />
              <div className="mt-8">
                <LeadsList batchId={batch.id!} />
              </div>
            </div>
          </main>
        </DashboardLayout>
      </div>
    );
  } catch (error) {
    console.error("Failed to fetch batch:", error);
    notFound();
  }
}
