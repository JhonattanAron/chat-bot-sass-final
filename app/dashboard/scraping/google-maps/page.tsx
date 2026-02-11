"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GoogleMapsBatchList } from "@/components/google-maps/batch-list";
import { MapPin, List } from "lucide-react";
import Script from "next/script";
import { MapBatchCreator } from "@/components/google-maps/map-batch-creator";
import { DashboardLayout } from "@/components/pages/dashboard/dashboard-layout";

export default function DashboardContent() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleBatchCreated = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Google Maps Batch Manager
            </h1>
            <p className="text-gray-600">
              Create and manage batches for location-based scraping and
              enrichment
            </p>
          </div>

          <Tabs defaultValue="create" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="create" className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Create Batch
              </TabsTrigger>
              <TabsTrigger value="list" className="flex items-center gap-2">
                <List className="w-4 h-4" />
                My Batches
              </TabsTrigger>
            </TabsList>

            <TabsContent value="create" className="space-y-4">
              <Script
                src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}&libraries=places`}
                strategy="afterInteractive"
              />

              <MapBatchCreator onBatchCreated={handleBatchCreated} />
            </TabsContent>

            <TabsContent value="list" className="space-y-4">
              <GoogleMapsBatchList key={refreshTrigger} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
}
