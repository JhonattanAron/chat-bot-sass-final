"use client";

import { useState } from "react";
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
  contacts: Contact[];
  onContactsChange: (contacts: Contact[]) => void;
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
  contacts,
  onContactsChange,
}: CRMContactsManagerProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSegment, setSelectedSegment] = useState<
    "todos" | "potencial" | "frecuente" | "cliente" | "inactivo"
  >("todos");
  const [newContact, setNewContact] = useState<
    Omit<Contact, "id" | "createdAt">
  >({
    name: "",
    phone: "",
    email: "",
    segment: "potencial",
    interactionCount: 0,
    value: 0,
    notes: "",
  });

  const addContact = (newContact: Omit<Contact, "id" | "createdAt">) => {
    const contact: Contact = {
      id: Date.now().toString(),
      ...newContact,
      createdAt: new Date().toISOString().split("T")[0],
    };
    onContactsChange([...contacts, contact]);
  };

  const addBulkContacts = (
    newContacts: Omit<Contact, "id" | "createdAt">[],
  ) => {
    const contacts_with_id = newContacts.map((contact) => ({
      id: Date.now().toString() + Math.random(),
      ...contact,
      createdAt: new Date().toISOString().split("T")[0],
    }));
    onContactsChange([...contacts, ...contacts_with_id]);
  };

  const updateContact = (updatedContact: Contact) => {
    onContactsChange(
      contacts.map((c) => (c.id === updatedContact.id ? updatedContact : c)),
    );
  };

  const deleteContact = (id: string) => {
    onContactsChange(contacts.filter((c) => c.id !== id));
  };

  const recordInteraction = (id: string) => {
    const contact = contacts.find((c) => c.id === id);
    if (contact) {
      const updated = {
        ...contact,
        interactionCount: contact.interactionCount + 1,
        lastContact: new Date().toISOString().split("T")[0],
      };
      updateContact(updated);
    }
  };

  const updateSegment = (id: string, newSegment: Contact["segment"]) => {
    const contact = contacts.find((c) => c.id === id);
    if (contact) {
      updateContact({ ...contact, segment: newSegment });
    }
  };

  const filteredContacts = contacts.filter((contact) => {
    const matchesSearch =
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.phone.includes(searchTerm) ||
      contact.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSegment =
      selectedSegment === "todos" || contact.segment === selectedSegment;

    return matchesSearch && matchesSegment;
  });

  const stats = {
    total: contacts.length,
    potencial: contacts.filter((c) => c.segment === "potencial").length,
    frecuente: contacts.filter((c) => c.segment === "frecuente").length,
    cliente: contacts.filter((c) => c.segment === "cliente").length,
    inactivo: contacts.filter((c) => c.segment === "inactivo").length,
    totalInteracciones: contacts.reduce(
      (sum, c) => sum + c.interactionCount,
      0,
    ),
    totalValor: contacts.reduce((sum, c) => sum + c.value, 0),
  };

  return (
    <div className="space-y-6">
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
              <ImportContactsModal onImportContacts={addBulkContacts} />
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
                  setSelectedSegment(e.target.value as typeof selectedSegment)
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
                  {filteredContacts.map((contact) => (
                    <TableRow key={contact.id}>
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
                          className="text-xs px-2 py-1 rounded border bg-background cursor-pointer"
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
                              <span className="text-sm">{contact.email}</span>
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
                            title="Registrar interacción"
                            className="bg-transparent"
                          >
                            <Phone className="w-4 h-4 text-blue-500" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteContact(contact.id)}
                            title="Eliminar contacto"
                            className="bg-transparent"
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
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
    </div>
  );
}
