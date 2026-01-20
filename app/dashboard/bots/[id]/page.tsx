import Link from "next/link"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, BarChart3, Bot, Edit, Globe, MessageSquare, Settings, Users } from "lucide-react"

export default function BotDetailsPage({ params }: { params: { id: string } }) {
  // This would normally be fetched from an API
  const bot = {
    id: params.id,
    name: params.id === "1" ? "Support Bot" : "Sales Bot",
    type: "web",
    status: "online",
    description: "Customer support chatbot for the website",
    lastActive: "2 minutes ago",
    messages: 1245,
    activeUsers: 78,
    conversionRate: "24.3%",
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Link href="/dashboard/bots">
              <Button variant="outline" size="icon">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
              </Button>
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-bold tracking-tight">{bot.name}</h1>
                <Badge variant="default">{bot.status.charAt(0).toUpperCase() + bot.status.slice(1)}</Badge>
              </div>
              <p className="text-muted-foreground">View and analyze your chatbot performance.</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link href={`/dashboard/bots/${bot.id}/edit`}>
              <Button variant="outline" className="gap-1">
                <Edit className="h-4 w-4" />
                Edit Bot
              </Button>
            </Link>
            <Link href={`/dashboard/bots/${bot.id}/settings`}>
              <Button className="gap-1">
                <Settings className="h-4 w-4" />
                Settings
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{bot.messages}</div>
              <p className="text-xs text-muted-foreground">+180 from last week</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{bot.activeUsers}</div>
              <p className="text-xs text-muted-foreground">+12 from yesterday</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{bot.conversionRate}</div>
              <p className="text-xs text-muted-foreground">+5.1% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Bot Type</CardTitle>
              {bot.type === "web" ? (
                <Globe className="h-4 w-4 text-muted-foreground" />
              ) : (
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              )}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold capitalize">{bot.type}</div>
              <p className="text-xs text-muted-foreground">Last active {bot.lastActive}</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="conversations">Conversations</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="logs">Logs</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Bot Performance</CardTitle>
                <CardDescription>View your chatbot's performance over time.</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="mx-auto h-12 w-12 text-muted-foreground" />
                  <p className="mt-2 text-sm text-muted-foreground">Performance chart will appear here</p>
                </div>
              </CardContent>
            </Card>
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Most Asked Questions</CardTitle>
                  <CardDescription>The most frequently asked questions by your users.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="font-medium">What are your business hours?</span>
                      <span className="text-muted-foreground">124 times</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">How do I reset my password?</span>
                      <span className="text-muted-foreground">98 times</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Do you offer free shipping?</span>
                      <span className="text-muted-foreground">87 times</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">What payment methods do you accept?</span>
                      <span className="text-muted-foreground">76 times</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">How can I contact customer support?</span>
                      <span className="text-muted-foreground">65 times</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Popular Products</CardTitle>
                  <CardDescription>Products most frequently viewed or purchased through the bot.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="font-medium">Premium Plan</span>
                      <span className="text-muted-foreground">45 views</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Basic Plan</span>
                      <span className="text-muted-foreground">38 views</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Custom Integration</span>
                      <span className="text-muted-foreground">27 views</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Enterprise Solution</span>
                      <span className="text-muted-foreground">19 views</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Starter Kit</span>
                      <span className="text-muted-foreground">14 views</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="conversations" className="h-[400px] flex items-center justify-center">
            <div className="text-center">
              <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">Conversation History</h3>
              <p className="mt-2 text-sm text-muted-foreground">View and analyze past conversations with your users.</p>
            </div>
          </TabsContent>
          <TabsContent value="analytics" className="h-[400px] flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">Detailed Analytics</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Comprehensive analytics about your chatbot's performance.
              </p>
            </div>
          </TabsContent>
          <TabsContent value="logs" className="h-[400px] flex items-center justify-center">
            <div className="text-center">
              <Bot className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">Bot Logs</h3>
              <p className="mt-2 text-sm text-muted-foreground">Technical logs and error reports for your chatbot.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
