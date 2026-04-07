"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { MetaModal } from "./metaModal";

interface Log {
  _id: string;
  level: string;
  userId: string;
  action?: string;
  message: string;
  createdAt: string;
  service?: string;
  meta: any;
}

interface LogsResponse {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  logs: Log[];
}

export function UserLogs() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10; // logs por página

  async function fetchLogs(page: number) {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `/api/backend/logs/me?page=${page}&limit=${limit}`,
        {
          headers: {
            credentials: "include",
            "Content-Type": "application/json",
          },
        },
      );

      if (!res.ok) throw new Error(`Error ${res.status}`);

      const data: { data: LogsResponse } = await res.json();

      setLogs(Array.isArray(data?.data?.logs) ? data.data.logs : []);
      setPage(data.data.page || 1);
      setTotalPages(data.data.totalPages || 1);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Error al cargar los logs");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchLogs(page);
  }, [page]);

  const prevPage = () => setPage((p) => Math.max(1, p - 1));
  const nextPage = () => setPage((p) => Math.min(totalPages, p + 1));

  if (loading) return <p className="text-center py-4">Cargando logs...</p>;
  if (error) return <p className="text-center py-4 text-red-500">{error}</p>;
  if (!logs || logs.length === 0)
    return <p className="text-center py-4">No hay logs disponibles</p>;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Logs de actividad</CardTitle>
      </CardHeader>
      <CardContent>
        <Table className="w-full">
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Servicio</TableHead>
              <TableHead>Nivel</TableHead>
              <TableHead>Mensaje</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Meta</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log._id}>
                <TableCell>{log._id.slice(-6)}</TableCell>
                <TableCell>{log.service || "-"}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded text-white ${
                      log.level === "info"
                        ? "bg-green-500"
                        : log.level === "error"
                          ? "bg-red-500"
                          : "bg-gray-500"
                    }`}
                  >
                    {log.level}
                  </span>
                </TableCell>
                <TableCell>{log.message}</TableCell>
                <TableCell>
                  {new Date(log.createdAt).toLocaleString()}
                </TableCell>
                <TableCell>
                  <MetaModal meta={{ action: log.meta }} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Paginación */}
        <div className="flex justify-between items-center mt-4">
          <Button onClick={prevPage} disabled={page <= 1}>
            Anterior
          </Button>
          <span>
            Página {page} de {totalPages}
          </span>
          <Button onClick={nextPage} disabled={page >= totalPages}>
            Siguiente
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
