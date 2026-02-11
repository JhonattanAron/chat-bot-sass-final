"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Trash2,
  Plus,
  Users,
  Search,
  TrendingUp,
  Phone,
  Mail,
  Calendar,
  Star,
  Filter,
  Loader2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { AddContactModal } from "./add-contact-modal";
import { ImportContactsModal } from "./import-contacts-modal";

export interface Contact {
  id: string;
  name: string;
  phone: string;
  email?: string;
  segment: "potencial" | "frecuente" | "cliente" | "inactivo";
  lastContact?: string;
  interactionCount: number;
  value: number;
  notes?: string;
  createdAt: string;
}

interface CRMContactsManagerProps {
  initialContacts?: Contact[];
  apiUrl?: string;
}

interface ApiResponse {
  data: Contact[];
  total: number;
}

const segmentConfig = {
  potencial: {
    label: "Cliente Potencial",
    color: "bg-blue-100 text-blue-800",
    description: "Primeras interacciones",
  },
  frecuente: {
    label: "Cliente Frecuente",
    color: "bg-purple-100 text-purple-800",
    description: "Contactos regulares",
  },
  cliente: {
    label: "Cliente Activo",
    color: "bg-green-100 text-green-800",
    description: "Cliente de alto valor",
  },
  inactivo: {
    label: "Cliente Inactivo",
    color: "bg-gray-100 text-gray-800",
    description: "Sin interacción reciente",
  },
};

