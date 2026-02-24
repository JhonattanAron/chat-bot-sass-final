// app/dashboard/history/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useEmail } from "@/contexts/EmailContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, Mail, Clock } from "lucide-react";

interface Email {
  id: string;
  from_email: string;
  to: string;
  subject: string;
  created_at: string;
  status: string;
}

export default function HistoryPage() {
  const { listEmails, isLoading } = useEmail();
  const [emails, setEmails] = useState<Email[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadEmails = async () => {
    setIsRefreshing(true);
    try {
      const data = await listEmails(50, 0);
      setEmails(data.data || []);
    } catch (error) {
      // Error handled by toast
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadEmails();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "sent":
        return "bg-green-500/20 text-green-400";
      case "bounced":
        return "bg-red-500/20 text-red-400";
      case "complained":
        return "bg-orange-500/20 text-orange-400";
      default:
        return "bg-slate-500/20 text-slate-400";
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Email History</h2>
          <p className="text-slate-400">
            View all emails sent through this account
          </p>
        </div>
        <Button
          onClick={loadEmails}
          disabled={isRefreshing}
          variant="outline"
          className="border-slate-600 text-slate-300 hover:bg-slate-700"
        >
          {isRefreshing ? (
            <>
              <div className="animate-spin mr-2 w-4 h-4 border-2 border-current border-t-transparent rounded-full"></div>
              Refreshing...
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </>
          )}
        </Button>
      </div>

      {emails.length === 0 ? (
        <Card className="border-slate-700 bg-slate-800/50">
          <CardContent className="py-12 text-center">
            <Mail className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-300 mb-2">
              No emails yet
            </h3>
            <p className="text-slate-500">
              Start sending emails to see them appear here
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {emails.map((email) => (
            <Card
              key={email.id}
              className="border-slate-700 bg-slate-800/50 hover:bg-slate-800/70 transition-colors"
            >
              <CardContent className="py-4 px-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">
                      {email.subject}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-slate-400">
                      <span className="truncate">To: {email.to}</span>
                      <span className="flex items-center gap-1 whitespace-nowrap">
                        <Clock className="w-3 h-3" />
                        {formatDate(email.created_at)}
                      </span>
                    </div>
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ml-4 ${getStatusColor(email.status)}`}
                  >
                    {email.status}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
