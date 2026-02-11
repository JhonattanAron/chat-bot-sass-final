"use client";

import React, { Key, useEffect } from "react";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Upload,
  AlertCircle,
  CheckCircle,
  Loader2,
  Database,
} from "lucide-react";
import { Contact } from "./crm-contacts-manager";

interface Scraper {
  source: string;
  id: string;
  name: string;
  batches: { _id: string; name: string; contacts: number }[];
}

export function ImportContactsModal() {
  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState<Omit<Contact, "id" | "createdAt">[]>(
    [],
  );
  const [error, setError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Estado para importación por scraper
  const [selectedScraper, setSelectedScraper] = useState<string>("");
  const [selectedBatch, setSelectedBatch] = useState<string>("");
  const [loadingScraper, setLoadingScraper] = useState(false);
  const [deleteSource, setDeleteSource] = useState(false);
  const [scrapers, setScrapers] = useState<Scraper[]>([]);
  const [loadingScrapers, setLoadingScrapers] = useState(false);

  useEffect(() => {
    if (!open) return;

    setLoadingScrapers(true);

    fetch("/api/backend/scrapers")
      .then((r) => r.json())
      .then((data) =>
        setScrapers(
          data.map((s: any) => ({
            ...s,
            batches: [],
          })),
        ),
      )

      .catch(() => setError("Error cargando scrapers"))
      .finally(() => setLoadingScrapers(false));
  }, [open]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError("");
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split("\n").filter((line) => line.trim());

        if (lines.length < 2) {
          setError("El archivo debe tener al menos un contacto");
          return;
        }

        const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
        const nameIndex = headers.findIndex((h) => h.includes("nombre"));
        const phoneIndex = headers.findIndex(
          (h) => h.includes("teléfono") || h.includes("phone"),
        );
        const emailIndex = headers.findIndex((h) => h.includes("email"));

        if (nameIndex === -1 || phoneIndex === -1) {
          setError("El archivo debe contener columnas 'nombre' y 'teléfono'");
          return;
        }

        const contacts: Omit<Contact, "id" | "createdAt">[] = [];
        for (let i = 1; i < lines.length; i++) {
          const values = lines[i]
            .split(",")
            .map((v) => v.trim().replace(/"/g, ""));
          if (values.length > 1 && values[nameIndex] && values[phoneIndex]) {
            contacts.push({
              name: values[nameIndex],
              phone: values[phoneIndex],
              email:
                emailIndex !== -1 && values[emailIndex]
                  ? values[emailIndex]
                  : undefined,
              segment: "potencial",
              interactionCount: 0,
              value: 0,
              lastContact: undefined,
            });
          }
        }

        if (contacts.length === 0) {
          setError("No se encontraron contactos válidos");
          return;
        }

        setPreview(contacts);
      } catch (err) {
        setError("Error al procesar el archivo CSV");
      }
    };

    reader.readAsText(file);
  };

  const handleImport = async () => {
    if (preview.length === 0) return;

    try {
      await fetch("/api/backend/crm/import", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          source: selectedScraper || "manual",
          contacts: preview.map((c) => ({
            name: c.name,
            email: c.email,
            phone: c.phone,
            tags: "",
            customFields: {
              batchId: selectedBatch,
              deleteSource,
            },
          })),
        }),
      });

      setOpen(false);
      setPreview([]);
      setDeleteSource(false);
    } catch (err) {
      setError("Error al guardar contactos en CRM");
    }
  };

  useEffect(() => {
    if (!selectedScraper) return;

    fetch(`/api/backend/scrapers/${selectedScraper}/batches`)
      .then((r) => r.json())
      .then((batches) =>
        setScrapers((prev) =>
          prev.map((s) => (s.id === selectedScraper ? { ...s, batches } : s)),
        ),
      )
      .catch(() => setError("Error cargando batches"));
  }, [selectedScraper]);

  const handleScraperImport = async () => {
    setLoadingScraper(true);
    setError("");

    try {
      const res = await fetch(
        `/api/backend/scrapers/${selectedScraper}/batches/${selectedBatch}/import`,
        { method: "POST" },
      );
      console.log(res);

      if (!res.ok) throw new Error();

      const data = await res.json();
      console.log(data);

      setPreview(
        data.leads.map((c: any) => ({
          name: c.name,
          phone: c.phone,
          segment: "potencial",
          interactionCount: 0,
          value: 0,
        })),
      );
    } catch {
      setError("Error al importar contactos del scraper");
    } finally {
      setLoadingScraper(false);
    }
  };

  const currentScraper = scrapers.find((s) => s.id === selectedScraper);

  const batches = Array.isArray(currentScraper?.batches)
    ? currentScraper.batches
    : [];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 bg-transparent">
          <Upload className="w-4 h-4" />
          Importar Contactos
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Importar Contactos</DialogTitle>
          <DialogDescription>
            Elige entre importar desde CSV o desde nuestros scrapers
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="csv" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="csv" className="gap-2">
              <Upload className="w-4 h-4" />
              Importar CSV
            </TabsTrigger>
            <TabsTrigger value="scraper" className="gap-2">
              <Database className="w-4 h-4" />
              Importar Scraper
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: IMPORTAR CSV */}
          <TabsContent value="csv" className="space-y-4 mt-4">
            {/* Área de carga */}
            <div className="border-2 border-dashed rounded-lg p-6 text-center">
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="gap-2 bg-transparent"
              >
                <Upload className="w-4 h-4" />
                Seleccionar archivo CSV
              </Button>
              <p className="text-sm text-muted-foreground mt-2">
                o arrastra un archivo aquí
              </p>
            </div>

            {/* Manejo de errores */}
            {error && (
              <div className="flex gap-2 p-3 bg-destructive/10 border border-destructive/30 rounded-lg">
                <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-destructive">{error}</p>
                  <p className="text-sm text-destructive/80">
                    Por favor revisa el formato del archivo
                  </p>
                </div>
              </div>
            )}

            {/* Vista previa */}
            {preview.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <p className="font-medium text-green-900">
                    {preview.length} contacto
                    {preview.length !== 1 ? "s" : ""} para importar
                  </p>
                </div>

                <div className="max-h-64 overflow-y-auto space-y-2">
                  {preview.slice(0, 5).map((contact, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-sm truncate">
                          {contact.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {contact.phone}
                          {contact.email ? ` • ${contact.email}` : ""}
                        </p>
                      </div>
                      <Badge variant="secondary" className="flex-shrink-0">
                        Nuevo
                      </Badge>
                    </div>
                  ))}
                  {preview.length > 5 && (
                    <p className="text-sm text-muted-foreground text-center py-2">
                      +{preview.length - 5} contactos más...
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Botones de acción */}
            <div className="flex gap-2 justify-end pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setOpen(false);
                  setPreview([]);
                  setError("");
                  if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                  }
                }}
                className="bg-transparent"
              >
                Cancelar
              </Button>
              <Button onClick={handleImport} disabled={preview.length === 0}>
                Importar {preview.length} Contacto
                {preview.length !== 1 ? "s" : ""}
              </Button>
            </div>
          </TabsContent>

          {/* TAB 2: IMPORTAR DESDE SCRAPER */}
          <TabsContent value="scraper" className="space-y-4 mt-4">
            <div className="space-y-4">
              {/* Selector de Scraper */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Seleccionar Scraper
                </label>
                <select
                  value={selectedScraper}
                  onChange={(e) => {
                    setSelectedScraper(e.target.value);
                    setSelectedBatch("");
                    setPreview([]);
                  }}
                  className="w-full px-3 py-2 rounded-md border bg-background text-sm"
                >
                  <option value="">Elige un scraper...</option>
                  {scrapers.map((scraper, indx) => (
                    <option key={indx} value={scraper.id}>
                      {scraper.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Selector de Batch */}
              {selectedScraper && (
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Seleccionar Batch
                  </label>
                  <select
                    value={selectedBatch}
                    onChange={(e) => {
                      console.log(e.target.value);
                      setSelectedBatch(e.target.value);
                      setPreview([]);
                    }}
                    className="w-full px-3 py-2 rounded-md border bg-background text-sm"
                  >
                    <option value="">Elige un batch...</option>
                    {batches.map((batch, indx) => (
                      <option key={indx} value={batch._id}>
                        {batch.name} ({batch.contacts} contactos)
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Botón para importar del scraper */}
              {selectedScraper && selectedBatch && (
                <Button
                  onClick={handleScraperImport}
                  disabled={loadingScraper}
                  className="w-full gap-2"
                >
                  {loadingScraper ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Importando...
                    </>
                  ) : (
                    <>
                      <Database className="w-4 h-4" />
                      Cargar Contactos
                    </>
                  )}
                </Button>
              )}

              {/* Manejo de errores */}
              {error && (
                <div className="flex gap-2 p-3 bg-destructive/10 border border-destructive/30 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-destructive">{error}</p>
                  </div>
                </div>
              )}

              {/* Vista previa de scraper */}
              {preview.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <p className="font-medium text-green-900">
                      {preview.length} contacto
                      {preview.length !== 1 ? "s" : ""} para importar
                    </p>
                  </div>

                  <div className="max-h-64 overflow-y-auto space-y-2">
                    {preview.slice(0, 5).map((contact, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-sm truncate">
                            {contact.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {contact.phone}
                            {contact.email ? ` • ${contact.email}` : ""}
                          </p>
                        </div>
                        <Badge variant="secondary" className="flex-shrink-0">
                          Nuevo
                        </Badge>
                      </div>
                    ))}
                    {preview.length > 5 && (
                      <p className="text-sm text-muted-foreground text-center py-2">
                        +{preview.length - 5} contactos más...
                      </p>
                    )}
                  </div>

                  {/* Botones de acción */}
                  <div>
                    <label className="flex items-start gap-3 rounded-lg border p-4 cursor-pointer hover:bg-muted/50 transition">
                      <input
                        type="checkbox"
                        checked={deleteSource}
                        onChange={(e) => setDeleteSource(e.target.checked)}
                        className="mt-1 h-4 w-4"
                      />
                      <div>
                        <p className="font-medium">
                          Ahorra espacio en tu plataforma
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Elimina los contactos del módulo origen después de
                          importarlos
                        </p>
                      </div>
                    </label>

                    {deleteSource && (
                      <p className="text-xs text-orange-600">
                        ⚠️ Esta acción no se puede deshacer
                      </p>
                    )}
                    <div className="flex gap-2 justify-end pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setPreview([]);
                          setSelectedBatch("");
                          setSelectedScraper("");
                        }}
                        className="bg-transparent"
                      >
                        Cambiar Batch
                      </Button>
                      <Button
                        onClick={() => {
                          handleImport();
                          setSelectedScraper("");
                          setSelectedBatch("");
                        }}
                        disabled={preview.length === 0}
                      >
                        Importar {preview.length} Contacto
                        {preview.length !== 1 ? "s" : ""}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
