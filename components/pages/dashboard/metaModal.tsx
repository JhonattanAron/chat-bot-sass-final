"use client";

import { JSX, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DynamicModalProps {
  meta: Record<string, any>;
}

function renderValue(value: any): JSX.Element {
  if (value === null || value === undefined)
    return <span className="text-gray-400 italic">null</span>;

  if (typeof value === "string")
    return <span className="text-green-600">"{value}"</span>;

  if (typeof value === "number")
    return <span className="text-blue-600">{value}</span>;

  if (typeof value === "boolean")
    return (
      <span
        className={`px-1 py-0.5 rounded text-white ${value ? "bg-green-500" : "bg-red-500"}`}
      >
        {String(value)}
      </span>
    );

  if (Array.isArray(value)) {
    return (
      <ul className="ml-4 mt-1 border-l border-gray-300 pl-2">
        {value.map((item, index) => (
          <li key={index} className="mb-1">
            <span className="font-medium text-gray-700">{index}:</span>{" "}
            {renderValue(item)}
          </li>
        ))}
      </ul>
    );
  }

  if (typeof value === "object") {
    return (
      <ul className="ml-4 mt-1 border-l border-gray-300 pl-2">
        {Object.entries(value).map(([key, val]) => (
          <li key={key} className="mb-1">
            <span className="font-medium text-gray-700">{key}:</span>{" "}
            {renderValue(val)}
          </li>
        ))}
      </ul>
    );
  }

  return <span>{String(value)}</span>;
}

export function MetaModal({ meta }: DynamicModalProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="hover:bg-gray-100">
          Ver meta
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Detalles Meta
          </DialogTitle>
        </DialogHeader>

        <div className="mt-2 max-h-[60vh] overflow-auto p-2 bg-gray-50 rounded-md border border-gray-200 text-sm">
          {meta && Object.keys(meta).length > 0 ? (
            renderValue(meta)
          ) : (
            <p className="text-gray-500 italic">
              No hay información disponible
            </p>
          )}
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" className="hover:bg-gray-100">
              Cerrar
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
