"use client";

import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  ChevronUp,
  Mail,
  CheckCircle2,
  AlertCircle,
  Copy,
} from "lucide-react";
import { useState } from "react";

interface EmailBatch {
  batch_id: string;
  search_query: string;
  emails: string[];
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length < 100 && !email.includes(" ");
}

function cleanEmail(email: string): string | null {
  const cleaned = email.trim();
  if (isValidEmail(cleaned)) {
    return cleaned;
  }

  const match = cleaned.match(/^[\w.\-+]+@[\w.-]+\.[a-zA-Z]{2,}/);
  if (match && isValidEmail(match[0])) {
    return match[0];
  }

  return null;
}

function BatchSection({
  batch,
  index,
  onBatchClick,
}: {
  batch: EmailBatch;
  index: number;
  onBatchClick: (batch: EmailBatch) => void;
}) {
  const [expanded, setExpanded] = useState(index === 0);

  const validEmails = batch.emails
    .map(cleanEmail)
    .filter((email): email is string => email !== null);

  const invalidCount = batch.emails.length - validEmails.length;
  const validPercentage =
    batch.emails.length > 0
      ? Math.round((validEmails.length / batch.emails.length) * 100)
      : 0;

  return (
    <div className="border rounded-lg mb-4 overflow-hidden">
      <button
        onClick={() => onBatchClick(batch)}
        className="w-full p-4 flex items-center justify-between hover:bg-muted transition-colors"
      >
        <div className="flex items-center gap-3 flex-1">
          {expanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
          <div className="text-left">
            <p className="font-medium text-sm">{batch.search_query}</p>
            <p className="text-xs text-muted-foreground">
              {validEmails.length} válidos • {invalidCount} inválidos •{" "}
              {validPercentage}% calidad
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline">{batch.emails.length} emails</Badge>
          {validPercentage === 100 ? (
            <Badge variant="default" className="bg-green-500">
              Perfect
            </Badge>
          ) : validPercentage >= 80 ? (
            <Badge variant="secondary">Good</Badge>
          ) : (
            <Badge variant="destructive">Review</Badge>
          )}
        </div>
      </button>

      {expanded && (
        <div className="border-t">
          <div className="rounded-md">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Email</TableHead>
                  <TableHead className="text-right">Estado</TableHead>
                  <TableHead className="text-right">Acción</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {batch.emails.slice(0, 5).map((email, idx) => {
                  const cleaned = cleanEmail(email);
                  const isValid = cleaned !== null;

                  return (
                    <TableRow
                      key={idx}
                      className={!isValid ? "bg-destructive/5" : ""}
                    >
                      <TableCell className="font-mono text-sm">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          <span className="truncate">
                            {isValid ? cleaned : email}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        {isValid ? (
                          <Badge variant="outline" className="gap-1">
                            <CheckCircle2 className="h-3 w-3" />
                            Válido
                          </Badge>
                        ) : (
                          <Badge variant="destructive" className="gap-1">
                            <AlertCircle className="h-3 w-3" />
                            Inválido
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {isValid && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigator.clipboard.writeText(cleaned);
                            }}
                            title="Copiar email"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            {batch.emails.length > 5 && (
              <div className="p-4 text-center border-t bg-muted/30">
                <p className="text-sm text-muted-foreground">
                  +{batch.emails.length - 5} emails más • Click para ver todos
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function EmailTable({ data }: { data: EmailBatch[] }) {
  const router = useRouter();

  const allEmails = data.flatMap((batch) => batch.emails);
  const validEmails = allEmails
    .map(cleanEmail)
    .filter((email): email is string => email !== null);

  const totalQuality =
    allEmails.length > 0
      ? Math.round((validEmails.length / allEmails.length) * 100)
      : 0;

  const handleBatchClick = (batch: EmailBatch) => {
    const emailsParam = encodeURIComponent(JSON.stringify(batch.emails));
    router.push(`batch/emails/${batch.batch_id}`);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Resumen de Emails</CardTitle>
          <CardDescription>
            Análisis completo de emails extraídos por lotes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Total de Emails</p>
              <p className="text-2xl font-bold">{allEmails.length}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Válidos</p>
              <p className="text-2xl font-bold text-green-600">
                {validEmails.length}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Inválidos</p>
              <p className="text-2xl font-bold text-red-600">
                {allEmails.length - validEmails.length}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Calidad</p>
              <p className="text-2xl font-bold">{totalQuality}%</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Detalle de Lotes</CardTitle>
          <CardDescription>
            {data.length} lotes de email • Haz clic para ver todos los emails
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {data.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No hay datos disponibles
            </p>
          ) : (
            data.map((batch, idx) => (
              <BatchSection
                key={idx}
                batch={batch}
                index={idx}
                onBatchClick={handleBatchClick}
              />
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
