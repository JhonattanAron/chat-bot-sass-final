// app/dashboard/send/page.tsx
"use client";

import { useState, useRef } from "react";
import { useEmail } from "@/contexts/EmailContext";
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
import { Send } from "lucide-react";

export default function SendEmailPage() {
  const { sendEmail, isLoading } = useEmail();
  const [formData, setFormData] = useState({
    to: "",
    subject: "",
    html: "<p>Hello!</p>",
  });
  const [preview, setPreview] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.to || !formData.subject || !formData.html) return;

    try {
      await sendEmail(formData.to, formData.subject, formData.html);
      setFormData({ to: "", subject: "", html: "<p>Hello!</p>" });
    } catch (error) {
      // Error handled by toast
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Send Email</h2>
        <p className="text-slate-400">Compose and send emails through Resend</p>
      </div>

      <div className="grid grid-cols-3 gap-8">
        {/* Form */}
        <div className="col-span-2">
          <Card className="border-slate-700 bg-slate-800/50">
            <CardHeader>
              <CardTitle className="text-white">Compose Email</CardTitle>
              <CardDescription>
                Fill in the details below to send an email
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSend} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="to" className="text-slate-300">
                    To Email Address
                  </Label>
                  <Input
                    id="to"
                    name="to"
                    type="email"
                    placeholder="recipient@example.com"
                    value={formData.to}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject" className="text-slate-300">
                    Subject
                  </Label>
                  <Input
                    id="subject"
                    name="subject"
                    placeholder="Email subject"
                    value={formData.subject}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="html" className="text-slate-300">
                    Email Content (HTML)
                  </Label>
                  <Textarea
                    id="html"
                    name="html"
                    placeholder="<p>Your HTML content here</p>"
                    value={formData.html}
                    onChange={handleChange}
                    disabled={isLoading}
                    rows={8}
                    className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500 font-mono text-sm"
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    type="submit"
                    disabled={
                      isLoading ||
                      !formData.to ||
                      !formData.subject ||
                      !formData.html
                    }
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin mr-2 w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Send Email
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setPreview(!preview)}
                    className="border-slate-600 text-slate-300 hover:bg-slate-700"
                  >
                    {preview ? "Hide" : "Show"} Preview
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Preview */}
        {preview && (
          <div className="col-span-1">
            <Card className="border-slate-700 bg-slate-800/50 h-full">
              <CardHeader>
                <CardTitle className="text-white text-sm">Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-slate-500 text-xs uppercase mb-1">To</p>
                    <p className="text-white break-all">
                      {formData.to || "No recipient"}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs uppercase mb-1">
                      Subject
                    </p>
                    <p className="text-white">
                      {formData.subject || "No subject"}
                    </p>
                  </div>
                  <div className="border-t border-slate-700 pt-3">
                    <p className="text-slate-500 text-xs uppercase mb-2">
                      Content
                    </p>
                    <div
                      className="bg-white text-slate-900 p-4 rounded text-xs"
                      dangerouslySetInnerHTML={{ __html: formData.html }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
