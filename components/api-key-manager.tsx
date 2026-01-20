"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Copy,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useApiKeyStore } from "@/store/ApiKeyStore";

interface ApiKeyManagerProps {
  userId?: string;
}

export function ApiKeyManager({ userId }: ApiKeyManagerProps) {
  const [newKeyName, setNewKeyName] = useState("");
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const {
    apiKeys,
    isLoading,
    isCreating,
    isDeleting,
    error,
    setUserId,
    fetchApiKeys,
    createApiKey,
    deleteApiKey,
    clearError,
  } = useApiKeyStore();

  useEffect(() => {
    if (userId) {
      setUserId(userId);
      fetchApiKeys(userId);
    }
  }, [userId, setUserId, fetchApiKeys]);

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
      clearError();
    }
  }, [error, toast, clearError]);

  const handleCreateApiKey = async () => {
    if (!newKeyName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a name for the API key",
        variant: "destructive",
      });
      return;
    }

    const success = await createApiKey(newKeyName, userId);
    if (success) {
      toast({
        title: "Success",
        description: "API key created successfully",
      });
      setNewKeyName("");
    }
  };

  const handleDeleteApiKey = async (keyId: string) => {
    const success = await deleteApiKey(keyId);
    if (success) {
      toast({
        title: "Success",
        description: "API key deleted successfully",
      });
      // Remove from visible keys if it was visible
      setVisibleKeys((prev) => {
        const newSet = new Set(prev);
        newSet.delete(keyId);
        return newSet;
      });
    }
  };

  const handleRefresh = () => {
    if (userId) {
      fetchApiKeys(userId);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "API key copied to clipboard",
    });
  };

  const toggleKeyVisibility = (keyId: string) => {
    const newVisibleKeys = new Set(visibleKeys);
    if (newVisibleKeys.has(keyId)) {
      newVisibleKeys.delete(keyId);
    } else {
      newVisibleKeys.add(keyId);
    }
    setVisibleKeys(newVisibleKeys);
  };

  const maskApiKey = (key: string) => {
    if (!key || key.length < 16) return key || "••••••••••••••••";
    return `${key.substring(0, 8)}${"*".repeat(key.length - 16)}${key.substring(
      key.length - 8
    )}`;
  };

  const getKeyForDisplay = (apiKey: any) => {
    return apiKey.key || `api_key_${apiKey.id || apiKey._id}`;
  };

  if (!userId) {
    return (
      <Card className="futuristic-card">
        <CardContent className="flex items-center justify-center h-32">
          <div className="text-center">
            <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              Please log in to manage API keys
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="futuristic-card">
        <CardContent className="flex items-center justify-center h-32">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-sm text-muted-foreground">
              Loading API keys...
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="futuristic-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">API Keys</CardTitle>
              <CardDescription>
                Manage your API keys for accessing the ChatBot API. Keep your
                keys secure and never share them publicly.
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isLoading}
              className="glass-effect bg-transparent"
            >
              <RefreshCw
                className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
              />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="rounded-lg border border-blue-200 bg-gradient-to-r from-blue-50 to-blue-100 p-4 dark:border-blue-800 dark:from-blue-950 dark:to-blue-900">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                  Security Notice
                </p>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  API keys provide full access to your account. Store them
                  securely and rotate them regularly.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-end space-x-2">
              <div className="flex-1">
                <Label htmlFor="key-name">API Key Name</Label>
                <Input
                  id="key-name"
                  placeholder="e.g., Production Bot, Development"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  className="glass-effect border-border/50"
                  disabled={isCreating}
                />
              </div>
              <Button
                onClick={handleCreateApiKey}
                disabled={isCreating || !newKeyName.trim()}
                className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
              >
                {isCreating ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <Plus className="h-4 w-4 mr-2" />
                )}
                Create Key
              </Button>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">Your API Keys</h4>
              <Badge variant="secondary" className="text-xs">
                {apiKeys?.length || 0}{" "}
                {(apiKeys?.length || 0) === 1 ? "key" : "keys"}
              </Badge>
            </div>

            {!apiKeys || apiKeys.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-sm text-muted-foreground">
                  No API keys created yet.
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Create your first API key to get started.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {apiKeys.map((apiKey) => {
                  const keyId = apiKey.id || apiKey._id || "";
                  const displayKey = getKeyForDisplay(apiKey);

                  return (
                    <div
                      key={keyId}
                      className="flex items-center justify-between p-4 rounded-lg border border-border/50 bg-gradient-to-r from-card to-card/50"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <h5 className="text-sm font-medium">{apiKey.name}</h5>
                          <Badge variant="outline" className="text-xs">
                            {apiKey.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-2 mt-2">
                          <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
                            {visibleKeys.has(keyId)
                              ? displayKey
                              : maskApiKey(displayKey)}
                          </code>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleKeyVisibility(keyId)}
                            className="h-6 w-6 p-0"
                          >
                            {visibleKeys.has(keyId) ? (
                              <EyeOff className="h-3 w-3" />
                            ) : (
                              <Eye className="h-3 w-3" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(displayKey)}
                            className="h-6 w-6 p-0"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Created:{" "}
                          {new Date(apiKey.createdAt).toLocaleDateString()}
                          {apiKey.lastUsed &&
                            ` • Last used: ${new Date(
                              apiKey.lastUsed
                            ).toLocaleDateString()}`}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteApiKey(keyId)}
                        disabled={isDeleting === keyId}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10 ml-2"
                      >
                        {isDeleting === keyId ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-destructive"></div>
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="futuristic-card">
        <CardHeader>
          <CardTitle className="text-xl">API Documentation</CardTitle>
          <CardDescription>
            Learn how to use your API keys with our endpoints.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h5 className="text-sm font-medium">Authentication</h5>
            <p className="text-sm text-muted-foreground">
              Include your API key in the request headers:
            </p>
            <code className="block text-xs bg-muted p-3 rounded-md font-mono">
              Authorization: Bearer YOUR_API_KEY
            </code>
          </div>
          <div className="space-y-2">
            <h5 className="text-sm font-medium">Base URL</h5>
            <code className="block text-xs bg-muted p-3 rounded-md font-mono">
              http://localhost:8080/api/v1
            </code>
          </div>
          <div className="space-y-2">
            <h5 className="text-sm font-medium">Example Request</h5>
            <code className="block text-xs bg-muted p-3 rounded-md font-mono whitespace-pre-wrap">
              {`curl -X POST http://localhost:8080/api/v1/chat \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"message": "Hello, world!"}'`}
            </code>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="glass-effect bg-transparent"
          >
            View Full Documentation
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
