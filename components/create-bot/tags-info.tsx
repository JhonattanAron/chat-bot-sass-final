import { Badge } from "@/components/ui/badge";
import { MessageCircle, Send, Globe } from "lucide-react";

export function CommunicationTags() {
  return (
    <div className="space-y-8">
      {/* Ejemplo de uso individual */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Tags Individuales</h2>
        <div className="flex flex-wrap gap-4">
          <WhatsAppTag />
          <TelegramTag />
          <WebsiteTag />
        </div>
      </div>

      {/* Ejemplo de uso en grupo */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Canales de Contacto</h2>
        <div className="p-6 border rounded-lg bg-card">
          <h3 className="font-medium mb-3">Contáctanos por:</h3>
          <div className="flex flex-wrap gap-2">
            <WhatsAppTag />
            <TelegramTag />
            <WebsiteTag />
          </div>
        </div>
      </div>

      {/* Ejemplo con texto personalizado */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Tags con Texto Personalizado</h2>
        <div className="flex flex-wrap gap-4">
          <WhatsAppTag text="Chat WhatsApp" />
          <TelegramTag text="Canal Telegram" />
          <WebsiteTag text="Visitar Web" />
        </div>
      </div>
    </div>
  );
}

// Tag de WhatsApp
export function WhatsAppTag({ text = "WhatsApp" }: { text?: string }) {
  return (
    <Badge
      variant="outline"
      className="bg-green-50 border-green-200 text-green-700 hover:bg-green-100 dark:bg-green-950 dark:border-green-800 dark:text-green-300 dark:hover:bg-green-900 transition-colors"
    >
      <MessageCircle className="w-3 h-3 mr-1.5" />
      {text}
    </Badge>
  );
}

// Tag de Telegram
export function TelegramTag({ text = "Telegram" }: { text?: string }) {
  return (
    <Badge
      variant="outline"
      className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 dark:bg-blue-950 dark:border-blue-800 dark:text-blue-300 dark:hover:bg-blue-900 transition-colors"
    >
      <Send className="w-3 h-3 mr-1.5" />
      {text}
    </Badge>
  );
}

// Tag de Website
export function WebsiteTag({ text = "Website" }: { text?: string }) {
  return (
    <Badge
      variant="outline"
      className="bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100 dark:bg-purple-950 dark:border-purple-800 dark:text-purple-300 dark:hover:bg-purple-900 transition-colors"
    >
      <Globe className="w-3 h-3 mr-1.5" />
      {text}
    </Badge>
  );
}
