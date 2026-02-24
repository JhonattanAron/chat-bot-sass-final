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
import { Textarea } from "@/components/ui/textarea";
import { FileText, Plus, Trash2, Copy, Edit } from "lucide-react";
import { toast } from "sonner";

interface Template {
  id: string;
  name: string;
  html: string;
  createdAt: string;
}

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", html: "" });

  // Load templates from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("emailTemplates");
    if (stored) {
      try {
        setTemplates(JSON.parse(stored));
      } catch (error) {
        console.error("Failed to load templates:", error);
      }
    }
  }, []);

  // Save templates to localStorage
  const saveTemplates = (newTemplates: Template[]) => {
    localStorage.setItem("emailTemplates", JSON.stringify(newTemplates));
    setTemplates(newTemplates);
  };

  const handleSaveTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.html.trim()) {
      toast.error("Name and content are required");
      return;
    }

    if (editingId) {
      // Update existing template
      const updated = templates.map((t) =>
        t.id === editingId
          ? { ...t, name: formData.name, html: formData.html }
          : t,
      );
      saveTemplates(updated);
      toast.success("Template updated");
    } else {
      // Create new template
      const newTemplate: Template = {
        id: Date.now().toString(),
        name: formData.name,
        html: formData.html,
        createdAt: new Date().toISOString(),
      };
      saveTemplates([...templates, newTemplate]);
      toast.success("Template created");
    }

    setFormData({ name: "", html: "" });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (template: Template) => {
    setFormData({ name: template.name, html: template.html });
    setEditingId(template.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this template?")) {
      saveTemplates(templates.filter((t) => t.id !== id));
      toast.success("Template deleted");
    }
  };

  const handleCopyHtml = (html: string) => {
    navigator.clipboard.writeText(html);
    toast.success("Template copied to clipboard");
  };

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">
            Email Templates
          </h2>
          <p className="text-slate-400">
            Create and manage reusable email templates
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingId(null);
            setFormData({ name: "", html: "" });
            setShowForm(!showForm);
          }}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Template
        </Button>
      </div>

      {showForm && (
        <Card className="mb-8 border-blue-700/50 bg-blue-900/20">
          <CardHeader>
            <CardTitle className="text-white">
              {editingId ? "Edit Template" : "Create New Template"}
            </CardTitle>
            <CardDescription>
              {editingId
                ? "Update your email template"
                : "Create a reusable email template with HTML"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSaveTemplate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-slate-300">
                  Template Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="e.g., Welcome Email"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="html" className="text-slate-300">
                  HTML Content
                </Label>
                <Textarea
                  id="html"
                  placeholder="<p>Hello {{name}},</p><p>Welcome to our service!</p>"
                  value={formData.html}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, html: e.target.value }))
                  }
                  rows={8}
                  className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500 font-mono text-sm"
                />
                <p className="text-xs text-slate-500">
                  Tip: Use variables like {"{{"}'name{"}}"} for dynamic content
                </p>
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  {editingId ? "Update Template" : "Create Template"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                    setFormData({ name: "", html: "" });
                  }}
                  className="border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {templates.length === 0 ? (
        <Card className="border-slate-700 bg-slate-800/50">
          <CardContent className="py-12 text-center">
            <FileText className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-300 mb-2">
              No templates yet
            </h3>
            <p className="text-slate-500 mb-4">
              Create your first email template to reuse across campaigns
            </p>
            <Button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Template
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {templates.map((template) => (
            <Card
              key={template.id}
              className="border-slate-700 bg-slate-800/50 flex flex-col"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between mb-2">
                  <CardTitle className="text-white text-lg break-words pr-2">
                    {template.name}
                  </CardTitle>
                  <div className="flex gap-1 flex-shrink-0">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEdit(template)}
                      className="text-slate-400 hover:text-blue-400 hover:bg-slate-700 h-8 w-8 p-0"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(template.id)}
                      className="text-slate-400 hover:text-red-400 hover:bg-slate-700 h-8 w-8 p-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-xs text-slate-500">
                  Created{" "}
                  {new Date(template.createdAt).toLocaleDateString("es-ES")}
                </p>
              </CardHeader>
              <CardContent className="flex-1 space-y-3">
                <div className="bg-slate-700/50 p-3 rounded max-h-32 overflow-y-auto">
                  <pre className="text-xs text-slate-400 whitespace-pre-wrap break-words">
                    {template.html.substring(0, 200)}...
                  </pre>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleCopyHtml(template.html)}
                  className="w-full border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  <Copy className="w-3 h-3 mr-2" />
                  Copy HTML
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="mt-8 p-6 rounded-lg border border-slate-700 bg-slate-800/30">
        <h3 className="text-white font-semibold mb-3">Template Variables</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-400">
          <div>
            <code className="bg-slate-700/50 px-2 py-1 rounded text-blue-400">
              {"{{name}}"}
            </code>{" "}
            - Recipient name
          </div>
          <div>
            <code className="bg-slate-700/50 px-2 py-1 rounded text-blue-400">
              {"{{email}}"}
            </code>{" "}
            - Recipient email
          </div>
          <div>
            <code className="bg-slate-700/50 px-2 py-1 rounded text-blue-400">
              {"{{date}}"}
            </code>{" "}
            - Current date
          </div>
          <div>
            <code className="bg-slate-700/50 px-2 py-1 rounded text-blue-400">
              {"{{customField}}"}
            </code>{" "}
            - Custom variables
          </div>
        </div>
      </div>
    </div>
  );
}
