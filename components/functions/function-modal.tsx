"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus, Eye, EyeOff, Key } from "lucide-react";
import { AlertTriangle, CheckCircle, Shield, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import SimpleAlert from "../ui/simple-alert"; // Assuming this path is correct

interface FunctionData {
  id?: string; // Optional ID for editing existing functions
  name: string;
  description: string;
  type: "api" | "custom";
  api?: {
    url: string;
    method: string;
    headers: { key: string; value: string }[];
    parameters: {
      name: string;
      type: string;
      required: boolean;
      description: string;
    }[];
    auth: { type: string; value: string } | null;
  };
  code?: string;
  credentials?: { name: string; value: string; description: string }[];
}

interface FunctionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddFunction: (functionData: FunctionData) => void;
  editFunction?: FunctionData; // New prop for editing
  onEditFunction?: (functionData: FunctionData) => void; // New callback for editing
  language?: "en" | "es";
}

export function FunctionModal({
  open,
  onOpenChange,
  onAddFunction,
  editFunction, // Destructure new prop
  onEditFunction, // Destructure new callback
  language = "en",
}: FunctionModalProps) {
  const [functionType, setFunctionType] = useState<"api" | "custom">("api");
  const [functionName, setFunctionName] = useState("");
  const [description, setDescription] = useState("");
  const [apiUrl, setApiUrl] = useState("");
  const [method, setMethod] = useState("POST");
  const [headers, setHeaders] = useState([{ key: "", value: "" }]);
  const [parameters, setParameters] = useState([
    { name: "", type: "string", required: true, description: "" },
  ]);
  const [customCode, setCustomCode] = useState("");
  const [customCredentials, setCustomCredentials] = useState([
    { name: "", value: "", description: "" },
  ]);
  const [showCredentials, setShowCredentials] = useState<{
    [key: number]: boolean;
  }>({});
  const [requiresAuth, setRequiresAuth] = useState(false);
  const [authType, setAuthType] = useState("bearer");
  const [authValue, setAuthValue] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{
    status: "pending" | "success" | "warning" | "error";
    message: string;
  } | null>(null);
  const [showVerificationAlert, setShowVerificationAlert] = useState(false);

  // Function to reset all form fields to their initial state
  const resetForm = () => {
    setFunctionType("api");
    setFunctionName("");
    setDescription("");
    setApiUrl("");
    setMethod("POST");
    setHeaders([{ key: "", value: "" }]);
    setParameters([
      { name: "", type: "string", required: true, description: "" },
    ]);
    setCustomCode("");
    setCustomCredentials([{ name: "", value: "", description: "" }]);
    setShowCredentials({});
    setRequiresAuth(false);
    setAuthType("bearer");
    setAuthValue("");
    setIsVerifying(false);
    setVerificationResult(null);
    setShowVerificationAlert(false);
  };

  // Effect to populate form when editFunction is provided or reset when modal opens/closes
  useEffect(() => {
    if (open) {
      if (editFunction) {
        // Populate form with editFunction data
        setFunctionName(editFunction.name || "");
        setDescription(editFunction.description || "");
        setFunctionType(editFunction.type || "api");

        if (editFunction.type === "api" && editFunction.api) {
          setApiUrl(editFunction.api.url || "");
          setMethod(editFunction.api.method || "POST");
          setHeaders(editFunction.api.headers || [{ key: "", value: "" }]);
          setParameters(
            editFunction.api.parameters || [
              { name: "", type: "string", required: true, description: "" },
            ]
          );
          setRequiresAuth(!!editFunction.api.auth);
          setAuthType(editFunction.api.auth?.type || "bearer");
          // Note: For security, you might not want to pre-fill sensitive auth values.
          // For this example, we'll pre-fill it as per the original component's pattern.
          setAuthValue(editFunction.api.auth?.value || "");
        } else if (editFunction.type === "custom") {
          setCustomCode(editFunction.code || "");
          setCustomCredentials(
            editFunction.credentials || [
              { name: "", value: "", description: "" },
            ]
          );
          // Reset verification state when loading an existing function for editing
          setVerificationResult(null);
          setIsVerifying(false);
          setShowVerificationAlert(false);
        }
      } else {
        // If no editFunction, reset to default for adding a new function
        resetForm();
      }
    } else {
      // When modal closes, reset form
      resetForm();
    }
  }, [open, editFunction]); // Depend on open and editFunction

  const handleVerifyFunction = async () => {
    if (!customCode.trim()) {
      setVerificationResult({
        status: "error",
        message:
          language === "en"
            ? "Please enter some code before verification"
            : "Por favor ingresa código antes de verificar",
      });
      return;
    }
    setShowVerificationAlert(true);
  };

  const confirmVerification = async () => {
    setShowVerificationAlert(false);
    setIsVerifying(true);
    setVerificationResult(null);
    try {
      // Simulate AI verification API call
      await new Promise((resolve) => setTimeout(resolve, 3000));
      // Simulate verification result
      const hasIssues = Math.random() < 0.2; // 20% chance of issues for demo
      if (hasIssues) {
        setVerificationResult({
          status: "warning",
          message:
            language === "en"
              ? "Potential security concerns detected. Please review your code."
              : "Se detectaron posibles problemas de seguridad. Por favor revisa tu código.",
        });
      } else {
        setVerificationResult({
          status: "success",
          message:
            language === "en"
              ? "Code verification passed! No security issues detected."
              : "¡Verificación exitosa! No se detectaron problemas de seguridad.",
        });
      }
    } catch (error) {
      setVerificationResult({
        status: "error",
        message:
          language === "en"
            ? "Verification failed. Please try again."
            : "La verificación falló. Por favor intenta de nuevo.",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSubmit = () => {
    const functionData: FunctionData = {
      // If editing, include the original ID
      ...(editFunction && editFunction.id && { id: editFunction.id }),
      name: functionName,
      description,
      type: functionType,
      ...(functionType === "api" && {
        api: {
          url: apiUrl,
          method,
          headers: headers.filter((h) => h.key && h.value),
          parameters: parameters.filter((p) => p.name),
          auth: requiresAuth ? { type: authType, value: authValue } : null,
        },
      }),
      ...(functionType === "custom" && {
        code: customCode,
        credentials: customCredentials.filter((c) => c.name && c.value),
      }),
    };

    if (editFunction && onEditFunction) {
      onEditFunction(functionData);
    } else {
      onAddFunction(functionData);
    }
    onOpenChange(false);
    // Form reset is now handled by the useEffect when onOpenChange(false) is called
  };

  const addHeader = () => {
    setHeaders([...headers, { key: "", value: "" }]);
  };
  const removeHeader = (index: number) => {
    setHeaders(headers.filter((_, i) => i !== index));
  };
  const updateHeader = (
    index: number,
    field: "key" | "value",
    value: string
  ) => {
    const updatedHeaders = [...headers];
    updatedHeaders[index][field] = value;
    setHeaders(updatedHeaders);
  };

  const addParameter = () => {
    setParameters([
      ...parameters,
      { name: "", type: "string", required: true, description: "" },
    ]);
  };
  const removeParameter = (index: number) => {
    setParameters(parameters.filter((_, i) => i !== index));
  };
  const updateParameter = (index: number, field: string, value: any) => {
    const updatedParameters = [...parameters];
    updatedParameters[index] = { ...updatedParameters[index], [field]: value };
    setParameters(updatedParameters);
  };

  const addCustomCredential = () => {
    setCustomCredentials([
      ...customCredentials,
      { name: "", value: "", description: "" },
    ]);
  };
  const removeCustomCredential = (index: number) => {
    setCustomCredentials(customCredentials.filter((_, i) => i !== index));
    const newShowCredentials = { ...showCredentials };
    delete newShowCredentials[index];
    setShowCredentials(newShowCredentials);
  };
  const updateCustomCredential = (
    index: number,
    field: "name" | "value" | "description",
    value: string
  ) => {
    const updatedCredentials = [...customCredentials];
    updatedCredentials[index][field] = value;
    setCustomCredentials(updatedCredentials);
  };
  const toggleCredentialVisibility = (index: number) => {
    setShowCredentials((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] h-[80vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>
            {editFunction
              ? language === "en"
                ? "Edit Custom Function"
                : "Editar Función Personalizada"
              : language === "en"
              ? "Add Custom Function"
              : "Agregar Función Personalizada"}
          </DialogTitle>
          <DialogDescription>
            {editFunction
              ? language === "en"
                ? "Modify the details of your custom function"
                : "Modifica los detalles de tu función personalizada"
              : language === "en"
              ? "Create a custom function that your bot can execute"
              : "Crea una función personalizada que tu bot puede ejecutar"}
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto p-3">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="function-name">
                {language === "en" ? "Function Name" : "Nombre de la Función"}
              </Label>
              <Input
                id="function-name"
                value={functionName}
                onChange={(e) => setFunctionName(e.target.value)}
                placeholder={
                  language === "en" ? "e.g., Send Email" : "ej., Enviar Email"
                }
              />
            </div>
            <div className="space-y-2">
              {/*
                NOTE: The original component uses the same `functionName` state and `id="function-name"`
                for both "Function Name" and "Function Format". This means only one value can be stored.
                For a more robust solution, consider using a separate state variable and ID for "Function Format".
              */}
              <Label htmlFor="function-format">
                {language === "en"
                  ? "Write the function format: [FUNCTION:param1, param2, ...]"
                  : "Escribe el formato de la función: [FUNCION:param1, param2, ...]"}
              </Label>
              <Input
                id="function-format" // Changed ID to avoid conflict, though state is still shared
                value={functionName} // Still using functionName as per original component
                onChange={(e) => setFunctionName(e.target.value)}
                placeholder={
                  language === "en"
                    ? "e.g., [SEND_EMAIL:email, subject, message]"
                    : "ej., [ENVIAR_CORREO:email, asunto, mensaje]"
                }
              />
            </div>
            <SimpleAlert
              message={
                language === "en"
                  ? "The function must be written inside brackets like this: [FUNCTION:param1, param2, ...]. For example: [SEND_EMAIL:email, subject, message]"
                  : "La función debe escribirse entre corchetes así: [FUNCION:param1, param2, ...]. Por ejemplo: [ENVIAR_CORREO:email, asunto, mensaje]"
              }
            />
            <div className="space-y-2">
              <Label htmlFor="function-description">
                {language === "en" ? "Description" : "Descripción"}
              </Label>
              <Textarea
                id="function-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={
                  language === "en"
                    ? "Describe what this function does..."
                    : "Describe qué hace esta función..."
                }
                className="min-h-[80px]"
              />
            </div>
            <Tabs value={functionType} onValueChange={setFunctionType}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="api">API Call</TabsTrigger>
                <TabsTrigger value="custom">
                  {language === "en" ? "Custom Code" : "Código Personalizado"}
                </TabsTrigger>
              </TabsList>
              <TabsContent value="api" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      {language === "en"
                        ? "API Configuration"
                        : "Configuración de API"}
                    </CardTitle>
                    <CardDescription>
                      {language === "en"
                        ? "Configure the API endpoint that will be called"
                        : "Configura el endpoint de API que será llamado"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-4 gap-2">
                      <div className="space-y-2">
                        <Label>{language === "en" ? "Method" : "Método"}</Label>
                        <Select value={method} onValueChange={setMethod}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="GET">GET</SelectItem>
                            <SelectItem value="POST">POST</SelectItem>
                            <SelectItem value="PUT">PUT</SelectItem>
                            <SelectItem value="DELETE">DELETE</SelectItem>
                            <SelectItem value="PATCH">PATCH</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="col-span-3 space-y-2">
                        <Label htmlFor="api-url">URL</Label>
                        <Input
                          id="api-url"
                          value={apiUrl}
                          onChange={(e) => setApiUrl(e.target.value)}
                          placeholder="https://api.example.com/endpoint"
                        />
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="requires-auth"
                        checked={requiresAuth}
                        onCheckedChange={setRequiresAuth}
                      />
                      <Label htmlFor="requires-auth">
                        {language === "en"
                          ? "Requires Authentication"
                          : "Requiere Autenticación"}
                      </Label>
                    </div>
                    {requiresAuth && (
                      <div className="grid grid-cols-3 gap-2">
                        <div className="space-y-2">
                          <Label>
                            {language === "en" ? "Auth Type" : "Tipo de Auth"}
                          </Label>
                          <Select value={authType} onValueChange={setAuthType}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="bearer">
                                Bearer Token
                              </SelectItem>
                              <SelectItem value="apikey">API Key</SelectItem>
                              <SelectItem value="basic">Basic Auth</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="col-span-2 space-y-2">
                          <Label htmlFor="auth-value">
                            {language === "en" ? "Auth Value" : "Valor de Auth"}
                          </Label>
                          <Input
                            id="auth-value"
                            type="password"
                            value={authValue}
                            onChange={(e) => setAuthValue(e.target.value)}
                            placeholder={
                              language === "en"
                                ? "Enter token/key"
                                : "Ingresa token/clave"
                            }
                          />
                        </div>
                      </div>
                    )}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>
                          {language === "en" ? "Headers" : "Encabezados"}
                        </Label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={addHeader}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          {language === "en" ? "Add Header" : "Agregar"}
                        </Button>
                      </div>
                      {headers.map((header, index) => (
                        <div key={index} className="flex gap-2 items-center">
                          <Input
                            placeholder={
                              language === "en"
                                ? "Header name"
                                : "Nombre del header"
                            }
                            value={header.key}
                            onChange={(e) =>
                              updateHeader(index, "key", e.target.value)
                            }
                          />
                          <Input
                            placeholder={
                              language === "en"
                                ? "Header value"
                                : "Valor del header"
                            }
                            value={header.value}
                            onChange={(e) =>
                              updateHeader(index, "value", e.target.value)
                            }
                          />
                          <Button
                            className="px-3 bg-transparent"
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => removeHeader(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>
                          {language === "en" ? "Parameters" : "Parámetros"}
                        </Label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={addParameter}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          {language === "en" ? "Add Parameter" : "Agregar"}
                        </Button>
                      </div>
                      {parameters.map((param, index) => (
                        <div key={index} className="flex justify-between">
                          <div className="flex">
                            <div className="mr-2">
                              <Input
                                placeholder={
                                  language === "en"
                                    ? "Parameter name"
                                    : "Nombre"
                                }
                                value={param.name}
                                onChange={(e) =>
                                  updateParameter(index, "name", e.target.value)
                                }
                              />
                            </div>
                            <div className="col-span-2">
                              <Select
                                value={param.type}
                                onValueChange={(value) =>
                                  updateParameter(index, "type", value)
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="string">String</SelectItem>
                                  <SelectItem value="number">Number</SelectItem>
                                  <SelectItem value="boolean">
                                    Boolean
                                  </SelectItem>
                                  <SelectItem value="array">Array</SelectItem>
                                  <SelectItem value="object">Object</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div className="col-span-2 flex items-center gap-2">
                            <Switch
                              checked={param.required}
                              onCheckedChange={(checked) =>
                                updateParameter(index, "required", checked)
                              }
                            />
                            <span className="text-xs">
                              {language === "en" ? "Required" : "Requerido"}
                            </span>
                          </div>
                          <div className="col-span-1">
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() => removeParameter(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="custom" className="space-y-4">
                {/* Security Credentials Section */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Key className="h-5 w-5" />
                      {language === "en"
                        ? "Security Credentials"
                        : "Credenciales de Seguridad"}
                    </CardTitle>
                    <CardDescription>
                      {language === "en"
                        ? "Add secure credentials that can be referenced in your code without exposing them"
                        : "Agrega credenciales seguras que pueden ser referenciadas en tu código sin exponerlas"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>
                          {language === "en" ? "Credentials" : "Credenciales"}
                        </Label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={addCustomCredential}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          {language === "en" ? "Add Credential" : "Agregar"}
                        </Button>
                      </div>
                      {customCredentials.map((credential, index) => (
                        <div
                          key={index}
                          className="grid grid-cols-12 gap-2 items-end"
                        >
                          <div className="col-span-3">
                            <Input
                              placeholder={
                                language === "en" ? "Credential name" : "Nombre"
                              }
                              value={credential.name}
                              onChange={(e) =>
                                updateCustomCredential(
                                  index,
                                  "name",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                          <div className="col-span-4 relative">
                            <Input
                              type={
                                showCredentials[index] ? "text" : "password"
                              }
                              placeholder={
                                language === "en"
                                  ? "Token/API Key/Secret"
                                  : "Token/API Key/Secreto"
                              }
                              value={credential.value}
                              onChange={(e) =>
                                updateCustomCredential(
                                  index,
                                  "value",
                                  e.target.value
                                )
                              }
                              className="pr-10"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-0 top-0 h-full px-3"
                              onClick={() => toggleCredentialVisibility(index)}
                            >
                              {showCredentials[index] ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                          <div className="col-span-4">
                            <Input
                              placeholder={
                                language === "en"
                                  ? "Description"
                                  : "Descripción"
                              }
                              value={credential.description}
                              onChange={(e) =>
                                updateCustomCredential(
                                  index,
                                  "description",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                          <div className="col-span-1">
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() => removeCustomCredential(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                    {customCredentials.some((c) => c.name) && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <div className="flex items-center gap-2 text-blue-800 mb-2">
                          <Key className="h-4 w-4" />
                          <span className="font-medium text-sm">
                            {language === "en"
                              ? "How to use credentials in your code:"
                              : "Cómo usar credenciales en tu código:"}
                          </span>
                        </div>
                        <div className="text-xs text-blue-700 font-mono bg-blue-100 p-2 rounded">
                          {customCredentials
                            .filter((c) => c.name)
                            .map(
                              (c) => `const ${c.name} = credentials.${c.name};`
                            )
                            .join("\n") ||
                            (language === "en"
                              ? "// Add credentials above to see examples"
                              : "// Agrega credenciales arriba para ver ejemplos")}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
                {/* Custom Code Section */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      {language === "en"
                        ? "Custom Code"
                        : "Código Personalizado"}
                    </CardTitle>
                    <CardDescription>
                      {language === "en"
                        ? "Write custom JavaScript code that will be executed"
                        : "Escribe código JavaScript personalizado que será ejecutado"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="custom-code">
                            {language === "en"
                              ? "JavaScript Code"
                              : "Código JavaScript"}
                          </Label>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleVerifyFunction}
                            disabled={isVerifying || !customCode.trim()}
                            className="flex items-center gap-2 bg-transparent"
                          >
                            {isVerifying ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Shield className="h-4 w-4" />
                            )}
                            {isVerifying
                              ? language === "en"
                                ? "Verifying..."
                                : "Verificando..."
                              : language === "en"
                              ? "Verify Function"
                              : "Verificar Función"}
                          </Button>
                        </div>
                        <Textarea
                          id="custom-code"
                          value={customCode}
                          onChange={(e) => setCustomCode(e.target.value)}
                          placeholder={`// ${
                            language === "en"
                              ? "Example function with credentials"
                              : "Función de ejemplo con credenciales"
                          }
function executeFunction(params, credentials) {
  // ${
    language === "en"
      ? "Access your secure credentials"
      : "Accede a tus credenciales seguras"
  }
  const apiKey = credentials.myApiKey;
  const token = credentials.authToken;
  
  // ${
    language === "en"
      ? "Your custom logic here"
      : "Tu lógica personalizada aquí"
  }
  console.log('Function executed with params:', params);
  
  // ${
    language === "en" ? "Make secure API calls" : "Realiza llamadas API seguras"
  }
  const response = fetch('https://api.example.com/data', {
    headers: {
      'Authorization': \`Bearer \${token}\`,
      'X-API-Key': apiKey
    }
  });
  
  return { success: true, message: 'Function completed' };
}`}
                          className="min-h-[250px] font-mono text-sm"
                        />
                      </div>
                      {verificationResult && (
                        <Alert
                          className={`${
                            verificationResult.status === "success"
                              ? "border-green-200 bg-green-50"
                              : verificationResult.status === "warning"
                              ? "border-yellow-200 bg-yellow-50"
                              : "border-red-200 bg-red-50"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {verificationResult.status === "success" && (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            )}
                            {verificationResult.status === "warning" && (
                              <AlertTriangle className="h-4 w-4 text-yellow-600" />
                            )}
                            {verificationResult.status === "error" && (
                              <AlertTriangle className="h-4 w-4 text-red-600" />
                            )}
                            <AlertDescription
                              className={`${
                                verificationResult.status === "success"
                                  ? "text-green-800"
                                  : verificationResult.status === "warning"
                                  ? "text-yellow-800"
                                  : "text-red-800"
                              }`}
                            >
                              {verificationResult.message}
                            </AlertDescription>
                          </div>
                        </Alert>
                      )}
                      <div className="mt-2 space-y-2">
                        <Badge variant="outline" className="text-xs">
                          {language === "en"
                            ? "Note: Code will be executed in a secure sandbox environment"
                            : "Nota: El código se ejecutará en un entorno sandbox seguro"}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {language === "en"
                            ? "Credentials are encrypted and never exposed in logs"
                            : "Las credenciales están encriptadas y nunca se exponen en logs"}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-4 border-t flex-shrink-0">
          {functionType === "custom" && !verificationResult?.status && (
            <div className="flex items-center text-xs text-amber-600 mr-auto">
              <AlertTriangle className="h-3 w-3 mr-1" />
              {language === "en"
                ? "Please verify your code before adding the function"
                : "Por favor verifica tu código antes de agregar la función"}
            </div>
          )}
          {functionType === "custom" &&
            verificationResult?.status === "warning" && (
              <div className="flex items-center text-xs text-amber-600 mr-auto">
                <AlertTriangle className="h-3 w-3 mr-1" />
                {language === "en"
                  ? "Please fix the issues before adding the function"
                  : "Por favor corrige los problemas antes de agregar la función"}
              </div>
            )}
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {language === "en" ? "Cancel" : "Cancelar"}
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={
              !functionName ||
              !description ||
              (functionType === "custom" &&
                (!verificationResult ||
                  verificationResult.status !== "success"))
            }
          >
            {editFunction
              ? language === "en"
                ? "Save Changes"
                : "Guardar Cambios"
              : language === "en"
              ? "Add Function"
              : "Agregar Función"}
          </Button>
        </div>
        {/* Verification Alert Dialog */}
        {showVerificationAlert && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md mx-4 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-full">
                  <Shield className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">
                    {language === "en"
                      ? "AI Code Verification"
                      : "Verificación de Código con IA"}
                  </h3>
                </div>
              </div>
              <div className="space-y-3 text-sm text-gray-600">
                <p>
                  {language === "en"
                    ? "Your code will be analyzed by our AI security model to detect potential malicious code or security vulnerabilities."
                    : "Tu código será analizado por nuestro modelo de IA de seguridad para detectar posible código malicioso o vulnerabilidades de seguridad."}
                </p>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-yellow-800">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="font-medium">
                      {language === "en"
                        ? "Token Usage Notice"
                        : "Aviso de Uso de Tokens"}
                    </span>
                  </div>
                  <p className="text-yellow-700 text-xs mt-1">
                    {language === "en"
                      ? "This verification will consume approximately 50-100 tokens from your account balance."
                      : "Esta verificación consumirá aproximadamente 50-100 tokens de tu saldo de cuenta."}
                  </p>
                </div>
                <p className="text-xs">
                  {language === "en"
                    ? "The verification helps ensure your bot functions safely and securely."
                    : "La verificación ayuda a asegurar que tu bot funcione de manera segura."}
                </p>
              </div>
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setShowVerificationAlert(false)}
                  className="flex-1"
                >
                  {language === "en" ? "Cancel" : "Cancelar"}
                </Button>
                <Button onClick={confirmVerification} className="flex-1">
                  {language === "en" ? "Verify Code" : "Verificar Código"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
