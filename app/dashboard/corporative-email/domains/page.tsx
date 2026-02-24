// app/dashboard/domains/page.tsx
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RefreshCw, Plus, Globe, Check, AlertCircle } from "lucide-react";

interface Domain {
  id: string;
  name: string;
  status: string;
  created_at: string;
  records?: Array<{
    record: string;
    name: string;
    type: string;
    value: string;
  }>;
}

export default function DomainsPage() {
  const { listDomains, createDomain, isLoading } = useEmail();
  const [domains, setDomains] = useState<Domain[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [newDomain, setNewDomain] = useState("");
  const [isAddingDomain, setIsAddingDomain] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const loadDomains = async () => {
    setIsRefreshing(true);
    try {
      const data = await listDomains();
      setDomains(data.data || []);
    } catch (error) {
      // Error handled by toast
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadDomains();
  }, []);

  const handleAddDomain = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDomain.trim()) return;

    setIsAddingDomain(true);
    try {
      await createDomain(newDomain);
      setNewDomain("");
      setShowForm(false);
      await loadDomains();
    } catch (error) {
      // Error handled by toast
    } finally {
      setIsAddingDomain(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "verified":
        return "bg-green-500/20 text-green-400";
      case "pending":
        return "bg-yellow-500/20 text-yellow-400";
      case "failed":
        return "bg-red-500/20 text-red-400";
      default:
        return "bg-slate-500/20 text-slate-400";
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Domains</h2>
          <p className="text-slate-400">
            Manage and verify your sending domains
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={loadDomains}
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
          <Button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Domain
          </Button>
        </div>
      </div>

      {showForm && (
        <Card className="mb-8 border-blue-700/50 bg-blue-900/20">
          <CardHeader>
            <CardTitle className="text-white">Add New Domain</CardTitle>
            <CardDescription>
              Enter a domain you own to set up for sending emails
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddDomain} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="domain" className="text-slate-300">
                  Domain Name
                </Label>
                <Input
                  id="domain"
                  type="text"
                  placeholder="example.com"
                  value={newDomain}
                  onChange={(e) => setNewDomain(e.target.value)}
                  disabled={isAddingDomain}
                  className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  type="submit"
                  disabled={isAddingDomain || !newDomain.trim()}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isAddingDomain ? (
                    <>
                      <div className="animate-spin mr-2 w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                      Adding...
                    </>
                  ) : (
                    "Add Domain"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                  className="border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {domains.length === 0 ? (
        <Card className="border-slate-700 bg-slate-800/50">
          <CardContent className="py-12 text-center">
            <Globe className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-300 mb-2">
              No domains configured
            </h3>
            <p className="text-slate-500 mb-4">
              Add your first domain to start sending emails from your own domain
            </p>
            <Button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Domain
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {domains.map((domain) => (
            <Card key={domain.id} className="border-slate-700 bg-slate-800/50">
              <CardContent className="py-6 px-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <Globe className="w-5 h-5 text-blue-400" />
                      <h3 className="text-lg font-semibold text-white">
                        {domain.name}
                      </h3>
                      <div
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(domain.status)}`}
                      >
                        {domain.status}
                      </div>
                    </div>
                    <p className="text-sm text-slate-500 mt-2">
                      Added{" "}
                      {new Date(domain.created_at).toLocaleDateString("es-ES")}
                    </p>
                  </div>
                </div>

                {domain.status === "pending" && domain.records && (
                  <div className="mt-4 p-4 rounded-lg bg-yellow-900/20 border border-yellow-700/50">
                    <div className="flex items-start gap-2 mb-3">
                      <AlertCircle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-yellow-300">
                        Add these DNS records to verify ownership:
                      </p>
                    </div>
                    <div className="space-y-2">
                      {domain.records.map((record, idx) => (
                        <div
                          key={idx}
                          className="bg-slate-700/50 p-3 rounded text-xs font-mono text-slate-300"
                        >
                          <p>
                            <span className="text-slate-500">Type:</span>{" "}
                            {record.type}
                          </p>
                          <p>
                            <span className="text-slate-500">Name:</span>{" "}
                            {record.name}
                          </p>
                          <p>
                            <span className="text-slate-500">Value:</span>{" "}
                            <code className="break-all">{record.value}</code>
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {domain.status === "verified" && (
                  <div className="mt-4 p-4 rounded-lg bg-green-900/20 border border-green-700/50 flex items-center gap-2">
                    <Check className="w-5 h-5 text-green-400" />
                    <p className="text-sm text-green-300">
                      Domain verified and ready to use
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