export function CRMContactsManager({
  initialContacts = [],
  apiUrl = "/api/backend/crm",
}: CRMContactsManagerProps) {
  const [contacts, setContacts] = useState<Contact[]>(initialContacts);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSegment, setSelectedSegment] = useState<
    "todos" | "potencial" | "frecuente" | "cliente" | "inactivo"
  >("todos");
  const [operationLoading, setOperationLoading] = useState<{
    [key: string]: boolean;
  }>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalContacts, setTotalContacts] = useState(0);
  const pageSize = 50;

  useEffect(() => {
    fetchContacts(1);
  }, []);

  const fetchContacts = useCallback(
    async (page: number = 1) => {
      try {
        setLoading(true);
        setError(null);
        setCurrentPage(page);
        const offset = (page - 1) * pageSize;
        const params = new URLSearchParams({
          limit: pageSize.toString(),
          offset: offset.toString(),
        });
        const res = await fetch(`${apiUrl}?${params}`);
        if (!res.ok) throw new Error("Error al cargar contactos");
        const data: ApiResponse = await res.json();
        setContacts(data.data);
        setTotalContacts(data.total);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Error al cargar contactos",
        );
      } finally {
        setLoading(false);
      }
    },
    [apiUrl, pageSize],
  );

  const addContact = useCallback(
    async (newContact: Omit<Contact, "id" | "createdAt">) => {
      try {
        const res = await fetch(apiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newContact),
        });
        if (!res.ok) throw new Error("Error al agregar contacto");
        const contact: Contact = await res.json();
        setContacts((prev) => [contact, ...prev]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al agregar");
      }
    },
    [apiUrl],
  );

  const addBulkContacts = useCallback(
    async (newContacts: Omit<Contact, "id" | "createdAt">[]) => {
      try {
        const res = await fetch(`${apiUrl}/import`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newContacts),
        });
        if (!res.ok) throw new Error("Error al importar contactos");
        const data: ApiResponse = await res.json();
        setContacts((prev) => [...data.data, ...prev]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al importar");
      }
    },
    [apiUrl],
  );

  const deleteContact = useCallback(
    async (id: string) => {
      try {
        setOperationLoading((prev) => ({ ...prev, [id]: true }));
        const res = await fetch(`${apiUrl}/${id}`, {
          method: "DELETE",
        });
        if (!res.ok) throw new Error("Error al eliminar");
        setContacts((prev) => prev.filter((c) => c.id !== id));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al eliminar");
      } finally {
        setOperationLoading((prev) => ({ ...prev, [id]: false }));
      }
    },
    [apiUrl],
  );

  const recordInteraction = useCallback(
    async (id: string) => {
      try {
        setOperationLoading((prev) => ({ ...prev, [id]: true }));
        const contact = contacts.find((c) => c.id === id);
        if (!contact) return;

        const res = await fetch(`${apiUrl}/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            interactionCount: contact.interactionCount + 1,
            lastContact: new Date().toISOString().split("T")[0],
          }),
        });
        if (!res.ok) throw new Error("Error al registrar");
        const updated: Contact = await res.json();
        setContacts((prev) => prev.map((c) => (c.id === id ? updated : c)));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al registrar");
      } finally {
        setOperationLoading((prev) => ({ ...prev, [id]: false }));
      }
    },
    [contacts, apiUrl],
  );

  const updateSegment = useCallback(
    async (id: string, newSegment: Contact["segment"]) => {
      try {
        setOperationLoading((prev) => ({ ...prev, [id]: true }));
        const res = await fetch(`${apiUrl}/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ segment: newSegment }),
        });
        if (!res.ok) throw new Error("Error al actualizar");
        const updated: Contact = await res.json();
        setContacts((prev) => prev.map((c) => (c.id === id ? updated : c)));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al actualizar");
      } finally {
        setOperationLoading((prev) => ({ ...prev, [id]: false }));
      }
    },
    [apiUrl],
  );

  const filteredContacts = useMemo(
    () =>
      contacts.filter((contact) => {
        const matchesSearch =
          contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          contact.phone.includes(searchTerm) ||
          contact.email?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesSegment =
          selectedSegment === "todos" || contact.segment === selectedSegment;

        return matchesSearch && matchesSegment;
      }),
    [contacts, searchTerm, selectedSegment],
  );

  const stats = useMemo(
    () => ({
      total: totalContacts,
      potencial: contacts.filter((c) => c.segment === "potencial").length,
      frecuente: contacts.filter((c) => c.segment === "frecuente").length,
      cliente: contacts.filter((c) => c.segment === "cliente").length,
      inactivo: contacts.filter((c) => c.segment === "inactivo").length,
      totalInteracciones: contacts.reduce(
        (sum, c) => sum + c.interactionCount,
        0,
      ),
      totalValor: contacts.reduce((sum, c) => sum + c.value, 0),
    }),
    [contacts, totalContacts],
  );

  const totalPages = Math.ceil(totalContacts / pageSize);

  return (
    <div className="space-y-6">
      {/* ERROR MESSAGE */}
      {error && (
        <Card className="border border-destructive bg-destructive/10">
          <CardContent className="pt-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm text-destructive">{error}</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setError(null)}
                className="mt-2 h-7 px-2 text-xs"
              >
                Cerrar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* LOADING STATE */}
      {loading ? (
        <Card className="border bg-background/50">
          <CardContent className="pt-12 pb-12 flex justify-center">
            <Loader2 className="w-8 h-8 text-muted-foreground animate-spin" />
          </CardContent>
        </Card>
      ) : (
        <>
          {/* TARJETAS DE ESTADÍSTICAS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="border bg-gradient-to-br from-blue-50 to-blue-100/50">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total</p>
                    <p className="text-2xl font-bold mt-1">{stats.total}</p>
                  </div>
                  <Users className="w-8 h-8 text-blue-500 opacity-50" />
                </div>
              </CardContent>
            </Card>

            <Card className="border bg-gradient-to-br from-purple-50 to-purple-100/50">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Frecuentes</p>
                    <p className="text-2xl font-bold mt-1">{stats.frecuente}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-purple-500 opacity-50" />
                </div>
              </CardContent>
            </Card>

            <Card className="border bg-gradient-to-br from-green-50 to-green-100/50">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Activos</p>
                    <p className="text-2xl font-bold mt-1">{stats.cliente}</p>
                  </div>
                  <Star className="w-8 h-8 text-green-500 opacity-50" />
                </div>
              </CardContent>
            </Card>

            <Card className="border bg-gradient-to-br from-orange-50 to-orange-100/50">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Potenciales</p>
                    <p className="text-2xl font-bold mt-1">{stats.potencial}</p>
                  </div>
                  <Phone className="w-8 h-8 text-orange-500 opacity-50" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AGREGAR CONTACTO Y IMPORTAR */}
          <Card className="border bg-background/50 backdrop-blur-xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Gestión de Contactos</CardTitle>
                <div className="flex items-center gap-2">
                  <AddContactModal onAddContact={addContact} />
                  <ImportContactsModal />
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* FILTROS Y BÚSQUEDA */}
          <Card className="border bg-background/50 backdrop-blur-xl">
            <CardHeader>
              <div className="flex items-center justify-between gap-4 flex-col md:flex-row">
                <div className="flex items-center gap-2 flex-1 w-full">
                  <Search className="w-5 h-5 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por nombre, teléfono o email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border-0 bg-transparent flex-1"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-muted-foreground" />
                  <select
                    value={selectedSegment}
                    onChange={(e) =>
                      setSelectedSegment(
                        e.target.value as typeof selectedSegment,
                      )
                    }
                    className="px-3 py-2 rounded-md border bg-background text-sm"
                  >
                    <option value="todos">Todos</option>
                    <option value="potencial">Potenciales</option>
                    <option value="frecuente">Frecuentes</option>
                    <option value="cliente">Activos</option>
                    <option value="inactivo">Inactivos</option>
                  </select>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* TABLA DE CONTACTOS */}
          {filteredContacts.length > 0 ? (
            <Card className="border bg-background/50 backdrop-blur-xl">
              <CardContent className="pt-6">
                <div className="overflow-x-auto">
                  <CardHeader className="border-t">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">
                        Página {currentPage} de {totalPages} ({totalContacts}{" "}
                        contactos totales)
                      </p>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => fetchContacts(currentPage - 1)}
                          disabled={currentPage === 1 || loading}
                          className="gap-2"
                        >
                          <ChevronLeft className="w-4 h-4" />
                          Anterior
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => fetchContacts(currentPage + 1)}
                          disabled={currentPage === totalPages || loading}
                          className="gap-2"
                        >
                          Siguiente
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50 hover:bg-muted/50">
                        <TableHead>Nombre</TableHead>
                        <TableHead>Segmento</TableHead>
                        <TableHead>Teléfono</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Interacciones</TableHead>
                        <TableHead>Último Contacto</TableHead>
                        <TableHead>Acciones</TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {filteredContacts.map((contact, idx) => (
                        <TableRow key={idx}>
                          <TableCell className="font-medium">
                            {contact.name}
                          </TableCell>
                          <TableCell>
                            <select
                              value={contact.segment}
                              onChange={(e) =>
                                updateSegment(
                                  contact.id,
                                  e.target.value as Contact["segment"],
                                )
                              }
                              disabled={operationLoading[contact.id]}
                              className="text-xs px-2 py-1 rounded border bg-background cursor-pointer disabled:opacity-50"
                            >
                              <option value="potencial">Potencial</option>
                              <option value="frecuente">Frecuente</option>
                              <option value="cliente">Cliente</option>
                              <option value="inactivo">Inactivo</option>
                            </select>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Phone className="w-3 h-3 text-muted-foreground" />
                              <span className="text-sm">{contact.phone}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {contact.email ? (
                                <>
                                  <Mail className="w-3 h-3 text-muted-foreground" />
                                  <span className="text-sm">
                                    {contact.email}
                                  </span>
                                </>
                              ) : (
                                <span className="text-muted-foreground">—</span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">
                              {contact.interactionCount}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2 text-sm">
                              <Calendar className="w-3 h-3 text-muted-foreground" />
                              {contact.lastContact || "Sin registro"}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => recordInteraction(contact.id)}
                                disabled={operationLoading[contact.id]}
                                title="Registrar interacción"
                                className="bg-transparent disabled:opacity-50"
                              >
                                {operationLoading[contact.id] ? (
                                  <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                                ) : (
                                  <Phone className="w-4 h-4 text-blue-500" />
                                )}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteContact(contact.id)}
                                disabled={operationLoading[contact.id]}
                                title="Eliminar contacto"
                                className="bg-transparent disabled:opacity-50"
                              >
                                {operationLoading[contact.id] ? (
                                  <Loader2 className="w-4 h-4 animate-spin text-destructive" />
                                ) : (
                                  <Trash2 className="w-4 h-4 text-destructive" />
                                )}
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
              <CardHeader className="border-t">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Página {currentPage} de {totalPages} ({totalContacts}{" "}
                    contactos totales)
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fetchContacts(currentPage - 1)}
                      disabled={currentPage === 1 || loading}
                      className="gap-2"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Anterior
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fetchContacts(currentPage + 1)}
                      disabled={currentPage === totalPages || loading}
                      className="gap-2"
                    >
                      Siguiente
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ) : (
            <Card className="border bg-background/50 backdrop-blur-xl">
              <CardContent className="pt-12 pb-12">
                <div className="text-center">
                  <Users className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
                  <p className="text-muted-foreground">
                    No hay contactos en este segmento
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
