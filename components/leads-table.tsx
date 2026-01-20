"use client";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

interface Lead {
  email: string;
  nombre_empresa: string;
  fuente: string;
  nivel_interes: "alto" | "medio" | "bajo";
  razon: string;
}

interface LeadsTableProps {
  leads: Lead[];
  selectedLeads: Set<string>;
  onToggleSelection: (email: string) => void;
}

const interestColor: Record<Lead["nivel_interes"], string> = {
  alto: "bg-green-100 text-green-800",
  medio: "bg-yellow-100 text-yellow-800",
  bajo: "bg-gray-100 text-gray-800",
};

export function LeadsTable({
  leads,
  selectedLeads,
  onToggleSelection,
}: LeadsTableProps) {
  const allSelected = leads.length > 0 && selectedLeads.size === leads.length;

  const handleToggleAll = () => {
    if (allSelected) {
      // Desmarcar todos
      leads.forEach((lead) => onToggleSelection(lead.email));
    } else {
      // Marcar todos
      leads.forEach((lead) => {
        if (!selectedLeads.has(lead.email)) onToggleSelection(lead.email);
      });
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-3 px-4 w-12">
              <Checkbox
                checked={allSelected}
                onCheckedChange={handleToggleAll}
              />
            </th>
            <th className="text-left py-3 px-4 font-semibold text-foreground">
              Email
            </th>
            <th className="text-left py-3 px-4 font-semibold text-foreground">
              Empresa
            </th>
            <th className="text-left py-3 px-4 font-semibold text-foreground">
              Fuente
            </th>
            <th className="text-left py-3 px-4 font-semibold text-foreground">
              Nivel de interés
            </th>
            <th className="text-left py-3 px-4 font-semibold text-foreground">
              Razón
            </th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead, index) => (
            <tr
              key={index}
              className="border-b border-border hover:bg-muted/50"
            >
              <td className="py-3 px-4">
                <Checkbox
                  checked={selectedLeads.has(lead.email)}
                  onCheckedChange={() => onToggleSelection(lead.email)}
                />
              </td>
              <td className="py-3 px-4 text-foreground">{lead.email}</td>
              <td className="py-3 px-4 text-foreground">
                {lead.nombre_empresa}
              </td>
              <td className="py-3 px-4 text-muted-foreground">{lead.fuente}</td>
              <td className="py-3 px-4">
                <Badge className={interestColor[lead.nivel_interes]}>
                  {lead.nivel_interes}
                </Badge>
              </td>
              <td className="py-3 px-4 text-muted-foreground text-xs">
                {lead.razon}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
