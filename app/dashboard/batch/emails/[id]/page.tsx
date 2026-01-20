"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, ArrowLeft, Download, Brain } from "lucide-react";
import { useSession } from "next-auth/react";

/* ---------------- Types ---------------- */

interface Lead {
  leadId: string;
  emails: string[];
}

/* ---------------- Utils ---------------- */

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function cleanEmail(email: string): string | null {
  const cleaned = email.trim();
  if (isValidEmail(cleaned)) return cleaned;

  const match = cleaned.match(/^[\w.\-+]+@[\w.-]+\.[a-zA-Z]{2,}/);
  return match && isValidEmail(match[0]) ? match[0] : null;
}

/* ---------------- Page ---------------- */

function BatchDetailContent() {
  const router = useRouter();
  const { id } = useParams<{ id?: string }>();

  const [leads, setLeads] = useState<Lead[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();

  useEffect(() => {
    if (!id) return;

    async function fetchEmails() {
      try {
        const res = await fetch(`http://localhost:8081/batches/${id}/emails`, {
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error("Failed to fetch batch emails");
        }

        const data: {
          batch_id: string;
          search_query: string;
          leads: Lead[];
        } = await res.json();

        setLeads(data.leads ?? []);
        setSearchQuery(data.search_query ?? "");
      } catch (error) {
        console.error("Error fetching emails:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchEmails();
  }, [id]);

  if (loading) {
    return <div className="p-8 text-muted-foreground">Cargando emails…</div>;
  }

  /* ---------------- Processing ---------------- */

  // Flatten all emails for UI display
  const allEmails = leads.flatMap((l) => l.emails);

  const validEmails = allEmails
    .map(cleanEmail)
    .filter((e): e is string => e !== null);

  const invalidEmails = allEmails.filter((e) => cleanEmail(e) === null);

  const validPercentage =
    allEmails.length > 0
      ? Math.round((validEmails.length / allEmails.length) * 100)
      : 0;

  const downloadCSV = () => {
    const blob = new Blob([validEmails.join("\n")], {
      type: "text/csv",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `batch-${id}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const normalizeEmailsWithAi = async () => {
    if (!id || leads.length === 0) return;

    try {
      setLoading(true);

      const res = await fetch(
        `http://localhost:8081/batches/${id}/normalize-emails`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: session?.binding_id,
            leads: leads,
          }),
        },
      );

      if (!res.ok) {
        throw new Error("Failed to normalize emails");
      }

      const data: { leads: Lead[] } = await res.json();
      setLeads(data.leads);
    } catch (err) {
      console.error(err);
      alert("Error normalizando correos con IA");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <main className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Detalles del Batch</h1>
            <p className="text-muted-foreground">
              {searchQuery || "—"} · ID {id}
            </p>
          </div>
        </div>

        {/* Stats */}
        <Card>
          <CardContent className="grid grid-cols-2 md:grid-cols-5 gap-4 py-6">
            <Stat label="Leads" value={leads.length} />
            <Stat label="Total Emails" value={allEmails.length} />
            <Stat label="Válidos" value={validEmails.length} green />
            <Stat label="Inválidos" value={invalidEmails.length} red />
            <Stat label="Calidad" value={`${validPercentage}%`} />
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            onClick={() =>
              navigator.clipboard.writeText(validEmails.join("\n"))
            }
          >
            <Copy className="h-4 w-4 mr-2" />
            Copiar ({validEmails.length})
          </Button>
          <Button
            className="bg-yellow-500 hover:bg-yellow-400 text-foreground"
            onClick={normalizeEmailsWithAi}
          >
            <Brain className="h-4 w-4 mr-2" />
            Normalizar Correos ({validEmails.length})
          </Button>

          <Button variant="outline" onClick={downloadCSV}>
            <Download className="h-4 w-4 mr-2" />
            CSV
          </Button>
        </div>

        {/* Emails Table */}
        <Card>
          <CardHeader>
            <CardTitle>Emails válidos</CardTitle>
            <CardDescription>
              {validEmails.length} emails validados correctamente
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableBody>
                {validEmails.map((email, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className="font-mono">{email}</TableCell>
                    <TableCell align="right">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => navigator.clipboard.writeText(email)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Invalid count */}
        {invalidEmails.length > 0 && (
          <p className="text-sm text-muted-foreground">
            Emails inválidos detectados: {invalidEmails.length}
          </p>
        )}
      </div>
    </main>
  );
}

/* ---------------- Helpers ---------------- */

function Stat({
  label,
  value,
  green,
  red,
}: {
  label: string;
  value: number | string;
  green?: boolean;
  red?: boolean;
}) {
  return (
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p
        className={`text-2xl font-bold ${
          green ? "text-green-600" : red ? "text-red-600" : ""
        }`}
      >
        {value}
      </p>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="p-8">Cargando…</div>}>
      <BatchDetailContent />
    </Suspense>
  );
}
