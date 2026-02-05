"use client";

import React from "react"

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
import type { Contact } from "./crm-contacts-manager";

interface ImportContactsModalProps {
  onImportContacts: (contacts: Omit<Contact, "id" | "createdAt">[]) => void;
}

interface Scraper {
  id: string;
  name: string;
  batches: { id: string; name: string; count: number }[];
}

// Mock de scrapers disponibles - reemplaza con datos reales de tu API
const MOCK_SCRAPERS: Scraper[] = [
  {
    id: "scraper_1",
    name: "LinkedIn Scraper",
    batches: [
      { id: "batch_1", name: "Batch 1 - Tech Professionals", count: 245 },
      { id: "batch_2", name: "Batch 2 - Marketers", count: 189 },
      { id: "batch_3", name: "Batch 3 - Managers", count: 312 },
    ],
  },
  {
    id: "scraper_2",
    name: "Google Maps Scraper",
    batches: [
      { id: "batch_4", name: "Local Businesses - Food", count: 567 },
      { id: "batch_5", name: "Local Businesses - Retail", count: 423 },
    ],
  },
  {
    id: "scraper_3",
    name: "Web Directory Scraper",
    batches: [
      { id: "batch_6", name: "E-commerce Sites", count: 890 },
      { id: "batch_7", name: "Service Providers", count: 654 },
    ],
  },
];

export function ImportContactsModal({
  onImportContacts,
}: ImportContactsModalProps) {
  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState<Omit<Contact, "id" | "createdAt">[]>(
    []
  );
  const [error, setError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Estado para importación por scraper
  const [selectedScraper, setSelectedScraper] = useState<string>("");
  const [selectedBatch, setSelectedBatch] = useState<string>("");
  const [loadingScraper, setLoadingScraper] = useState(false);

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

        const headers = lines[0]
          .split(",")
          .map((h) => h.trim().toLowerCase());
        const nameIndex = headers.findIndex((h) =>
          h.includes("nombre")
        );
        const phoneIndex = headers.findIndex((h) =>
          h.includes("teléfono") || h.includes("phone")
        );
        const emailIndex = headers.findIndex((h) =>
          h.includes("email")
        );

        if (nameIndex === -1 || phoneIndex === -1) {
          setError(
            "El archivo debe contener columnas 'nombre' y 'teléfono'"
          );
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

  const handleImport = () => {
    if (preview.length === 0) return;
    onImportContacts(preview);
    setPreview([]);
    setError("");
    setOpen(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleScraperImport = async () => {
    if (!selectedScraper || !selectedBatch) {
      setError("Por favor selecciona un scraper y un batch");
      return;
    }

    setLoadingScraper(true);
    setError("");

    // Simulación de importación desde scraper
    // En producción, aquí iría una llamada a tu API
    setTimeout(() => {
      try {
        // Datos mock generados basados en el batch seleccionado
        const scraper = MOCK_SCRAPERS.find((s) => s.id === selectedScraper);
        const batch = scraper?.batches.find((b) => b.id === selectedBatch);

        if (!scraper || !batch) {
          setError("Scraper o batch no encontrado");
          setLoadingScraper(false);
          return;
        }

        // Generar contactos de prueba
        const mockContacts: Omit<Contact, "id" | "createdAt">[] = [];
        const firstNames = [
          "Carlos",
          "María",
          "Juan",
          "Ana",
          "Roberto",
          "Patricia",
          "Luis",
          "Carmen",
        ];
        const lastNames = [
          "García",
          "López",
          "Martínez",
          "Rodríguez",
          "Pérez",
          "Sánchez",
          "Díaz",
          "Flores",
        ];

        for (let i = 0; i < Math.min(batch.count, 10); i++) {
          const firstName =
            firstNames[Math.floor(Math.random() * firstNames.length)];
          const lastName =
            lastNames[Math.floor(Math.random() * lastNames.length)];
          const phone = `+57${Math.floor(Math.random() * 9000000000) + 1000000000}`;

          mockContacts.push({
            name: `${firstName} ${lastName}`,
            phone,
            email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com`,
            segment: "potencial",
            interactionCount: 0,
            value: 0,
            notes: `Importado de ${scraper.name} - ${batch.name}`,
          });
        }

        setPreview(mockContacts);
        setLoadingScraper(false);
      } catch (err) {
        setError("Error al importar contactos del scraper");
        setLoadingScraper(false);
      }
    }, 1500);
  };

  const currentScraper = MOCK_SCRAPERS.find((s) => s.id === selectedScraper);

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
                  {MOCK_SCRAPERS.map((scraper) => (
                    <option key={scraper.id} value={scraper.id}>
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
                      setSelectedBatch(e.target.value);
                      setPreview([]);
                    }}
                    className="w-full px-3 py-2 rounded-md border bg-background text-sm"
                  >
                    <option value="">Elige un batch...</option>
                    {currentScraper?.batches.map((batch) => (
                      <option key={batch.id} value={batch.id}>
                        {batch.name} ({batch.count} contactos)
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
              )}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
