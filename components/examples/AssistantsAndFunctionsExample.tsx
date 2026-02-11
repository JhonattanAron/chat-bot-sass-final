"use client";

import { useAssistants, useFunctions } from "@/hooks/useAssistantsAndFunctions";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function AssistantsAndFunctionsExample() {
  const {
    assistants,
    loading: assistantsLoading,
    error: assistantsError,
    createAssistant,
    deleteAssistant,
  } = useAssistants();

  const [selectedAssistantId, setSelectedAssistantId] = useState<string>("");
  const [newAssistantName, setNewAssistantName] = useState("");

  const {
    functions,
    loading: functionsLoading,
    error: functionsError,
    addFunction,
    deleteFunction,
  } = useFunctions(selectedAssistantId);

  const [newFunctionName, setNewFunctionName] = useState("");
  const [newFunctionUrl, setNewFunctionUrl] = useState("");

  const handleCreateAssistant = async () => {
    if (!newAssistantName.trim()) return;

    try {
      await createAssistant({
        name: newAssistantName,
        description: "Asistente creado desde el ejemplo",
        type: "custom",
        status: "active",
        use_case: "automation",
        welcome_message: "Hola, soy tu asistente",
        funciones: [],
        integrations: [],
        user_id: "",
        faqs: [],
      });
      setNewAssistantName("");
    } catch (err) {
      console.error("Error creating assistant:", err);
    }
  };

  const handleAddFunction = async () => {
    if (!newFunctionName.trim() || !newFunctionUrl.trim() || !selectedAssistantId)
      return;

    try {
      await addFunction({
        name: newFunctionName,
        description: "Función creada desde el ejemplo",
        type: "api",
        api: {
          url: newFunctionUrl,
          method: "POST",
          headers: [],
          parameters: [],
        },
      });
      setNewFunctionName("");
      setNewFunctionUrl("");
    } catch (err) {
      console.error("Error adding function:", err);
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Sección de Asistentes */}
      <Card>
        <CardHeader>
          <CardTitle>Gestionar Asistentes</CardTitle>
          <CardDescription>
            Crea y gestiona tus asistentes personalizados
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {assistantsError && (
            <div className="rounded-md bg-red-50 p-4 text-sm text-red-800">
              Error: {assistantsError}
            </div>
          )}

          <div className="flex gap-2">
            <Input
              placeholder="Nombre del nuevo asistente"
              value={newAssistantName}
              onChange={(e) => setNewAssistantName(e.target.value)}
            />
            <Button onClick={handleCreateAssistant} disabled={assistantsLoading}>
              {assistantsLoading ? "Creando..." : "Crear"}
            </Button>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">Asistentes ({assistants.length})</h4>
            <div className="grid gap-2">
              {assistants.map((assistant) => (
                <div
                  key={assistant._id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div
                    className="flex-1 cursor-pointer hover:opacity-75"
                    onClick={() => setSelectedAssistantId(assistant._id || "")}
                  >
                    <h5 className="font-medium">{assistant.name}</h5>
                    <p className="text-sm text-gray-500">
                      {assistant.description}
                    </p>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() =>
                      deleteAssistant(assistant._id || "", assistant.user_id)
                    }
                  >
                    Eliminar
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sección de Funciones */}
      {selectedAssistantId && (
        <Card>
          <CardHeader>
            <CardTitle>Funciones del Asistente</CardTitle>
            <CardDescription>
              Añade y gestiona funciones para:{" "}
              {assistants.find((a) => a._id === selectedAssistantId)?.name}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {functionsError && (
              <div className="rounded-md bg-red-50 p-4 text-sm text-red-800">
                Error: {functionsError}
              </div>
            )}

            <div className="space-y-2">
              <Input
                placeholder="Nombre de la función"
                value={newFunctionName}
                onChange={(e) => setNewFunctionName(e.target.value)}
              />
              <Input
                placeholder="URL de la API"
                value={newFunctionUrl}
                onChange={(e) => setNewFunctionUrl(e.target.value)}
              />
              <Button onClick={handleAddFunction} disabled={functionsLoading}>
                {functionsLoading ? "Agregando..." : "Agregar Función"}
              </Button>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Funciones ({functions.length})</h4>
              <div className="grid gap-2">
                {functions.map((func) => (
                  <div
                    key={func.id}
                    className="flex items-center justify-between rounded-lg border p-4"
                  >
                    <div>
                      <h5 className="font-medium">{func.name}</h5>
                      <p className="text-sm text-gray-500">
                        {func.description || "Sin descripción"}
                      </p>
                      {func.api && (
                        <p className="text-xs text-gray-400">
                          {func.api.method} {func.api.url}
                        </p>
                      )}
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteFunction(func.id || "")}
                    >
                      Eliminar
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
