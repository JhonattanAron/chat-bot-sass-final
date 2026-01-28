import { notFound } from "next/navigation";
import { DashboardLayout } from "@/components/pages/dashboard/dashboard-layout";
import { BatchDetails } from "@/components/batch/batch-details";
import { LeadsList } from "@/components/batch/leads-list";
import { env } from "@/env";

interface Batch {
  _id: string;
  id?: string;
  user_id: string;
  search_query: string;
  total_urls: number;
  processed_urls: number;
  status: string;
  created_at: string;
  updated_at: string;
}

interface BatchPageProps {
  params: Promise<{ id: string }>;
}

export default async function BatchPage({ params }: BatchPageProps) {
  // ✅ Next.js 15: params es async
  const { id } = await params;

  try {
    const res = await fetch(
      `${env.NEXT_PUBLIC_API_URL}/api/backend/batches/${id}`,
      {
        cache: "no-store",
      },
    );

    if (!res.ok) {
      notFound();
    }

    const batchFromApi: Batch = await res.json();

    const batch: Batch = {
      ...batchFromApi,
      id: batchFromApi._id,
    };

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
