"use client";

import React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, X, Plus, AlertCircle } from "lucide-react";

interface ClientSearchConfig {
  keywords: string[];
  allowedTypes: string[];
  searchRadius: number;
  location: { lat: number; lng: number };
  country: string;
}

interface ClientConfigFormProps {
  onSubmit: (config: ClientSearchConfig) => Promise<void>;
  isLoading?: boolean;
  validPlaceTypes?: string[];
}

export function ClientConfigForm({
  onSubmit,
  isLoading = false,
  validPlaceTypes = [],
}: ClientConfigFormProps) {
  const [config, setConfig] = useState<ClientSearchConfig>({
    keywords: [""],
    allowedTypes: [],
    searchRadius: 1500,
    location: { lat: 0, lng: 0 },
    country: "EC",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showTypeSelector, setShowTypeSelector] = useState(false);

  // Cargar tipos válidos del backend
  useEffect(() => {
    const fetchPlaceTypes = async () => {
      try {
        const res = await fetch("/api/google-maps/config/valid-place-types");
        const data = await res.json();
        // Actualizar si es necesario
      } catch (error) {
        console.error("Error fetching place types:", error);
      }
    };

    if (validPlaceTypes.length === 0) {
      fetchPlaceTypes();
    }
  }, [validPlaceTypes]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validar keywords
    const nonEmptyKeywords = config.keywords.filter((k) => k.trim());
    if (nonEmptyKeywords.length === 0) {
      newErrors.keywords = "Debes agregar al menos una palabra clave";
    }

    // Validar radio
    if (config.searchRadius <= 0 || config.searchRadius > 50000) {
      newErrors.radius = "El radio debe estar entre 1m y 50km";
    }

    // Validar ubicación
    if (!config.location.lat || !config.location.lng) {
      newErrors.location = "Debes seleccionar una ubicación válida";
    }

    // Validar país
    if (!config.country || !config.country.trim()) {
      newErrors.country = "El país es requerido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddKeyword = () => {
    setConfig({
      ...config,
      keywords: [...config.keywords, ""],
    });
  };

  const handleKeywordChange = (index: number, value: string) => {
    const newKeywords = [...config.keywords];
    newKeywords[index] = value;
    setConfig({ ...config, keywords: newKeywords });
  };

  const handleRemoveKeyword = (index: number) => {
    const newKeywords = config.keywords.filter((_, i) => i !== index);
    setConfig({
      ...config,
      keywords: newKeywords.length > 0 ? newKeywords : [""],
    });
  };

  const handleToggleType = (type: string) => {
    setConfig({
      ...config,
      allowedTypes: config.allowedTypes.includes(type)
        ? config.allowedTypes.filter((t) => t !== type)
        : [...config.allowedTypes, type],
    });
  };

  const handleRadiusChange = (value: string) => {
    const radius = parseInt(value) || 1500;
    setConfig({
      ...config,
      searchRadius: Math.min(Math.max(radius, 1), 50000),
    });
  };

  const handleLocationChange = (lat: string, lng: string) => {
    setConfig({
      ...config,
      location: {
        lat: parseFloat(lat) || 0,
        lng: parseFloat(lng) || 0,
      },
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const cleanConfig: ClientSearchConfig = {
      ...config,
      keywords: config.keywords.filter((k) => k.trim()),
    };

    try {
      await onSubmit(cleanConfig);
    } catch (error) {
      setErrors({
        submit: error instanceof Error ? error.message : "Error al enviar",
      });
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Configurar Búsqueda de Leads</CardTitle>
        <CardDescription>
          Define los criterios para la búsqueda de ubicaciones en Google Maps
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* KEYWORDS */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">
              Palabras Clave <span className="text-red-500">*</span>
            </Label>
            <p className="text-sm text-gray-600">
              Ingresa las palabras clave para buscar ubicaciones
            </p>

            <div className="space-y-2">
              {config.keywords.map((keyword, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder="Ej: restaurante, farmacia, dentista"
                    value={keyword}
                    onChange={(e) => handleKeywordChange(index, e.target.value)}
                    className="flex-1"
                  />
                  {config.keywords.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => handleRemoveKeyword(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddKeyword}
              className="w-full bg-transparent"
            >
              <Plus className="w-4 h-4 mr-2" />
              Agregar Palabra Clave
            </Button>

            {errors.keywords && (
              <Alert variant="destructive">
                <AlertCircle className="w-4 h-4" />
                <AlertDescription>{errors.keywords}</AlertDescription>
              </Alert>
            )}
          </div>

          {/* ALLOWED TYPES */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">
              Categorías Permitidas (Opcional)
            </Label>
            <p className="text-sm text-gray-600">
              Selecciona categorías específicas para filtrar resultados
            </p>

            <Button
              type="button"
              variant="outline"
              onClick={() => setShowTypeSelector(!showTypeSelector)}
              className="w-full justify-start"
            >
              {config.allowedTypes.length > 0
                ? `${config.allowedTypes.length} categorías seleccionadas`
                : "Seleccionar categorías..."}
            </Button>

            {showTypeSelector && (
              <div className="grid grid-cols-2 gap-2 p-3 bg-gray-50 rounded-lg max-h-64 overflow-y-auto">
                {validPlaceTypes.map((type) => (
                  <label
                    key={type}
                    className="flex items-center gap-2 p-2 hover:bg-white rounded cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={config.allowedTypes.includes(type)}
                      onChange={() => handleToggleType(type)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm capitalize">
                      {type.replace(/_/g, " ")}
                    </span>
                  </label>
                ))}
              </div>
            )}

            {config.allowedTypes.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {config.allowedTypes.map((type) => (
                  <span
                    key={type}
                    className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded"
                  >
                    {type.replace(/_/g, " ")}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* SEARCH RADIUS */}
          <div className="space-y-3">
            <Label htmlFor="radius" className="text-base font-semibold">
              Radio de Búsqueda (metros) <span className="text-red-500">*</span>
            </Label>
            <p className="text-sm text-gray-600">
              Máximo: 50,000 metros (50km)
            </p>

            <Input
              id="radius"
              type="number"
              value={config.searchRadius}
              onChange={(e) => handleRadiusChange(e.target.value)}
              min="1"
              max="50000"
              step="100"
              className="text-lg"
            />

            <div className="text-xs text-gray-600">
              Radio actual: {(config.searchRadius / 1000).toFixed(1)}km
            </div>

            {errors.radius && (
              <Alert variant="destructive">
                <AlertCircle className="w-4 h-4" />
                <AlertDescription>{errors.radius}</AlertDescription>
              </Alert>
            )}
          </div>

          {/* LOCATION */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">
              Ubicación (Lat/Lng) <span className="text-red-500">*</span>
            </Label>
            <p className="text-sm text-gray-600">
              Centro de búsqueda para las ubicaciones
            </p>

            <div className="grid grid-cols-2 gap-2">
              <Input
                placeholder="Latitud"
                type="number"
                step="0.0001"
                value={config.location.lat || ""}
                onChange={(e) =>
                  handleLocationChange(
                    e.target.value,
                    config.location.lng.toString(),
                  )
                }
              />
              <Input
                placeholder="Longitud"
                type="number"
                step="0.0001"
                value={config.location.lng || ""}
                onChange={(e) =>
                  handleLocationChange(
                    config.location.lat.toString(),
                    e.target.value,
                  )
                }
              />
            </div>

            {errors.location && (
              <Alert variant="destructive">
                <AlertCircle className="w-4 h-4" />
                <AlertDescription>{errors.location}</AlertDescription>
              </Alert>
            )}
          </div>

          {/* COUNTRY */}
          <div className="space-y-3">
            <Label htmlFor="country" className="text-base font-semibold">
              País <span className="text-red-500">*</span>
            </Label>
            <p className="text-sm text-gray-600">
              Código ISO del país (Ej: EC, MX, CO)
            </p>

            <Input
              id="country"
              placeholder="Ej: EC"
              value={config.country}
              onChange={(e) =>
                setConfig({ ...config, country: e.target.value.toUpperCase() })
              }
              maxLength={2}
              className="uppercase"
            />

            {errors.country && (
              <Alert variant="destructive">
                <AlertCircle className="w-4 h-4" />
                <AlertDescription>{errors.country}</AlertDescription>
              </Alert>
            )}
          </div>

          {/* SUBMIT ERROR */}
          {errors.submit && (
            <Alert variant="destructive">
              <AlertCircle className="w-4 h-4" />
              <AlertDescription>{errors.submit}</AlertDescription>
            </Alert>
          )}

          {/* SUBMIT BUTTON */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full py-6 text-base font-semibold"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Iniciando Búsqueda...
              </>
            ) : (
              "Iniciar Búsqueda de Leads"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
