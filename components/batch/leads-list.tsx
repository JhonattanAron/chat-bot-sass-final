"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, Share2, ExternalLink, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";

interface Lead {
  _id: string;
  company_name: string;
  url: string;
  meta_description?: string;
  emails?: string[];
  phones?: string[];
  social_links?: string[];
  extraction_status: string;
}

interface LeadsListProps {
  batchId: string;
  reloadTrigger?: number;
}

export function LeadsList({ batchId, reloadTrigger }: LeadsListProps) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeads = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `http://localhost:8081/batches/${batchId}/leads`
        );
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "Failed to fetch leads");
        }
        const data = await response.json();
        setLeads(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, [batchId, reloadTrigger]);

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-6">
          Loading leads...
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive">
        <CardContent className="flex items-center gap-2 p-6 text-destructive">
          <AlertCircle className="h-5 w-5" />
          <p>Error loading leads: {error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!leads || leads.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center gap-4 p-12 text-center">
          <div className="rounded-full bg-muted p-4">
            <Mail className="h-8 w-8 text-muted-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">No leads yet</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Click "Extract Information" to start scraping company data
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Extracted Leads ({leads.length})</h2>
      <div className="grid gap-4">
        {leads.map((lead) => (
          <Card key={lead._id}>
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg">
                    {lead.company_name || "Unknown Company"}
                  </CardTitle>
                  <a
                    href={lead.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline inline-flex items-center gap-1 mt-1"
                  >
                    <span className="truncate">{lead.url}</span>
                    <ExternalLink className="h-3 w-3 flex-shrink-0" />
                  </a>
                </div>
                <Badge
                  variant={
                    lead.extraction_status === "extracted"
                      ? "default"
                      : lead.extraction_status === "failed"
                      ? "destructive"
                      : "outline"
                  }
                >
                  {lead.extraction_status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {lead.meta_description && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {lead.meta_description}
                </p>
              )}

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {lead.emails && lead.emails.length > 0 && (
                  <div className="flex items-start gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-muted-foreground mb-1">
                        Emails
                      </p>
                      <div className="space-y-1">
                        {lead.emails
                          .slice(0, 2)
                          .map((email: string, i: number) => (
                            <p key={i} className="text-sm truncate">
                              {email}
                            </p>
                          ))}
                        {lead.emails.length > 2 && (
                          <p className="text-xs text-muted-foreground">
                            +{lead.emails.length - 2} more
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {lead.phones && lead.phones.length > 0 && (
                  <div className="flex items-start gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-muted-foreground mb-1">
                        Phones
                      </p>
                      <div className="space-y-1">
                        {lead.phones
                          .slice(0, 2)
                          .map((phone: string, i: number) => (
                            <p key={i} className="text-sm truncate">
                              {phone}
                            </p>
                          ))}
                        {lead.phones.length > 2 && (
                          <p className="text-xs text-muted-foreground">
                            +{lead.phones.length - 2} more
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {lead.social_links && lead.social_links.length > 0 && (
                  <div className="flex items-start gap-2">
                    <Share2 className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-muted-foreground mb-1">
                        Social
                      </p>
                      <div className="space-y-1">
                        {lead.social_links
                          .slice(0, 2)
                          .map((link: string, i: number) => (
                            <a
                              key={i}
                              href={link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-primary hover:underline block truncate"
                            >
                              {link}
                            </a>
                          ))}
                        {lead.social_links.length > 2 && (
                          <p className="text-xs text-muted-foreground">
                            +{lead.social_links.length - 2} more
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
