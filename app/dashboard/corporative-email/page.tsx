// app/dashboard/page.tsx
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEmail } from "@/contexts/EmailContext";
import { Mail, Send, Globe, FileText } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const { accountInfo } = useEmail();

  const quickLinks = [
    {
      title: "Send Email",
      description: "Compose and send emails through Resend",
      icon: Send,
      href: "corporative-email/send",
      color: "bg-blue-600/20 text-blue-400",
    },
    {
      title: "View Inbox",
      description: "Check your email history and status",
      icon: Mail,
      href: "corporative-email/inbox",
      color: "bg-purple-600/20 text-purple-400",
    },
    {
      title: "Manage Domains",
      description: "Configure and verify your domains",
      icon: Globe,
      href: "corporative-email/domains",
      color: "bg-green-600/20 text-green-400",
    },
    {
      title: "Email Templates",
      description: "Create reusable email templates",
      icon: FileText,
      href: "corporative-email/templates",
      color: "bg-orange-600/20 text-orange-400",
    },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Welcome back!</h2>
        <p className="text-slate-400">
          {accountInfo?.from_email
            ? `Connected as ${accountInfo.from_email}`
            : "Your email management dashboard"}
        </p>
      </div>

      {accountInfo?.quota && (
        <Card className="mb-8 border-slate-700 bg-slate-800/50">
          <CardHeader>
            <CardTitle className="text-white">Account Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-slate-700/50">
                <p className="text-sm text-slate-400 mb-1">Monthly Quota</p>
                <p className="text-2xl font-bold text-white">
                  {accountInfo.quota}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-slate-700/50">
                <p className="text-sm text-slate-400 mb-1">Status</p>
                <p className="text-2xl font-bold text-green-400">Active</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {quickLinks.map((link) => {
          const Icon = link.icon;
          return (
            <Link key={link.href} href={link.href}>
              <Card className="border-slate-700 bg-slate-800/50 hover:bg-slate-800 cursor-pointer transition-all h-full">
                <CardHeader>
                  <div
                    className={`w-12 h-12 rounded-lg ${link.color} flex items-center justify-center mb-3`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <CardTitle className="text-white">{link.title}</CardTitle>
                  <CardDescription>{link.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          );
        })}
      </div>

      <div className="mt-8 p-6 rounded-lg border border-slate-700 bg-slate-800/30">
        <h3 className="text-white font-semibold mb-2">Quick Start</h3>
        <p className="text-slate-400 text-sm mb-4">
          Get started by composing your first email or exploring your email
          history.
        </p>
        <div className="flex gap-3">
          <Button asChild className="bg-blue-600 hover:bg-blue-700">
            <Link href="/dashboard/send">Send Email</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="border-slate-600 text-slate-300 hover:bg-slate-700"
          >
            <Link href="/dashboard/history">View History</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
