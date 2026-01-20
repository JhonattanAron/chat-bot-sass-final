"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Bot,
  MessageSquare,
  Users,
  BarChart3,
  ArrowUpRight,
  PlusCircle,
  AlertCircle,
  Zap,
  Loader2,
} from "lucide-react";
import { TokenCounterGlobal } from "@/components/token-counter-global";
import { useDashboardStore } from "@/store/dashboard-store";
import { useSession } from "next-auth/react";

export default function DashboardPage() {
  const { data: session } = useSession();
  const {
    stats,
    bots,
    tokenUsage,
    isLoading,
    error,
    fetchDashboardData,
    clearError,
  } = useDashboardStore();

  useEffect(() => {
    if (session?.binding_id) {
      fetchDashboardData(session.binding_id);
      console.log("Fetching dashboard data for user:", session.binding_id);
    }
  }, [session?.binding_id, fetchDashboardData]);

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <AlertCircle className="h-12 w-12 text-destructive" />
          <div className="text-center">
            <h3 className="text-lg font-medium">Error loading dashboard</h3>
            <p className="text-sm text-muted-foreground mt-1">{error}</p>
            <Button onClick={clearError} className="mt-4">
              Try Again
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back! Here&apos;s an overview of your chatbots.
            </p>
          </div>
          <Link href="/dashboard/bots/create">
            <Button className="gap-1">
              <PlusCircle className="h-4 w-4" />
              Create Bot
            </Button>
          </Link>
        </div>

        {/* Token Usage Card */}
        <Card className="futuristic-card">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              Token Usage
            </CardTitle>
            <CardDescription>
              Monitor your token consumption and limits
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center h-20">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : tokenUsage ? (
              <TokenCounterGlobal
                inputTokens={tokenUsage.input_tokens}
                outputTokens={tokenUsage.output_tokens}
                maxTokens={tokenUsage.max_tokens}
              />
            ) : (
              <div className="text-center text-muted-foreground">
                No token usage data available
              </div>
            )}
          </CardContent>
        </Card>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card className="futuristic-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Bots
                  </CardTitle>
                  <Bot className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : (
                    <>
                      <div className="text-2xl font-bold">
                        {stats?.total_bots || 0}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {stats?.bots_change || "No change"}
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>
              <Card className="futuristic-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Messages
                  </CardTitle>
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : (
                    <>
                      <div className="text-2xl font-bold">
                        {stats?.total_messages?.toLocaleString() || 0}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {stats?.messages_change || "No change"}
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>
              <Card className="futuristic-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Active Users
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : (
                    <>
                      <div className="text-2xl font-bold">
                        {stats?.active_users?.toLocaleString() || 0}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {stats?.users_change || "No change"}
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>
              <Card className="futuristic-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Conversion Rate
                  </CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : (
                    <>
                      <div className="text-2xl font-bold">
                        {stats?.conversion_rate || 0}%
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {stats?.conversion_change || "No change"}
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4 futuristic-card">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>
                    Your chatbots&apos; activity over the last 30 days.
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[300px] flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="mx-auto h-12 w-12 text-muted-foreground" />
                    <p className="mt-2 text-sm text-muted-foreground">
                      Activity chart will appear here
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card className="col-span-3 futuristic-card">
                <CardHeader>
                  <CardTitle>Your Bots</CardTitle>
                  <CardDescription>
                    Status of your active chatbots.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex items-center justify-center h-40">
                      <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {bots.map((bot) => (
                        <div
                          key={bot.id}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className={`h-2 w-2 rounded-full ${
                                bot.status === "online"
                                  ? "bg-green-500"
                                  : bot.status === "maintenance"
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                              }`}
                            />
                            <span className="text-sm font-medium">
                              {bot.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground capitalize">
                              {bot.status}
                            </span>
                            <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                          </div>
                        </div>
                      ))}
                      {bots.length === 0 && (
                        <div className="text-center text-muted-foreground">
                          No bots found
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent
            value="analytics"
            className="h-[400px] flex items-center justify-center"
          >
            <div className="text-center">
              <BarChart3 className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">Analytics Dashboard</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Detailed analytics will appear here.
              </p>
            </div>
          </TabsContent>
          <TabsContent
            value="reports"
            className="h-[400px] flex items-center justify-center"
          >
            <div className="text-center">
              <BarChart3 className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">Reports</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Your custom reports will appear here.
              </p>
            </div>
          </TabsContent>
          <TabsContent
            value="notifications"
            className="h-[400px] flex items-center justify-center"
          >
            <div className="text-center">
              <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">Notifications</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                You have no new notifications.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
