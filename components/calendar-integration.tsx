"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, Check, X, CalendarDays, CalendarClock, Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface CalendarIntegrationProps {
  language?: "en" | "es"
}

export function CalendarIntegration({ language = "en" }: CalendarIntegrationProps) {
  const [isConnected, setIsConnected] = useState(false)
  const [apiKey, setApiKey] = useState("")
  const [calendarId, setCalendarId] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [availableCalendars, setAvailableCalendars] = useState<string[]>([])
  const [settings, setSettings] = useState({
    allowBooking: true,
    allowRescheduling: true,
    allowCancellation: true,
    minAdvanceHours: "24",
    maxAdvanceDays: "30",
    confirmationRequired: true,
    reminderEnabled: true,
    reminderHours: "24",
  })

  const handleConnect = () => {
    if (!apiKey) return

    setIsLoading(true)

    // Simulate API connection
    setTimeout(() => {
      setIsConnected(true)
      setIsLoading(false)
      setAvailableCalendars(["Main Calendar", "Work Calendar", "Personal Calendar"])
    }, 1500)
  }

  const handleDisconnect = () => {
    setIsConnected(false)
    setApiKey("")
    setCalendarId("")
    setAvailableCalendars([])
  }

  const updateSetting = (key: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const businessHours = [
    { day: language === "en" ? "Monday" : "Lunes", hours: "9:00 AM - 5:00 PM" },
    { day: language === "en" ? "Tuesday" : "Martes", hours: "9:00 AM - 5:00 PM" },
    { day: language === "en" ? "Wednesday" : "Miércoles", hours: "9:00 AM - 5:00 PM" },
    { day: language === "en" ? "Thursday" : "Jueves", hours: "9:00 AM - 5:00 PM" },
    { day: language === "en" ? "Friday" : "Viernes", hours: "9:00 AM - 5:00 PM" },
    { day: language === "en" ? "Saturday" : "Sábado", hours: "10:00 AM - 2:00 PM" },
    { day: language === "en" ? "Sunday" : "Domingo", hours: language === "en" ? "Closed" : "Cerrado" },
  ]

  const appointmentTypes = [
    { name: language === "en" ? "Initial Consultation" : "Consulta Inicial", duration: "30 min" },
    { name: language === "en" ? "Follow-up Session" : "Sesión de Seguimiento", duration: "45 min" },
    { name: language === "en" ? "Comprehensive Evaluation" : "Evaluación Integral", duration: "60 min" },
    { name: language === "en" ? "Emergency Session" : "Sesión de Emergencia", duration: "30 min" },
  ]

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>
              {language === "en" ? "MyNeuroCalendar Integration" : "Integración con MyNeuroCalendar"}
            </CardTitle>
            <CardDescription>
              {language === "en"
                ? "Connect your chatbot to MyNeuroCalendar to manage appointments"
                : "Conecte su chatbot a MyNeuroCalendar para gestionar citas"}
            </CardDescription>
          </div>
          {isConnected && (
            <Badge variant="outline" className="flex items-center gap-1">
              <Check className="h-3 w-3 text-green-500" />
              {language === "en" ? "Connected" : "Conectado"}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {!isConnected ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="api-key">
                {language === "en" ? "MyNeuroCalendar API Key" : "Clave API de MyNeuroCalendar"}
              </Label>
              <Input
                id="api-key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder={language === "en" ? "Enter your API key" : "Ingrese su clave API"}
              />
              <p className="text-sm text-muted-foreground">
                {language === "en"
                  ? "You can find your API key in your MyNeuroCalendar account settings"
                  : "Puede encontrar su clave API en la configuración de su cuenta de MyNeuroCalendar"}
              </p>
            </div>
            <Button onClick={handleConnect} disabled={!apiKey || isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Clock className="mr-2 h-4 w-4 animate-spin" />
                  {language === "en" ? "Connecting..." : "Conectando..."}
                </>
              ) : (
                <>
                  <Calendar className="mr-2 h-4 w-4" />
                  {language === "en" ? "Connect to MyNeuroCalendar" : "Conectar a MyNeuroCalendar"}
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <Tabs defaultValue="settings">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="settings">{language === "en" ? "Settings" : "Configuración"}</TabsTrigger>
                <TabsTrigger value="hours">{language === "en" ? "Business Hours" : "Horario Laboral"}</TabsTrigger>
                <TabsTrigger value="types">{language === "en" ? "Appointment Types" : "Tipos de Citas"}</TabsTrigger>
              </TabsList>

              <TabsContent value="settings" className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="calendar-id">
                    {language === "en" ? "Select Calendar" : "Seleccionar Calendario"}
                  </Label>
                  <Select value={calendarId} onValueChange={setCalendarId}>
                    <SelectTrigger id="calendar-id">
                      <SelectValue placeholder={language === "en" ? "Select a calendar" : "Seleccione un calendario"} />
                    </SelectTrigger>
                    <SelectContent>
                      {availableCalendars.map((calendar) => (
                        <SelectItem key={calendar} value={calendar}>
                          {calendar}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="allow-booking">{language === "en" ? "Allow Booking" : "Permitir Reservas"}</Label>
                      <p className="text-xs text-muted-foreground">
                        {language === "en"
                          ? "Let the chatbot schedule new appointments"
                          : "Permitir que el chatbot programe nuevas citas"}
                      </p>
                    </div>
                    <Switch
                      id="allow-booking"
                      checked={settings.allowBooking}
                      onCheckedChange={(checked) => updateSetting("allowBooking", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="allow-rescheduling">
                        {language === "en" ? "Allow Rescheduling" : "Permitir Reprogramación"}
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        {language === "en"
                          ? "Let the chatbot reschedule existing appointments"
                          : "Permitir que el chatbot reprograme citas existentes"}
                      </p>
                    </div>
                    <Switch
                      id="allow-rescheduling"
                      checked={settings.allowRescheduling}
                      onCheckedChange={(checked) => updateSetting("allowRescheduling", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="allow-cancellation">
                        {language === "en" ? "Allow Cancellation" : "Permitir Cancelación"}
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        {language === "en"
                          ? "Let the chatbot cancel appointments"
                          : "Permitir que el chatbot cancele citas"}
                      </p>
                    </div>
                    <Switch
                      id="allow-cancellation"
                      checked={settings.allowCancellation}
                      onCheckedChange={(checked) => updateSetting("allowCancellation", checked)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="min-advance-hours">
                        {language === "en" ? "Minimum Advance Hours" : "Horas Mínimas de Anticipación"}
                      </Label>
                      <Input
                        id="min-advance-hours"
                        type="number"
                        value={settings.minAdvanceHours}
                        onChange={(e) => updateSetting("minAdvanceHours", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="max-advance-days">
                        {language === "en" ? "Maximum Advance Days" : "Días Máximos de Anticipación"}
                      </Label>
                      <Input
                        id="max-advance-days"
                        type="number"
                        value={settings.maxAdvanceDays}
                        onChange={(e) => updateSetting("maxAdvanceDays", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="confirmation-required">
                        {language === "en" ? "Confirmation Required" : "Confirmación Requerida"}
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        {language === "en"
                          ? "Require manual confirmation for appointments"
                          : "Requerir confirmación manual para las citas"}
                      </p>
                    </div>
                    <Switch
                      id="confirmation-required"
                      checked={settings.confirmationRequired}
                      onCheckedChange={(checked) => updateSetting("confirmationRequired", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="reminder-enabled">
                        {language === "en" ? "Send Reminders" : "Enviar Recordatorios"}
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        {language === "en"
                          ? "Send appointment reminders to clients"
                          : "Enviar recordatorios de citas a los clientes"}
                      </p>
                    </div>
                    <Switch
                      id="reminder-enabled"
                      checked={settings.reminderEnabled}
                      onCheckedChange={(checked) => updateSetting("reminderEnabled", checked)}
                    />
                  </div>

                  {settings.reminderEnabled && (
                    <div className="space-y-2">
                      <Label htmlFor="reminder-hours">
                        {language === "en" ? "Reminder Hours Before" : "Horas de Recordatorio Antes"}
                      </Label>
                      <Input
                        id="reminder-hours"
                        type="number"
                        value={settings.reminderHours}
                        onChange={(e) => updateSetting("reminderHours", e.target.value)}
                      />
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="hours" className="pt-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium">{language === "en" ? "Business Hours" : "Horario Laboral"}</h3>
                    <Button variant="outline" size="sm">
                      <CalendarClock className="mr-2 h-4 w-4" />
                      {language === "en" ? "Edit Hours" : "Editar Horario"}
                    </Button>
                  </div>

                  <div className="rounded-md border">
                    <div className="grid grid-cols-2 border-b bg-muted/50 p-2 text-sm font-medium">
                      <div>{language === "en" ? "Day" : "Día"}</div>
                      <div>{language === "en" ? "Hours" : "Horario"}</div>
                    </div>
                    <div className="divide-y">
                      {businessHours.map((item) => (
                        <div key={item.day} className="grid grid-cols-2 p-2 text-sm">
                          <div>{item.day}</div>
                          <div>{item.hours}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="types" className="pt-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium">
                      {language === "en" ? "Appointment Types" : "Tipos de Citas"}
                    </h3>
                    <Button variant="outline" size="sm">
                      <Users className="mr-2 h-4 w-4" />
                      {language === "en" ? "Manage Types" : "Gestionar Tipos"}
                    </Button>
                  </div>

                  <div className="rounded-md border">
                    <div className="grid grid-cols-2 border-b bg-muted/50 p-2 text-sm font-medium">
                      <div>{language === "en" ? "Type" : "Tipo"}</div>
                      <div>{language === "en" ? "Duration" : "Duración"}</div>
                    </div>
                    <div className="divide-y">
                      {appointmentTypes.map((item) => (
                        <div key={item.name} className="grid grid-cols-2 p-2 text-sm">
                          <div>{item.name}</div>
                          <div>{item.duration}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </CardContent>
      {isConnected && (
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handleDisconnect}>
            <X className="mr-2 h-4 w-4" />
            {language === "en" ? "Disconnect" : "Desconectar"}
          </Button>
          <Button>
            <CalendarDays className="mr-2 h-4 w-4" />
            {language === "en" ? "Save Settings" : "Guardar Configuración"}
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
