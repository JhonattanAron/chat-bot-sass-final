"use client";

import React from "react";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { MapPin, Circle, Plus } from "lucide-react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

declare global {
  interface Window {
    google: any;
  }
}

interface MapBatchCreatorProps {
  onBatchCreated?: (batch: any) => void;
}

interface PlaceResult {
  name: string;
  lat: number;
  lng: number;
  placeId: string;
}

export function MapBatchCreator({ onBatchCreated }: MapBatchCreatorProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [marker, setMarker] = useState<any>(null);
  const [circle, setCircle] = useState<any>(null);
  const [radius, setRadius] = useState(1000);
  const [batchName, setBatchName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<PlaceResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const searchBoxRef = useRef<any>(null);
  const { data: session } = useSession();

  useEffect(() => {
    if (!mapRef.current) return;

    // Wait for Google Maps to be loaded
    const checkGoogleMaps = setInterval(() => {
      if (window.google?.maps) {
        clearInterval(checkGoogleMaps);
        initializeMap();
      }
    }, 100);

    return () => clearInterval(checkGoogleMaps);
  }, []);

  const initializeMap = () => {
    if (!window.google?.maps || !mapRef.current) return;

    const defaultCenter = { lat: 40.7128, lng: -74.006 }; // New York
    const newMap = new window.google.maps.Map(mapRef.current, {
      zoom: 13,
      center: defaultCenter,
      mapTypeId: "roadmap",
    });

    // Click to place marker
    newMap.addListener("click", (event: any) => {
      placeMarker(event.latLng, newMap);
    });

    setMap(newMap);
  };

  const placeMarker = (location: any, mapInstance: any) => {
    const lat = location.lat();
    const lng = location.lng();

    // Remove existing marker
    if (marker) marker.setMap(null);
    if (circle) circle.setMap(null);

    // Add new marker
    const newMarker = new window.google.maps.Marker({
      position: location,
      map: mapInstance,
      title: "Selected Location",
    });

    // Add circle for radius
    const newCircle = new window.google.maps.Circle({
      center: location,
      radius: radius,
      map: mapInstance,
      fillColor: "#2563eb",
      fillOpacity: 0.15,
      strokeColor: "#2563eb",
      strokeOpacity: 0.8,
      strokeWeight: 2,
    });

    setMarker(newMarker);
    setCircle(newCircle);
    setSelectedLocation({ lat, lng });

    // Get address from coordinates
    getAddressFromCoordinates(lat, lng);
  };

  const getAddressFromCoordinates = (lat: number, lng: number) => {
    if (!window.google?.maps) return;

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode(
      { location: { lat, lng } },
      (results: any, status: any) => {
        if (status === "OK" && results[0]) {
          setBatchName(results[0].formatted_address.split(",")[0]);
        }
      },
    );
  };

  const searchPlaces = (query: string) => {
    if (!map || !window.google?.maps || !query.trim()) {
      setSearchResults([]);
      return;
    }

    const service = new window.google.maps.places.PlacesService(map);

    const request = {
      query,
      fields: ["name", "geometry", "place_id"],
    };

    service.findPlaceFromQuery(request, (results: any, status: any) => {
      if (
        status === window.google.maps.places.PlacesServiceStatus.OK &&
        results
      ) {
        const places = results.slice(0, 8).map((place: any) => ({
          name: place.name,
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
          placeId: place.place_id,
        }));

        setSearchResults(places);
        setShowResults(true);
      }
    });
  };

  const handleSelectPlace = (place: PlaceResult) => {
    if (!map) return;

    const location = new window.google.maps.LatLng(place.lat, place.lng);
    map.setCenter(location);
    map.setZoom(15);
    placeMarker(location, map);
    setBatchName(place.name);
    setSearchQuery("");
    setShowResults(false);
  };

  const handleRadiusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newRadius = Number(e.target.value);
    setRadius(newRadius);

    if (circle) {
      circle.setRadius(newRadius);
    }
  };

  const handleCreateBatch = async () => {
    if (!selectedLocation || !batchName.trim()) {
      toast.error("Please select a location and enter a batch name");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/backend/google-maps-leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: session?.binding_id, // o el real
          query: searchQuery || batchName,
          location: {
            lat: selectedLocation.lat,
            lng: selectedLocation.lng,
          },
          radius,
        }),
      });

      if (!response.ok) throw new Error("Failed to create batch");

      const batch = await response.json();
      toast.success("Batch created successfully!");
      setBatchName("");
      setSearchQuery("");
      setSearchResults([]);
      setShowResults(false);
      onBatchCreated?.(batch);
    } catch (error) {
      console.error("[v0] Error creating batch:", error);
      toast.error("Failed to create batch");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          Create New Batch
        </CardTitle>
        <CardDescription>
          Click on the map to select a location and set the scraping radius
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          ref={mapRef}
          className="w-full h-96 rounded-lg border border-gray-200"
        />

        <div className="space-y-2 relative">
          <Label htmlFor="search-place">Search Places</Label>
          <Input
            id="search-place"
            ref={searchBoxRef}
            placeholder="e.g. dental clinics, chicken restaurants, pharmacies, stores..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              searchPlaces(e.target.value);
            }}
            onFocus={() => searchQuery && setShowResults(true)}
          />
          {showResults && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 border border-gray-200 rounded-lg bg-white shadow-lg z-50 max-h-64 overflow-y-auto">
              {searchResults.map((place) => (
                <button
                  key={place.placeId}
                  onClick={() => handleSelectPlace(place)}
                  className="w-full text-left px-4 py-2 hover:bg-blue-50 border-b border-gray-100 last:border-b-0 transition"
                >
                  <p className="font-medium text-sm">{place.name}</p>
                  <p className="text-xs text-gray-500">
                    {place.lat.toFixed(4)}, {place.lng.toFixed(4)}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="batch-name">Batch Name</Label>
          <Input
            id="batch-name"
            placeholder="Location name or custom identifier"
            value={batchName}
            onChange={(e) => setBatchName(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="radius" className="flex items-center gap-2">
            <Circle className="w-4 h-4" />
            Scraping Radius: {(radius / 1000).toFixed(1)} km
          </Label>
          <Input
            id="radius"
            type="range"
            min="100"
            max="50000"
            step="100"
            value={radius}
            onChange={handleRadiusChange}
            className="cursor-pointer"
          />
          <p className="text-xs text-gray-500">Range: 100m - 50km</p>
        </div>

        {selectedLocation && (
          <div className="text-sm text-gray-600 p-3 bg-gray-50 rounded">
            <p>
              <strong>Location:</strong> {selectedLocation.lat.toFixed(6)},{" "}
              {selectedLocation.lng.toFixed(6)}
            </p>
            <p>
              <strong>Radius:</strong> {(radius / 1000).toFixed(1)} km
            </p>
          </div>
        )}

        <Button
          onClick={handleCreateBatch}
          disabled={isLoading}
          className="w-full"
          size="lg"
        >
          <Plus className="w-4 h-4 mr-2" />
          {isLoading ? "Creating..." : "Create Batch"}
        </Button>
      </CardContent>
    </Card>
  );
}
