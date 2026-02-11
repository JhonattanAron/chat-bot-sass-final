"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPin, Circle, Plus, AlertTriangle, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { DashboardLayout } from "../pages/dashboard/dashboard-layout";

declare global {
  interface Window {
    google: any;
  }
}

interface MapBatchCreatorProps {
  onBatchCreated?: (batch: any) => void;
  userId?: string;
}

interface PlaceResult {
  name: string;
  lat: number;
  lng: number;
  placeId: string;
}

interface ZoneDuplicateInfo {
  isDuplicate: boolean;
  previousBatch?: {
    _id: string;
    query: string;
    location: { lat: number; lng: number };
    total_places: number;
    createdAt: string;
  };
  message: string;
}

interface Category {
  _id: string;
  name: string;
  value: string;
}

export function MapBatchCreator({
  onBatchCreated,
  userId,
}: MapBatchCreatorProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const circleRef = useRef<any>(null);

  // Hydration state
  const [isHydrated, setIsHydrated] = useState(false);

  // Map states
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

  // Keywords y categorías
  const [keywords, setKeywords] = useState<string[]>([]);
  const [keywordInput, setKeywordInput] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [selectedCategoryValue, setSelectedCategoryValue] = useState("");

  // Verificación de zona duplicada
  const [zoneCheckLoading, setZoneCheckLoading] = useState(false);
  const [zoneDuplicateInfo, setZoneDuplicateInfo] =
    useState<ZoneDuplicateInfo | null>(null);
  const [isDeepSearch, setIsDeepSearch] = useState(false);

  // Hydration effect
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Load categories from backend
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await fetch("/api/backend/google-maps/categories");
        if (res.ok) {
          const data = await res.json();
          setCategories(data.categories || []);
        }
      } catch (error) {
        console.error("[v0] Error loading categories:", error);
      } finally {
        setLoadingCategories(false);
      }
    };

    if (isHydrated) {
      loadCategories();
    }
  }, [isHydrated]);

  // Initialize map only after hydration
  useEffect(() => {
    if (!isHydrated || !mapRef.current) return;

    const initMap = () => {
      if (!window.google?.maps || mapInstanceRef.current) return;

      const defaultCenter = { lat: 40.7128, lng: -74.006 };
      const newMap = new window.google.maps.Map(mapRef.current, {
        zoom: 13,
        center: defaultCenter,
        mapTypeId: "roadmap",
      });

      newMap.addListener("click", (event: any) => {
        handlePlaceMarker(event.latLng, newMap);
      });

      mapInstanceRef.current = newMap;
    };

    if (window.google?.maps) {
      initMap();
    } else {
      const checkGoogleMaps = setInterval(() => {
        if (window.google?.maps) {
          clearInterval(checkGoogleMaps);
          initMap();
        }
      }, 100);

      return () => clearInterval(checkGoogleMaps);
    }
  }, [isHydrated]);

  const handlePlaceMarker = useCallback(
    (location: any, mapInstance?: any) => {
      const map = mapInstance || mapInstanceRef.current;
      if (!map) return;

      const lat = location.lat();
      const lng = location.lng();

      if (markerRef.current) markerRef.current.setMap(null);
      if (circleRef.current) circleRef.current.setMap(null);

      const newMarker = new window.google.maps.Marker({
        position: location,
        map,
        title: "Selected Location",
      });

      const newCircle = new window.google.maps.Circle({
        center: location,
        radius: radius,
        map,
        fillColor: "#2563eb",
        fillOpacity: 0.15,
        strokeColor: "#2563eb",
        strokeOpacity: 0.8,
        strokeWeight: 2,
      });

      markerRef.current = newMarker;
      circleRef.current = newCircle;
      setSelectedLocation({ lat, lng });
      setZoneDuplicateInfo(null);

      getAddressFromCoordinates(lat, lng);
    },
    [radius],
  );

  const getAddressFromCoordinates = (lat: number, lng: number) => {
    if (!window.google?.maps) return;

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results: any) => {
      if (results?.[0]) {
        setBatchName(results[0].formatted_address.split(",")[0]);
      }
    });
  };

  const searchPlaces = (query: string) => {
    if (!mapInstanceRef.current || !window.google?.maps || !query.trim()) {
      setSearchResults([]);
      return;
    }

    const service = new window.google.maps.places.PlacesService(
      mapInstanceRef.current,
    );
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
    if (!mapInstanceRef.current) return;

    const location = new window.google.maps.LatLng(place.lat, place.lng);
    mapInstanceRef.current.setCenter(location);
    mapInstanceRef.current.setZoom(15);
    handlePlaceMarker(location, mapInstanceRef.current);
    setBatchName(place.name);
    setSearchQuery("");
    setShowResults(false);
  };

  const handleRadiusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newRadius = Number(e.target.value);
    setRadius(newRadius);

    if (circleRef.current) {
      circleRef.current.setRadius(newRadius);
    }
  };

  const handleAddKeyword = () => {
    if (keywordInput.trim() && !keywords.includes(keywordInput.trim())) {
      setKeywords([...keywords, keywordInput.trim()]);
      setKeywordInput("");
    }
  };

  const handleRemoveKeyword = (keyword: string) => {
    setKeywords(keywords.filter((k) => k !== keyword));
  };

  const handleAddCategory = (categoryValue: string) => {
    if (categoryValue && !selectedCategories.includes(categoryValue)) {
      setSelectedCategories([...selectedCategories, categoryValue]);
      setSelectedCategoryValue("");
    }
  };

  const handleRemoveCategory = (categoryValue: string) => {
    setSelectedCategories(
      selectedCategories.filter((c) => c !== categoryValue),
    );
  };

  const handleCheckZone = async () => {
    if (!selectedLocation) {
      toast.error("Please select a location first");
      return;
    }

    setZoneCheckLoading(true);
    try {
      const res = await fetch("/api/backend/google-maps-leads/check-zone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          location: selectedLocation,
          radius,
          user_id: session?.binding_id,
        }),
      });

      if (!res.ok) throw new Error("Failed to check zone");

      const data = (await res.json()) as ZoneDuplicateInfo;
      setZoneDuplicateInfo(data);

      if (data.isDuplicate) {
        setIsDeepSearch(true);
        toast.success("Zone previously scraped. Deep search enabled.");
      } else {
        toast.success("No previous scraping in this zone.");
      }
    } catch (error) {
      console.error("[v0] Error checking zone:", error);
      toast.error("Failed to check zone");
    } finally {
      setZoneCheckLoading(false);
    }
  };

  const handleCreateBatch = async () => {
    if (!selectedLocation || !batchName.trim()) {
      toast.error("Please select a location and enter a batch name");
      return;
    }

    if (keywords.length === 0) {
      toast.error("Please add at least one keyword");
      return;
    }

    if (selectedCategories.length === 0) {
      toast.error("Please select at least one category");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/backend/google-maps-leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: session?.binding_id,
          query: keywords.join(", "),
          location: {
            lat: selectedLocation.lat,
            lng: selectedLocation.lng,
          },
          radius,
          batch_name: batchName,
          keywords,
          categories: selectedCategories,
          is_deep_search: isDeepSearch,
          previous_batch_id: isDeepSearch
            ? zoneDuplicateInfo?.previousBatch?._id
            : null,
        }),
      });

      if (!response.ok) throw new Error("Failed to create batch");

      const batch = await response.json();
      toast.success("Batch created successfully!");

      // Reset form
      setBatchName("");
      setSearchQuery("");
      setKeywords([]);
      setSelectedCategories([]);
      setSearchResults([]);
      setShowResults(false);
      setZoneDuplicateInfo(null);
      setIsDeepSearch(false);

      onBatchCreated?.(batch);
    } catch (error) {
      console.error("[v0] Error creating batch:", error);
      toast.error("Failed to create batch");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isHydrated) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Create New Batch
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center h-96">
            <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          Create New Batch
        </CardTitle>
        <CardDescription>
          Select location, add keywords &amp; categories, and configure your
          scraping parameters
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Map Section */}
        <div>
          <Label className="mb-2 block">Select Location on Map</Label>
          <div
            ref={mapRef}
            className="w-full h-96 rounded-lg border border-gray-200"
          />
          <p className="text-xs text-gray-500 mt-2">
            Click on the map to place a marker for your scraping zone
          </p>
        </div>

        {/* Search Places */}
        <div className="space-y-2 relative">
          <Label htmlFor="search-place">Search Places</Label>
          <Input
            id="search-place"
            ref={searchBoxRef}
            placeholder="e.g. dental clinics, restaurants, pharmacies..."
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

        {/* Batch Name */}
        <div className="space-y-2">
          <Label htmlFor="batch-name">Batch Name</Label>
          <Input
            id="batch-name"
            placeholder="Location name or custom identifier"
            value={batchName}
            onChange={(e) => setBatchName(e.target.value)}
          />
        </div>

        {/* Radius */}
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

        {/* Keywords */}
        <div className="space-y-2">
          <Label htmlFor="keywords">Search Keywords</Label>
          <div className="flex gap-2">
            <Input
              id="keywords"
              placeholder="Add keyword (e.g., dental clinic)"
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddKeyword();
                }
              }}
            />
            <Button onClick={handleAddKeyword} variant="outline" size="sm">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {keywords.map((keyword) => (
              <div
                key={keyword}
                className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
              >
                {keyword}
                <button
                  onClick={() => handleRemoveKeyword(keyword)}
                  className="hover:text-blue-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
          {keywords.length === 0 && (
            <p className="text-xs text-red-500">
              At least one keyword required
            </p>
          )}
        </div>

        {/* Categories */}
        <div className="space-y-2">
          <Label htmlFor="categories">Categories (Place Types)</Label>
          <div className="flex gap-2">
            <Select
              value={selectedCategoryValue}
              onValueChange={setSelectedCategoryValue}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a category..." />
              </SelectTrigger>
              <SelectContent>
                {loadingCategories ? (
                  <SelectItem value="loading">Loading...</SelectItem>
                ) : (
                  categories.map((cat) => (
                    <SelectItem key={cat._id} value={cat.value}>
                      {cat.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            <Button
              onClick={() => handleAddCategory(selectedCategoryValue)}
              variant="outline"
              size="sm"
              disabled={!selectedCategoryValue}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedCategories.map((categoryValue) => {
              const category = categories.find(
                (c) => c.value === categoryValue,
              );
              return (
                <div
                  key={categoryValue}
                  className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                >
                  {category?.name || categoryValue}
                  <button
                    onClick={() => handleRemoveCategory(categoryValue)}
                    className="hover:text-green-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
          {selectedCategories.length === 0 && (
            <p className="text-xs text-red-500">
              At least one category required
            </p>
          )}
        </div>

        {/* Zone Duplicate Check */}
        {selectedLocation && (
          <div className="space-y-3 pt-2 border-t">
            <Button
              onClick={handleCheckZone}
              variant="outline"
              disabled={zoneCheckLoading}
              className="w-full bg-transparent"
            >
              {zoneCheckLoading && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              Check Zone for Previous Scraping
            </Button>

            {zoneDuplicateInfo && (
              <>
                {zoneDuplicateInfo.isDuplicate ? (
                  <Alert className="border-yellow-200 bg-yellow-50">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    <AlertDescription className="text-yellow-800">
                      <strong>Zone Previously Scraped!</strong>
                      <p className="text-sm mt-1">
                        This zone was scraped on{" "}
                        {new Date(
                          zoneDuplicateInfo.previousBatch?.createdAt || "",
                        ).toLocaleDateString()}
                        . We&apos;ll perform a deeper search to find new
                        businesses not found in the previous batch.
                      </p>
                      {zoneDuplicateInfo.previousBatch && (
                        <p className="text-xs mt-1">
                          Previous batch found{" "}
                          {zoneDuplicateInfo.previousBatch.total_places} places
                        </p>
                      )}
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Alert className="border-green-200 bg-green-50">
                    <AlertDescription className="text-green-800">
                      <strong>✓ New Zone</strong> - No previous scraping
                      detected in this area
                    </AlertDescription>
                  </Alert>
                )}
              </>
            )}
          </div>
        )}

        {/* Location Info */}
        {selectedLocation && (
          <div className="text-sm text-gray-600 p-3 bg-gray-50 rounded">
            <p>
              <strong>Location:</strong> {selectedLocation.lat.toFixed(6)},{" "}
              {selectedLocation.lng.toFixed(6)}
            </p>
            <p>
              <strong>Radius:</strong> {(radius / 1000).toFixed(1)} km
            </p>
            {isDeepSearch && (
              <p className="text-blue-600 mt-1">
                <strong>Mode:</strong> Deep Search (searching for businesses not
                found previously)
              </p>
            )}
          </div>
        )}

        {/* Create Button */}
        <Button
          onClick={handleCreateBatch}
          disabled={
            isLoading ||
            keywords.length === 0 ||
            selectedCategories.length === 0
          }
          className="w-full"
          size="lg"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Creating...
            </>
          ) : (
            <>
              <Plus className="w-4 h-4 mr-2" />
              Create Batch
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
