"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Contact, CRMContactsManager } from "./crm-contacts-manager";

interface CRMTabProps {
  contacts: Contact[];
  onContactsChange: (contacts: Contact[]) => void;
}

export function CRMTab({ contacts, onContactsChange }: CRMTabProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">CRM - Gestionar Contactos</h1>
        <p className="text-muted-foreground mt-1">
          Administra y organiza todos tus contactos para las campañas
        </p>
      </div>

      <Card className="border bg-background/50 backdrop-blur-xl">
        <CardHeader>
          <CardTitle>Contactos</CardTitle>
        </CardHeader>
        <CardContent>
          <CRMContactsManager />
        </CardContent>
      </Card>
    </div>
  );
}
