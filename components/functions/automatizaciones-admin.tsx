"use client";

import React, { JSX, useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { Badge } from "@/components/ui/badge";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  AlertCircle,
  Code,
  Database,
  Edit,
  Forward,
  Mail,
  Pause,
  Play,
  Plus,
  Reply,
  Send,
  Server,
  Shield,
  Terminal,
  Trash2,
  Webhook,
  Zap,
} from "lucide-react";
// IMPORTANT: keep your store import as-is
import { useAutomatedTasksStore } from "@/store/AutomatizedTaskStore";

/**
 * Tipos estrictos
 */
interface Client {
  id: string;
  name: string;
  email: string;
  company?: string;
  customFields: Record<string, string>;
  lastEmailSent?: string;
  responseReceived?: boolean;
  tags: string[];
}

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  variables: string[];
}

type CampaignStatus = "draft" | "scheduled" | "sent" | "completed";

interface EmailCampaign {
  id: string;
  name: string;
  clients: Client[];
  template: EmailTemplate;
  scheduledTime: string;
  timezone: string;
  status: CampaignStatus;
  sentCount: number;
  responseCount: number;
  autoReplyEnabled: boolean;
  autoReplyTemplate?: EmailTemplate;
}

type EmailProvider = "gmail" | "outlook" | "smtp" | "imap";

interface EmailConfig {
  provider: EmailProvider;
  smtpHost?: string;
  smtpPort?: number;
  imapHost?: string;
  imapPort?: number;
  username: string;
  password: string;
  useSSL: boolean;
  monitorFolder?: string;
}

type EmailFilterField = "from" | "to" | "subject" | "body" | "attachment";
type EmailFilterOp =
  | "contains"
  | "equals"
  | "starts_with"
  | "ends_with"
  | "regex";

interface EmailFilter {
  field: EmailFilterField;
  operator: EmailFilterOp;
  value: string;
}

type TaskActionType =
  | "command"
  | "api_call"
  | "notification"
  | "script"
  | "email_reply"
  | "email_send"
  | "email_forward"
  | "email_blast";

interface TaskAction {
  id: string;
  type: TaskActionType;
  name: string;
  config: {
    command?: string;
    script?: string;
    apiUrl?: string;
    method?: string;
    headers?: Record<string, string>;
    body?: string;
    notificationMessage?: string;
    emailTemplate?: string;
    emailTo?: string;
    emailSubject?: string;
    emailBody?: string;
    replyTemplate?: string;
    forwardTo?: string;
    attachOriginal?: boolean;
    campaign?: EmailCampaign;
    delayBetweenEmails?: number;
    trackOpens?: boolean;
    trackClicks?: boolean;
    [key: string]: unknown;
  };
}

type TaskTriggerType =
  | "webhook"
  | "schedule"
  | "api_monitor"
  | "log_monitor"
  | "email_received"
  | "custom"
  | "scheduled_email_blast";

interface TaskTrigger {
  type: TaskTriggerType;
  config: {
    webhookUrl?: string;
    schedule?: string;
    scheduledTime?: string;
    apiUrl?: string;
    logPath?: string;
    condition?: string;
    customTrigger?: string;
    emailConfig?: EmailConfig;
    emailFilters?: EmailFilter[];
    checkInterval?: number;
    timezone?: string;
    [key: string]: unknown;
  };
}

type TaskCategory =
  | "server"
  | "database"
  | "security"
  | "monitoring"
  | "email"
  | "custom"
  | "marketing";

type TaskStatus = "active" | "inactive" | "error";

interface AdvancedTask {
  id: string;
  name: string;
  description: string;
  category: TaskCategory;
  prompt: string;
  trigger: TaskTrigger;
  conditions: {
    field: string;
    operator: "equals" | "contains" | "greater_than" | "less_than" | "regex";
    value: string;
  }[];
  actions: TaskAction[];
  variables: Record<string, string>;
  emailTemplates?: EmailTemplate[];
  status: TaskStatus;
  lastRun?: string;
  runCount: number;
  emailCampaigns?: EmailCampaign[];
}

/**
 * UI catálogos
 */
const taskCategories: {
  value: TaskCategory;
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  color: string;
}[] = [
  {
    value: "server",
    label: "Administración de Servidor",
    icon: Server,
    color: "bg-blue-500",
  },
  {
    value: "database",
    label: "Base de Datos",
    icon: Database,
    color: "bg-green-500",
  },
  { value: "security", label: "Seguridad", icon: Shield, color: "bg-red-500" },
  {
    value: "monitoring",
    label: "Monitoreo",
    icon: AlertCircle,
    color: "bg-yellow-500",
  },
  {
    value: "email",
    label: "Gestión de Email",
    icon: Mail,
    color: "bg-indigo-500",
  },
  {
    value: "custom",
    label: "Personalizada",
    icon: Zap,
    color: "bg-purple-500",
  },
  {
    value: "marketing",
    label: "Email Marketing",
    icon: Send,
    color: "bg-pink-500",
  },
];

const triggerTypes: {
  value: TaskTriggerType;
  label: string;
  description: string;
}[] = [
  {
    value: "webhook",
    label: "Webhook",
    description: "Recibe alertas via HTTP",
  },
  {
    value: "schedule",
    label: "Programado",
    description: "Ejecuta en horarios específicos",
  },
  {
    value: "api_monitor",
    label: "Monitor API",
    description: "Monitorea endpoints",
  },
  {
    value: "log_monitor",
    label: "Monitor de Logs",
    description: "Analiza archivos de log",
  },
  {
    value: "email_received",
    label: "Email Recibido",
    description: "Se activa al recibir emails",
  },
  {
    value: "custom",
    label: "Personalizado",
    description: "Trigger personalizado",
  },
  {
    value: "scheduled_email_blast",
    label: "Envío Masivo Programado",
    description: "Envía emails masivos a hora específica",
  },
];

const actionTypes: {
  value: TaskActionType;
  label: string;
  description: string;
}[] = [
  {
    value: "command",
    label: "Comando del Sistema",
    description: "Ejecuta comandos bash/shell",
  },
  {
    value: "script",
    label: "Script Personalizado",
    description: "Ejecuta código personalizado",
  },
  {
    value: "api_call",
    label: "Llamada API",
    description: "Realiza peticiones HTTP",
  },
  {
    value: "notification",
    label: "Notificación",
    description: "Envía alertas/mensajes",
  },
  {
    value: "email_reply",
    label: "Responder Email",
    description: "Responde automáticamente al email",
  },
  {
    value: "email_send",
    label: "Enviar Email",
    description: "Envía un nuevo email",
  },
  {
    value: "email_forward",
    label: "Reenviar Email",
    description: "Reenvía el email a otra dirección",
  },
  {
    value: "email_blast",
    label: "Envío Masivo",
    description: "Envía emails personalizados a múltiples clientes",
  },
];

const emailProviders = [
  {
    value: "gmail",
    label: "Gmail",
    smtpHost: "smtp.gmail.com",
    smtpPort: 587,
    imapHost: "imap.gmail.com",
    imapPort: 993,
  },
  {
    value: "outlook",
    label: "Outlook",
    smtpHost: "smtp-mail.outlook.com",
    smtpPort: 587,
    imapHost: "outlook.office365.com",
    imapPort: 993,
  },
  {
    value: "smtp",
    label: "SMTP Personalizado",
    smtpHost: "",
    smtpPort: 587,
    imapHost: "",
    imapPort: 993,
  },
] as const;

/**
 * Helpers
 */
const uid = () => crypto.randomUUID();

const defaultEmailTemplate = (): EmailTemplate => ({
  id: uid(),
  name: "",
  subject: "",
  body: "",
  variables: [],
});

const defaultClient = (): Client => ({
  id: uid(),
  name: "",
  email: "",
  company: "",
  customFields: {},
  tags: [],
  responseReceived: false,
});

const defaultCampaign = (): EmailCampaign => ({
  id: uid(),
  name: "",
  clients: [],
  template: defaultEmailTemplate(),
  scheduledTime: "",
  timezone: "America/Mexico_City",
  status: "draft",
  sentCount: 0,
  responseCount: 0,
  autoReplyEnabled: false,
  autoReplyTemplate: defaultEmailTemplate(),
});

/**
 * Tipado local del store para tener estricto en este componente, sin cambiar tu store real
 */
interface AutomatedTasksStore {
  tasks: AdvancedTask[];
  loading: boolean;
  error: string | null;
  getTasks: (userId: string) => Promise<void>;
  createTask: (payload: Partial<AdvancedTask>) => Promise<{ success: boolean }>;
  updateTask: (
    taskId: string,
    userId: string,
    payload: Partial<AdvancedTask>
  ) => Promise<{ success: boolean }>;
  deleteTask: (taskId: string, userId: string) => Promise<void>;
  toggleTaskStatus: (taskId: string, userId: string) => Promise<void>;
}

/**
 * Componente
 */
export default function AdvancedBotTasks(): JSX.Element {
  const session = useSession();
  const userId =
    (
      session?.data as unknown as {
        binding_id?: string;
        user?: { id?: string };
      }
    )?.binding_id ||
    (session?.data as unknown as { user?: { id?: string } })?.user?.id ||
    "demo-user";

  const {
    tasks: tasksFromStore,
    loading,
    error,
    getTasks,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
  } = useAutomatedTasksStore() as unknown as AutomatedTasksStore;

  // Cargar tareas
  useEffect(() => {
    void getTasks(userId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  // Estado UI
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<AdvancedTask | null>(null);

  const resetNewTask = (): AdvancedTask => ({
    id: uid(),
    name: "",
    description: "",
    category: "server",
    prompt: "",
    trigger: { type: "webhook", config: {} },
    conditions: [],
    actions: [],
    variables: {},
    emailTemplates: [],
    status: "inactive",
    runCount: 0,
    emailCampaigns: [],
  });

  const [newTask, setNewTask] = useState<AdvancedTask>(resetNewTask);

  // Data memoizada y con tipos
  const tasks = useMemo<AdvancedTask[]>(
    () => tasksFromStore ?? [],
    [tasksFromStore]
  );

  /**
   * Persistencia
   */
  const handleSaveTask = async (): Promise<void> => {
    const payload: Partial<AdvancedTask> = {
      name: newTask.name || "",
      description: newTask.description || "",
      category: newTask.category || "server",
      prompt: newTask.prompt || "",
      trigger: newTask.trigger || { type: "webhook", config: {} },
      conditions: newTask.conditions || [],
      actions: newTask.actions || [],
      variables: newTask.variables || {},
      emailTemplates: newTask.emailTemplates || [],
      status: newTask.status || "inactive",
      runCount: newTask.runCount ?? 0,
      emailCampaigns: newTask.emailCampaigns || [],
    };

    const res = editingTask
      ? await updateTask(editingTask.id, userId, payload)
      : await createTask(payload);

    if (res?.success) {
      setIsDialogOpen(false);
      setEditingTask(null);
      setNewTask(resetNewTask());
    }
  };

  const handleToggleStatus = async (taskId: string) => {
    await toggleTaskStatus(taskId, userId);
  };

  const handleDeleteTask = async (taskId: string) => {
    await deleteTask(taskId, userId);
  };

  /**
   * Helpers de edición dentro del modal
   */

  const getCategoryInfo = (category: string) =>
    taskCategories.find((c) => c.value === category) || taskCategories[0];

  // Email filters
  const addEmailFilter = () => {
    const trigger: TaskTrigger = {
      ...(newTask.trigger ?? { type: "webhook", config: {} }),
    };
    trigger.config = trigger.config ?? {};
    const current = trigger.config.emailFilters ?? [];
    trigger.config.emailFilters = [
      ...current,
      { field: "subject", operator: "contains", value: "" } as EmailFilter,
    ];
    setNewTask({ ...newTask, trigger });
  };

  const updateEmailFilter = <K extends keyof EmailFilter>(
    index: number,
    field: K,
    value: EmailFilter[K]
  ) => {
    const trigger: TaskTrigger = {
      ...(newTask.trigger ?? { type: "webhook", config: {} }),
    };
    const filters = [...(trigger.config.emailFilters ?? [])];
    if (!filters[index]) return;
    filters[index] = { ...filters[index], [field]: value };
    trigger.config.emailFilters = filters;
    setNewTask({ ...newTask, trigger });
  };

  const removeEmailFilter = (index: number) => {
    const trigger: TaskTrigger = {
      ...(newTask.trigger ?? { type: "webhook", config: {} }),
    };
    const filters = [...(trigger.config.emailFilters ?? [])];
    filters.splice(index, 1);
    trigger.config.emailFilters = filters;
    setNewTask({ ...newTask, trigger });
  };

  // Email templates
  const addEmailTemplate = () => {
    setNewTask({
      ...newTask,
      emailTemplates: [
        ...(newTask.emailTemplates ?? []),
        defaultEmailTemplate(),
      ],
    });
  };

  const updateEmailTemplate = <K extends keyof EmailTemplate>(
    index: number,
    field: K,
    value: EmailTemplate[K]
  ) => {
    const templates = [...(newTask.emailTemplates ?? [])];
    if (!templates[index]) return;
    templates[index] = { ...templates[index], [field]: value };
    setNewTask({ ...newTask, emailTemplates: templates });
  };

  const removeEmailTemplate = (index: number) => {
    const templates = [...(newTask.emailTemplates ?? [])];
    templates.splice(index, 1);
    setNewTask({ ...newTask, emailTemplates: templates });
  };

  // Conditions
  const addCondition = () => {
    setNewTask({
      ...newTask,
      conditions: [
        ...(newTask.conditions ?? []),
        { field: "", operator: "equals", value: "" },
      ],
    });
  };

  const updateCondition = (
    index: number,
    field: keyof AdvancedTask["conditions"][number],
    value: string
  ) => {
    const conditions = [...(newTask.conditions ?? [])];
    if (!conditions[index]) return;
    conditions[index] = { ...conditions[index], [field]: value };
    setNewTask({ ...newTask, conditions });
  };

  const removeCondition = (index: number) => {
    const conditions = [...(newTask.conditions ?? [])];
    conditions.splice(index, 1);
    setNewTask({ ...newTask, conditions });
  };

  // Actions
  const addAction = () => {
    const newAction: TaskAction = {
      id: uid(),
      type: "command",
      name: "",
      config: {},
    };
    setNewTask({
      ...newTask,
      actions: [...(newTask.actions ?? []), newAction],
    });
  };

  const ensureEmailBlastDefaults = (a: TaskAction): TaskAction => {
    if (a.type !== "email_blast") return a;
    const existing = a.config.campaign;
    return {
      ...a,
      config: {
        ...a.config,
        campaign: existing ?? defaultCampaign(),
      },
    };
  };

  const updateAction = <K extends keyof TaskAction>(
    index: number,
    field: K,
    value: TaskAction[K]
  ) => {
    const actions = [...(newTask.actions ?? [])];
    if (!actions[index]) return;

    if (field === "config") {
      const prev = actions[index];
      const merged: TaskAction = {
        ...prev,
        config: { ...prev.config, ...(value as TaskAction["config"]) },
      };
      actions[index] = ensureEmailBlastDefaults(merged);
    } else if (field === "type") {
      const next: TaskAction = ensureEmailBlastDefaults({
        ...actions[index],
        type: value as TaskActionType,
      });
      actions[index] = next;
    } else {
      actions[index] = { ...actions[index], [field]: value } as TaskAction;
    }

    setNewTask({ ...newTask, actions });
  };

  const removeAction = (index: number) => {
    const actions = [...(newTask.actions ?? [])];
    actions.splice(index, 1);
    setNewTask({ ...newTask, actions });
  };

  // Variables
  const addVariable = (key: string, value: string) => {
    setNewTask({
      ...newTask,
      variables: { ...(newTask.variables ?? {}), [key]: value },
    });
  };

  const removeVariable = (key: string) => {
    const variables = { ...(newTask.variables ?? {}) };
    delete variables[key];
    setNewTask({ ...newTask, variables });
  };

  // Email blast clients
  const addClient = (actionIndex: number) => {
    const actions = [...(newTask.actions ?? [])];
    if (!actions[actionIndex]) return;
    const withDefaults = ensureEmailBlastDefaults(actions[actionIndex]);
    const campaign = withDefaults.config.campaign!;
    campaign.clients = [...(campaign.clients ?? []), defaultClient()];
    withDefaults.config.campaign = campaign;
    actions[actionIndex] = withDefaults;
    setNewTask({ ...newTask, actions });
  };

  const updateClient = <K extends keyof Client>(
    actionIndex: number,
    clientIndex: number,
    field: K,
    value: Client[K]
  ) => {
    const actions = [...(newTask.actions ?? [])];
    if (!actions[actionIndex]) return;
    const a = ensureEmailBlastDefaults(actions[actionIndex]);
    const campaign = a.config.campaign!;
    const clients = [...(campaign.clients ?? [])];
    if (!clients[clientIndex]) return;

    if (field === "customFields") {
      const incoming = value as Client["customFields"];
      clients[clientIndex] = {
        ...clients[clientIndex],
        customFields: {
          ...(clients[clientIndex].customFields ?? {}),
          ...incoming,
        },
      };
    } else if (field === "tags") {
      const incoming = String(value);
      clients[clientIndex] = {
        ...clients[clientIndex],
        tags: incoming
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      };
    } else {
      clients[clientIndex] = { ...clients[clientIndex], [field]: value };
    }

    a.config.campaign = { ...campaign, clients };
    actions[actionIndex] = a;
    setNewTask({ ...newTask, actions });
  };

  const removeClient = (actionIndex: number, clientIndex: number) => {
    const actions = [...(newTask.actions ?? [])];
    if (!actions[actionIndex]) return;
    const a = ensureEmailBlastDefaults(actions[actionIndex]);
    const campaign = a.config.campaign!;
    const clients = [...(campaign.clients ?? [])];
    clients.splice(clientIndex, 1);
    a.config.campaign = { ...campaign, clients };
    actions[actionIndex] = a;
    setNewTask({ ...newTask, actions });
  };

  const addCustomField = (
    actionIndex: number,
    clientIndex: number,
    key: string,
    value: string
  ) => {
    const actions = [...(newTask.actions ?? [])];
    if (!actions[actionIndex]) return;
    const a = ensureEmailBlastDefaults(actions[actionIndex]);
    const campaign = a.config.campaign!;
    const clients = [...(campaign.clients ?? [])];
    if (!clients[clientIndex]) return;
    clients[clientIndex] = {
      ...clients[clientIndex],
      customFields: {
        ...(clients[clientIndex].customFields ?? {}),
        [key]: value,
      },
    };
    a.config.campaign = { ...campaign, clients };
    actions[actionIndex] = a;
    setNewTask({ ...newTask, actions });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Tareas Automatizadas Avanzadas</h1>
          <p className="text-muted-foreground mt-2">
            {
              "Configura tareas complejas con triggers, condiciones, acciones personalizadas y gestión de emails"
            }
          </p>
          {loading && (
            <p className="text-xs text-muted-foreground mt-1">
              {"Cargando tareas..."}
            </p>
          )}
          {error && (
            <p className="text-xs text-red-600 mt-1">{`Error: ${error}`}</p>
          )}
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingTask(null);
                setNewTask(resetNewTask());
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Nueva Tarea Avanzada
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingTask ? "Editar Tarea" : "Nueva Tarea Automatizada"}
              </DialogTitle>
              <DialogDescription>
                {
                  "Configura una tarea avanzada con triggers, condiciones, acciones personalizadas y gestión de emails"
                }
              </DialogDescription>
            </DialogHeader>

            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="basic">Básico</TabsTrigger>
                <TabsTrigger value="trigger">Trigger</TabsTrigger>
                <TabsTrigger value="conditions">Condiciones</TabsTrigger>
                <TabsTrigger value="actions">Acciones</TabsTrigger>
                <TabsTrigger value="email">Email</TabsTrigger>
                <TabsTrigger value="variables">Variables</TabsTrigger>
              </TabsList>

              {/* Básico */}
              <TabsContent value="basic" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="task-name">Nombre de la Tarea</Label>
                    <Input
                      id="task-name"
                      placeholder="Ej: Respuesta automática de soporte"
                      value={newTask.name}
                      onChange={(e) =>
                        setNewTask({ ...newTask, name: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="task-category">Categoría</Label>
                    <Select
                      value={newTask.category}
                      onValueChange={(value) =>
                        setNewTask({
                          ...newTask,
                          category: value as TaskCategory,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona categoría" />
                      </SelectTrigger>
                      <SelectContent>
                        {taskCategories.map((category) => {
                          const Icon = category.icon;
                          return (
                            <SelectItem
                              key={category.value}
                              value={category.value}
                            >
                              <div className="flex items-center">
                                <Icon className="w-4 h-4 mr-2" />
                                {category.label}
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="task-description">Descripción</Label>
                  <Input
                    id="task-description"
                    placeholder="Breve descripción de lo que hace esta tarea"
                    value={newTask.description}
                    onChange={(e) =>
                      setNewTask({ ...newTask, description: e.target.value })
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="task-prompt">Contexto/Prompt del Bot</Label>
                  <Textarea
                    id="task-prompt"
                    placeholder="Describe cómo debe comportarse el bot cuando se active esta tarea..."
                    value={newTask.prompt}
                    onChange={(e) =>
                      setNewTask({ ...newTask, prompt: e.target.value })
                    }
                    rows={6}
                  />
                </div>
              </TabsContent>

              {/* Trigger */}
              <TabsContent value="trigger" className="space-y-4">
                <div>
                  <Label>Tipo de Trigger</Label>
                  <Select
                    value={newTask.trigger?.type ?? "webhook"}
                    onValueChange={(value) =>
                      setNewTask({
                        ...newTask,
                        trigger: {
                          type: value as TaskTriggerType,
                          config: {},
                        },
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona trigger" />
                    </SelectTrigger>
                    <SelectContent>
                      {triggerTypes.map((t) => (
                        <SelectItem key={t.value} value={t.value}>
                          <div>
                            <div className="font-medium">{t.label}</div>
                            <div className="text-xs text-muted-foreground">
                              {t.description}
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {newTask.trigger?.type === "email_received" && (
                  <div className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">
                          Configuración de Email
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Proveedor de Email</Label>
                            <Select
                              value={
                                newTask.trigger.config.emailConfig?.provider ??
                                "gmail"
                              }
                              onValueChange={(val) => {
                                const provider = emailProviders.find(
                                  (p) => p.value === val
                                );
                                setNewTask({
                                  ...newTask,
                                  trigger: {
                                    ...(newTask.trigger as TaskTrigger),
                                    config: {
                                      ...(newTask.trigger?.config ?? {}),
                                      emailConfig: {
                                        ...(newTask.trigger?.config
                                          .emailConfig ?? {
                                          username: "",
                                          password: "",
                                          useSSL: true,
                                          monitorFolder: "INBOX",
                                        }),
                                        provider: val as EmailProvider,
                                        smtpHost: provider?.smtpHost ?? "",
                                        smtpPort: provider?.smtpPort ?? 587,
                                        imapHost: provider?.imapHost ?? "",
                                        imapPort: provider?.imapPort ?? 993,
                                      },
                                    },
                                  },
                                });
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Selecciona proveedor" />
                              </SelectTrigger>
                              <SelectContent>
                                {emailProviders.map((p) => (
                                  <SelectItem key={p.value} value={p.value}>
                                    {p.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>Intervalo de Verificación (minutos)</Label>
                            <Input
                              type="number"
                              placeholder="5"
                              value={String(
                                newTask.trigger.config.checkInterval ?? ""
                              )}
                              onChange={(e) =>
                                setNewTask({
                                  ...newTask,
                                  trigger: {
                                    ...(newTask.trigger as TaskTrigger),
                                    config: {
                                      ...(newTask.trigger?.config ?? {}),
                                      checkInterval: Number.isNaN(
                                        parseInt(e.target.value)
                                      )
                                        ? 0
                                        : parseInt(e.target.value),
                                    },
                                  },
                                })
                              }
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Usuario/Email</Label>
                            <Input
                              placeholder="usuario@ejemplo.com"
                              value={
                                newTask.trigger.config.emailConfig?.username ??
                                ""
                              }
                              onChange={(e) =>
                                setNewTask({
                                  ...newTask,
                                  trigger: {
                                    ...(newTask.trigger as TaskTrigger),
                                    config: {
                                      ...(newTask.trigger?.config ?? {}),
                                      emailConfig: {
                                        ...(newTask.trigger?.config
                                          .emailConfig ?? {
                                          provider: "gmail",
                                          useSSL: true,
                                          monitorFolder: "INBOX",
                                        }),
                                        username: e.target.value,
                                      } as EmailConfig,
                                    },
                                  },
                                })
                              }
                            />
                          </div>
                          <div>
                            <Label>Contraseña/App Password</Label>
                            <Input
                              type="password"
                              placeholder="contraseña o app password"
                              value={
                                newTask.trigger.config.emailConfig?.password ??
                                ""
                              }
                              onChange={(e) =>
                                setNewTask({
                                  ...newTask,
                                  trigger: {
                                    ...(newTask.trigger as TaskTrigger),
                                    config: {
                                      ...(newTask.trigger?.config ?? {}),
                                      emailConfig: {
                                        ...(newTask.trigger?.config
                                          .emailConfig ?? {
                                          provider: "gmail",
                                          useSSL: true,
                                          monitorFolder: "INBOX",
                                        }),
                                        password: e.target.value,
                                      } as EmailConfig,
                                    },
                                  },
                                })
                              }
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Carpeta a Monitorear</Label>
                            <Input
                              placeholder="INBOX"
                              value={
                                newTask.trigger.config.emailConfig
                                  ?.monitorFolder ?? "INBOX"
                              }
                              onChange={(e) =>
                                setNewTask({
                                  ...newTask,
                                  trigger: {
                                    ...(newTask.trigger as TaskTrigger),
                                    config: {
                                      ...(newTask.trigger?.config ?? {}),
                                      emailConfig: {
                                        ...(newTask.trigger?.config
                                          .emailConfig ?? {
                                          provider: "gmail",
                                          useSSL: true,
                                        }),
                                        monitorFolder: e.target.value,
                                      } as EmailConfig,
                                    },
                                  },
                                })
                              }
                            />
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch
                              checked={
                                newTask.trigger.config.emailConfig?.useSSL ??
                                true
                              }
                              onCheckedChange={(checked) =>
                                setNewTask({
                                  ...newTask,
                                  trigger: {
                                    ...(newTask.trigger as TaskTrigger),
                                    config: {
                                      ...(newTask.trigger?.config ?? {}),
                                      emailConfig: {
                                        ...(newTask.trigger?.config
                                          .emailConfig ?? {
                                          provider: "gmail",
                                          monitorFolder: "INBOX",
                                        }),
                                        useSSL: checked,
                                      } as EmailConfig,
                                    },
                                  },
                                })
                              }
                            />
                            <Label>Usar SSL/TLS</Label>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-lg">
                            Filtros de Email
                          </CardTitle>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={addEmailFilter}
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Agregar Filtro
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {(newTask.trigger.config.emailFilters ?? []).map(
                          (filter, index) => (
                            <div
                              key={`filter-${index}`}
                              className="grid grid-cols-4 gap-2 items-end"
                            >
                              <div>
                                <Label>Campo</Label>
                                <Select
                                  value={filter.field}
                                  onValueChange={(val) =>
                                    updateEmailFilter(
                                      index,
                                      "field",
                                      val as EmailFilterField
                                    )
                                  }
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecciona campo" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="from">
                                      De (From)
                                    </SelectItem>
                                    <SelectItem value="to">
                                      Para (To)
                                    </SelectItem>
                                    <SelectItem value="subject">
                                      Asunto
                                    </SelectItem>
                                    <SelectItem value="body">Cuerpo</SelectItem>
                                    <SelectItem value="attachment">
                                      Adjunto
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <Label>Operador</Label>
                                <Select
                                  value={filter.operator}
                                  onValueChange={(val) =>
                                    updateEmailFilter(
                                      index,
                                      "operator",
                                      val as EmailFilterOp
                                    )
                                  }
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecciona operador" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="contains">
                                      Contiene
                                    </SelectItem>
                                    <SelectItem value="equals">
                                      Igual a
                                    </SelectItem>
                                    <SelectItem value="starts_with">
                                      Empieza con
                                    </SelectItem>
                                    <SelectItem value="ends_with">
                                      Termina con
                                    </SelectItem>
                                    <SelectItem value="regex">Regex</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <Label>Valor</Label>
                                <Input
                                  placeholder="ej: soporte"
                                  value={filter.value}
                                  onChange={(e) =>
                                    updateEmailFilter(
                                      index,
                                      "value",
                                      e.target.value
                                    )
                                  }
                                />
                              </div>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => removeEmailFilter(index)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          )
                        )}
                      </CardContent>
                    </Card>
                  </div>
                )}

                {newTask.trigger?.type === "scheduled_email_blast" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="schedule-time">Hora de Envío</Label>
                        <Input
                          id="schedule-time"
                          type="time"
                          value={newTask.trigger.config.scheduledTime ?? ""}
                          onChange={(e) =>
                            setNewTask({
                              ...newTask,
                              trigger: {
                                ...(newTask.trigger as TaskTrigger),
                                config: {
                                  ...(newTask.trigger?.config ?? {}),
                                  scheduledTime: e.target.value,
                                },
                              },
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="timezone">Zona Horaria</Label>
                        <Select
                          value={
                            newTask.trigger.config.timezone ??
                            "America/Mexico_City"
                          }
                          onValueChange={(val) =>
                            setNewTask({
                              ...newTask,
                              trigger: {
                                ...(newTask.trigger as TaskTrigger),
                                config: {
                                  ...(newTask.trigger?.config ?? {}),
                                  timezone: val,
                                },
                              },
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona zona horaria" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="America/Mexico_City">
                              Ciudad de México
                            </SelectItem>
                            <SelectItem value="America/New_York">
                              Nueva York
                            </SelectItem>
                            <SelectItem value="America/Los_Angeles">
                              Los Ángeles
                            </SelectItem>
                            <SelectItem value="Europe/Madrid">
                              Madrid
                            </SelectItem>
                            <SelectItem value="Europe/London">
                              Londres
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="schedule-cron">Programación (Cron)</Label>
                      <Input
                        id="schedule-cron"
                        placeholder="0 9 * * 1 (Lunes a las 9 AM)"
                        value={String(newTask.trigger.config.schedule ?? "")}
                        onChange={(e) =>
                          setNewTask({
                            ...newTask,
                            trigger: {
                              ...(newTask.trigger as TaskTrigger),
                              config: {
                                ...(newTask.trigger?.config ?? {}),
                                schedule: e.target.value,
                              },
                            },
                          })
                        }
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        {
                          "Formato: minuto hora día mes día_semana (0=domingo, 1=lunes, etc.)"
                        }
                      </p>
                    </div>
                  </div>
                )}
              </TabsContent>

              {/* Condiciones */}
              <TabsContent value="conditions" className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label>Condiciones para Activar la Tarea</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addCondition}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar Condición
                  </Button>
                </div>

                {(newTask.conditions ?? []).map((condition, index) => (
                  <Card key={`cond-${index}`}>
                    <CardContent className="pt-4">
                      <div className="grid grid-cols-4 gap-2 items-end">
                        <div>
                          <Label>Campo</Label>
                          <Input
                            placeholder="ej: email_subject"
                            value={condition.field}
                            onChange={(e) =>
                              updateCondition(index, "field", e.target.value)
                            }
                          />
                        </div>
                        <div>
                          <Label>Operador</Label>
                          <Select
                            value={condition.operator}
                            onValueChange={(val) =>
                              updateCondition(
                                index,
                                "operator",
                                val as typeof condition.operator
                              )
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona operador" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="equals">Igual a</SelectItem>
                              <SelectItem value="contains">Contiene</SelectItem>
                              <SelectItem value="greater_than">
                                Mayor que
                              </SelectItem>
                              <SelectItem value="less_than">
                                Menor que
                              </SelectItem>
                              <SelectItem value="regex">Regex</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Valor</Label>
                          <Input
                            placeholder="ej: urgente"
                            value={condition.value}
                            onChange={(e) =>
                              updateCondition(index, "value", e.target.value)
                            }
                          />
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeCondition(index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              {/* Acciones */}
              <TabsContent value="actions" className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label>Acciones a Ejecutar</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addAction}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar Acción
                  </Button>
                </div>

                {(newTask.actions ?? []).map((action) => (
                  <Card key={action.id}>
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-sm">Acción</CardTitle>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const index = (newTask.actions ?? []).findIndex(
                              (a) => a.id === action.id
                            );
                            if (index >= 0) removeAction(index);
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label>Nombre de la Acción</Label>
                          <Input
                            placeholder="ej: Responder automáticamente"
                            value={action.name}
                            onChange={(e) => {
                              const idx = (newTask.actions ?? []).findIndex(
                                (a) => a.id === action.id
                              );
                              updateAction(idx, "name", e.target.value);
                            }}
                          />
                        </div>
                        <div>
                          <Label>Tipo de Acción</Label>
                          <Select
                            value={action.type}
                            onValueChange={(val) => {
                              const idx = (newTask.actions ?? []).findIndex(
                                (a) => a.id === action.id
                              );
                              updateAction(idx, "type", val as TaskActionType);
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona tipo" />
                            </SelectTrigger>
                            <SelectContent>
                              {actionTypes.map((t) => (
                                <SelectItem key={t.value} value={t.value}>
                                  <div>
                                    <div className="font-medium">{t.label}</div>
                                    <div className="text-xs text-muted-foreground">
                                      {t.description}
                                    </div>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {action.type === "email_reply" && (
                        <div className="space-y-3">
                          <div>
                            <Label>Asunto de la Respuesta</Label>
                            <Input
                              placeholder="Re: {{original_subject}}"
                              value={action.config.emailSubject ?? ""}
                              onChange={(e) => {
                                const idx = (newTask.actions ?? []).findIndex(
                                  (a) => a.id === action.id
                                );
                                updateAction(idx, "config", {
                                  emailSubject: e.target.value,
                                });
                              }}
                            />
                          </div>
                          <div>
                            <Label>Cuerpo de la Respuesta</Label>
                            <Textarea
                              placeholder="Hola {{sender_name}}, gracias por tu email..."
                              value={action.config.emailBody ?? ""}
                              onChange={(e) => {
                                const idx = (newTask.actions ?? []).findIndex(
                                  (a) => a.id === action.id
                                );
                                updateAction(idx, "config", {
                                  emailBody: e.target.value,
                                });
                              }}
                              rows={4}
                            />
                          </div>
                        </div>
                      )}

                      {action.type === "email_send" && (
                        <div className="space-y-3">
                          <div>
                            <Label>Destinatarios (separados por coma)</Label>
                            <Input
                              placeholder="admin@empresa.com, soporte@empresa.com"
                              value={action.config.emailTo ?? ""}
                              onChange={(e) => {
                                const idx = (newTask.actions ?? []).findIndex(
                                  (a) => a.id === action.id
                                );
                                updateAction(idx, "config", {
                                  emailTo: e.target.value,
                                });
                              }}
                            />
                          </div>
                          <div>
                            <Label>Asunto</Label>
                            <Input
                              placeholder="🚨 Alerta: {{alert_type}}"
                              value={action.config.emailSubject ?? ""}
                              onChange={(e) => {
                                const idx = (newTask.actions ?? []).findIndex(
                                  (a) => a.id === action.id
                                );
                                updateAction(idx, "config", {
                                  emailSubject: e.target.value,
                                });
                              }}
                            />
                          </div>
                          <div>
                            <Label>Cuerpo del Email</Label>
                            <Textarea
                              placeholder="Se ha detectado un problema: {{problem_description}}"
                              value={action.config.emailBody ?? ""}
                              onChange={(e) => {
                                const idx = (newTask.actions ?? []).findIndex(
                                  (a) => a.id === action.id
                                );
                                updateAction(idx, "config", {
                                  emailBody: e.target.value,
                                });
                              }}
                              rows={4}
                            />
                          </div>
                        </div>
                      )}

                      {action.type === "email_forward" && (
                        <div className="space-y-3">
                          <div>
                            <Label>Reenviar a</Label>
                            <Input
                              placeholder="supervisor@empresa.com"
                              value={action.config.forwardTo ?? ""}
                              onChange={(e) => {
                                const idx = (newTask.actions ?? []).findIndex(
                                  (a) => a.id === action.id
                                );
                                updateAction(idx, "config", {
                                  forwardTo: e.target.value,
                                });
                              }}
                            />
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch
                              checked={action.config.attachOriginal ?? false}
                              onCheckedChange={(checked) => {
                                const idx = (newTask.actions ?? []).findIndex(
                                  (a) => a.id === action.id
                                );
                                updateAction(idx, "config", {
                                  attachOriginal: checked,
                                });
                              }}
                            />
                            <Label>Adjuntar email original</Label>
                          </div>
                        </div>
                      )}

                      {action.type === "command" && (
                        <div>
                          <Label>Comando a Ejecutar</Label>
                          <Textarea
                            placeholder={
                              "#!/bin/bash\n" +
                              "echo 'Ejecutando script personalizado'\n" +
                              "# Tu código aquí"
                            }
                            value={action.config.command ?? ""}
                            onChange={(e) => {
                              const idx = (newTask.actions ?? []).findIndex(
                                (a) => a.id === action.id
                              );
                              updateAction(idx, "config", {
                                command: e.target.value,
                              });
                            }}
                            rows={2}
                          />
                        </div>
                      )}

                      {action.type === "script" && (
                        <div>
                          <Label>Script/Código</Label>
                          <Textarea
                            placeholder={
                              "#!/bin/bash\n" +
                              "echo 'Ejecutando script personalizado'\n" +
                              "# Tu código aquí"
                            }
                            value={action.config.script ?? ""}
                            onChange={(e) => {
                              const idx = (newTask.actions ?? []).findIndex(
                                (a) => a.id === action.id
                              );
                              updateAction(idx, "config", {
                                script: e.target.value,
                              });
                            }}
                            rows={4}
                          />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}

                {/* UI adicional para email_blast, una sección por acción */}
                {(newTask.actions ?? []).map((action, mainIndex) => (
                  <React.Fragment key={`blast-${action.id}`}>
                    {action.type === "email_blast" &&
                      action.config.campaign && (
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <Label>Delay entre Emails (segundos)</Label>
                              <Input
                                type="number"
                                placeholder="30"
                                value={String(
                                  action.config.delayBetweenEmails ?? ""
                                )}
                                onChange={(e) =>
                                  updateAction(mainIndex, "config", {
                                    delayBetweenEmails: Number.isNaN(
                                      parseInt(e.target.value)
                                    )
                                      ? 0
                                      : parseInt(e.target.value),
                                  })
                                }
                              />
                            </div>
                            <div className="flex items-center space-x-2">
                              <Switch
                                checked={action.config.trackOpens ?? false}
                                onCheckedChange={(checked) =>
                                  updateAction(mainIndex, "config", {
                                    trackOpens: checked,
                                  })
                                }
                              />
                              <Label>Rastrear Aperturas</Label>
                            </div>
                          </div>

                          <Card>
                            <CardHeader>
                              <div className="flex justify-between items-center">
                                <CardTitle className="text-lg">
                                  Lista de Clientes
                                </CardTitle>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => addClient(mainIndex)}
                                >
                                  <Plus className="w-4 h-4 mr-2" />
                                  Agregar Cliente
                                </Button>
                              </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              {(action.config.campaign.clients ?? []).map(
                                (client, clientIndex) => (
                                  <Card key={client.id}>
                                    <CardHeader className="pb-3">
                                      <div className="flex justify-between items-center">
                                        <CardTitle className="text-sm">{`Cliente ${
                                          clientIndex + 1
                                        }`}</CardTitle>
                                        <Button
                                          type="button"
                                          variant="outline"
                                          size="sm"
                                          onClick={() =>
                                            removeClient(mainIndex, clientIndex)
                                          }
                                        >
                                          <Trash2 className="w-4 h-4" />
                                        </Button>
                                      </div>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                      <div className="grid grid-cols-3 gap-3">
                                        <div>
                                          <Label>Nombre</Label>
                                          <Input
                                            placeholder="Juan Pérez"
                                            value={client.name}
                                            onChange={(e) =>
                                              updateClient(
                                                mainIndex,
                                                clientIndex,
                                                "name",
                                                e.target.value
                                              )
                                            }
                                          />
                                        </div>
                                        <div>
                                          <Label>Email</Label>
                                          <Input
                                            placeholder="juan@empresa.com"
                                            value={client.email}
                                            onChange={(e) =>
                                              updateClient(
                                                mainIndex,
                                                clientIndex,
                                                "email",
                                                e.target.value
                                              )
                                            }
                                          />
                                        </div>
                                        <div>
                                          <Label>Empresa</Label>
                                          <Input
                                            placeholder="Empresa ABC"
                                            value={client.company ?? ""}
                                            onChange={(e) =>
                                              updateClient(
                                                mainIndex,
                                                clientIndex,
                                                "company",
                                                e.target.value
                                              )
                                            }
                                          />
                                        </div>
                                      </div>

                                      <div>
                                        <Label>Tags (separados por coma)</Label>
                                        <Input
                                          placeholder="premium, desarrollo, cliente_vip"
                                          value={(client.tags ?? []).join(", ")}
                                          onChange={(e) =>
                                            updateClient(
                                              mainIndex,
                                              clientIndex,
                                              "tags",
                                              e.target
                                                .value as unknown as Client["tags"]
                                            )
                                          }
                                        />
                                      </div>

                                      <div>
                                        <Label>Campos Personalizados</Label>
                                        <div className="space-y-2">
                                          {Object.entries(
                                            client.customFields ?? {}
                                          ).map(([key, value]) => (
                                            <div
                                              key={`${client.id}-${key}`}
                                              className="flex gap-2"
                                            >
                                              <Input
                                                value={key}
                                                readOnly
                                                className="flex-1"
                                              />
                                              <Input
                                                value={value}
                                                onChange={(e) =>
                                                  addCustomField(
                                                    mainIndex,
                                                    clientIndex,
                                                    key,
                                                    e.target.value
                                                  )
                                                }
                                                className="flex-1"
                                              />
                                              <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                  const newFields = {
                                                    ...(client.customFields ??
                                                      {}),
                                                  };
                                                  delete newFields[key];
                                                  updateClient(
                                                    mainIndex,
                                                    clientIndex,
                                                    "customFields",
                                                    newFields
                                                  );
                                                }}
                                              >
                                                <Trash2 className="w-4 h-4" />
                                              </Button>
                                            </div>
                                          ))}
                                          <div className="flex gap-2">
                                            <Input
                                              placeholder="campo"
                                              id={`new-field-key-${mainIndex}-${clientIndex}`}
                                            />
                                            <Input
                                              placeholder="valor"
                                              id={`new-field-value-${mainIndex}-${clientIndex}`}
                                            />
                                            <Button
                                              type="button"
                                              onClick={() => {
                                                const keyInput =
                                                  document.getElementById(
                                                    `new-field-key-${mainIndex}-${clientIndex}`
                                                  ) as HTMLInputElement | null;
                                                const valueInput =
                                                  document.getElementById(
                                                    `new-field-value-${mainIndex}-${clientIndex}`
                                                  ) as HTMLInputElement | null;
                                                if (
                                                  keyInput?.value &&
                                                  valueInput?.value
                                                ) {
                                                  addCustomField(
                                                    mainIndex,
                                                    clientIndex,
                                                    keyInput.value,
                                                    valueInput.value
                                                  );
                                                  keyInput.value = "";
                                                  valueInput.value = "";
                                                }
                                              }}
                                            >
                                              <Plus className="w-4 h-4" />
                                            </Button>
                                          </div>
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                )
                              )}
                            </CardContent>
                          </Card>

                          <Card>
                            <CardHeader>
                              <CardTitle className="text-lg">
                                Plantilla del Email
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                              <div>
                                <Label>Asunto del Email</Label>
                                <Input
                                  placeholder="Actualización de tu proyecto {{proyecto}} - {{company}}"
                                  value={
                                    action.config.campaign?.template.subject ??
                                    ""
                                  }
                                  onChange={(e) => {
                                    const actions = [
                                      ...(newTask.actions ?? []),
                                    ];
                                    if (actions[mainIndex]?.config.campaign) {
                                      actions[
                                        mainIndex
                                      ].config.campaign!.template = {
                                        ...(actions[mainIndex].config.campaign!
                                          .template ?? defaultEmailTemplate()),
                                        subject: e.target.value,
                                      };
                                      setNewTask({ ...newTask, actions });
                                    }
                                  }}
                                />
                              </div>
                              <div>
                                <Label>Cuerpo del Email</Label>
                                <Textarea
                                  placeholder="Hola {{name}}, espero que tengas una excelente semana..."
                                  value={
                                    action.config.campaign?.template.body ?? ""
                                  }
                                  onChange={(e) => {
                                    const actions = [
                                      ...(newTask.actions ?? []),
                                    ];
                                    if (actions[mainIndex]?.config.campaign) {
                                      actions[
                                        mainIndex
                                      ].config.campaign!.template = {
                                        ...(actions[mainIndex].config.campaign!
                                          .template ?? defaultEmailTemplate()),
                                        body: e.target.value,
                                      };
                                      setNewTask({ ...newTask, actions });
                                    }
                                  }}
                                  rows={8}
                                />
                              </div>
                            </CardContent>
                          </Card>

                          <div className="flex items-center space-x-2">
                            <Switch
                              checked={
                                action.config.campaign?.autoReplyEnabled ??
                                false
                              }
                              onCheckedChange={(checked) => {
                                const actions = [...(newTask.actions ?? [])];
                                if (actions[mainIndex]?.config.campaign) {
                                  actions[
                                    mainIndex
                                  ].config.campaign!.autoReplyEnabled = checked;
                                  setNewTask({ ...newTask, actions });
                                }
                              }}
                            />
                            <Label>Habilitar Respuesta Automática</Label>
                          </div>

                          {action.config.campaign?.autoReplyEnabled && (
                            <Card>
                              <CardHeader>
                                <CardTitle className="text-lg">
                                  Plantilla de Respuesta Automática
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-3">
                                <div>
                                  <Label>Asunto de la Respuesta</Label>
                                  <Input
                                    placeholder="Re: {{original_subject}}"
                                    value={
                                      action.config.campaign?.autoReplyTemplate
                                        ?.subject ?? ""
                                    }
                                    onChange={(e) => {
                                      const actions = [
                                        ...(newTask.actions ?? []),
                                      ];
                                      if (actions[mainIndex]?.config.campaign) {
                                        const tpl =
                                          actions[mainIndex].config.campaign!
                                            .autoReplyTemplate ??
                                          defaultEmailTemplate();
                                        actions[
                                          mainIndex
                                        ].config.campaign!.autoReplyTemplate = {
                                          ...tpl,
                                          subject: e.target.value,
                                        };
                                        setNewTask({ ...newTask, actions });
                                      }
                                    }}
                                  />
                                </div>
                                <div>
                                  <Label>Cuerpo de la Respuesta</Label>
                                  <Textarea
                                    placeholder="Hola {{name}}, gracias por tu respuesta sobre {{proyecto}}..."
                                    value={
                                      action.config.campaign?.autoReplyTemplate
                                        ?.body ?? ""
                                    }
                                    onChange={(e) => {
                                      const actions = [
                                        ...(newTask.actions ?? []),
                                      ];
                                      if (actions[mainIndex]?.config.campaign) {
                                        const tpl =
                                          actions[mainIndex].config.campaign!
                                            .autoReplyTemplate ??
                                          defaultEmailTemplate();
                                        actions[
                                          mainIndex
                                        ].config.campaign!.autoReplyTemplate = {
                                          ...tpl,
                                          body: e.target.value,
                                        };
                                        setNewTask({ ...newTask, actions });
                                      }
                                    }}
                                    rows={6}
                                  />
                                </div>
                              </CardContent>
                            </Card>
                          )}
                        </div>
                      )}
                  </React.Fragment>
                ))}
              </TabsContent>

              {/* Email templates sueltos */}
              <TabsContent value="email" className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label>Plantillas de Email</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addEmailTemplate}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar Plantilla
                  </Button>
                </div>

                {(newTask.emailTemplates ?? []).map((template) => (
                  <Card key={template.id}>
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-sm">Plantilla</CardTitle>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const idx = (
                              newTask.emailTemplates ?? []
                            ).findIndex((t) => t.id === template.id);
                            if (idx >= 0) removeEmailTemplate(idx);
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <Label>Nombre de la Plantilla</Label>
                        <Input
                          placeholder="ej: Plantilla de Soporte"
                          value={template.name}
                          onChange={(e) => {
                            const idx = (
                              newTask.emailTemplates ?? []
                            ).findIndex((t) => t.id === template.id);
                            updateEmailTemplate(idx, "name", e.target.value);
                          }}
                        />
                      </div>
                      <div>
                        <Label>Asunto</Label>
                        <Input
                          placeholder="Re: {{original_subject}} - Respuesta Automática"
                          value={template.subject}
                          onChange={(e) => {
                            const idx = (
                              newTask.emailTemplates ?? []
                            ).findIndex((t) => t.id === template.id);
                            updateEmailTemplate(idx, "subject", e.target.value);
                          }}
                        />
                      </div>
                      <div>
                        <Label>Cuerpo del Email</Label>
                        <Textarea
                          placeholder={
                            "Hola {{sender_name}},\n\nGracias por contactarnos..."
                          }
                          value={template.body}
                          onChange={(e) => {
                            const idx = (
                              newTask.emailTemplates ?? []
                            ).findIndex((t) => t.id === template.id);
                            updateEmailTemplate(idx, "body", e.target.value);
                          }}
                          rows={6}
                        />
                      </div>
                      <div>
                        <Label>
                          {"Variables Disponibles (separadas por coma)"}
                        </Label>
                        <Input
                          placeholder="sender_name, original_subject, ai_analysis"
                          value={(template.variables ?? []).join(", ")}
                          onChange={(e) => {
                            const idx = (
                              newTask.emailTemplates ?? []
                            ).findIndex((t) => t.id === template.id);
                            updateEmailTemplate(
                              idx,
                              "variables",
                              e.target.value
                                .split(",")
                                .map((v) => v.trim())
                                .filter(Boolean)
                            );
                          }}
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              {/* Variables */}
              <TabsContent value="variables" className="space-y-4">
                <div>
                  <Label>Variables Personalizadas</Label>
                  <p className="text-sm text-muted-foreground mb-3">
                    {
                      "Define variables que puedes usar en tus comandos, emails y acciones usando {{variable_name}}"
                    }
                  </p>
                </div>

                <div className="space-y-2">
                  {Object.entries(newTask.variables ?? {}).map(([k, v]) => (
                    <div key={`var-${k}`} className="flex gap-2">
                      <Input value={k} readOnly className="flex-1" />
                      <Input
                        value={v}
                        onChange={(e) => addVariable(k, e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeVariable(k)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Input placeholder="nombre_variable" id="new-var-key" />
                  <Input placeholder="valor" id="new-var-value" />
                  <Button
                    type="button"
                    onClick={() => {
                      const keyInput = document.getElementById(
                        "new-var-key"
                      ) as HTMLInputElement | null;
                      const valueInput = document.getElementById(
                        "new-var-value"
                      ) as HTMLInputElement | null;
                      if (keyInput?.value && valueInput?.value) {
                        addVariable(keyInput.value, valueInput.value);
                        keyInput.value = "";
                        valueInput.value = "";
                      }
                    }}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                <div className="mt-6">
                  <Label className="text-sm font-medium">
                    Variables Comunes para Email Marketing:
                  </Label>
                  <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                    <div className="p-2 bg-muted rounded">
                      <code>{"{{name}}"}</code> - Nombre del cliente
                    </div>
                    <div className="p-2 bg-muted rounded">
                      <code>{"{{email}}"}</code> - Email del cliente
                    </div>
                    <div className="p-2 bg-muted rounded">
                      <code>{"{{company}}"}</code> - Empresa del cliente
                    </div>
                    <div className="p-2 bg-muted rounded">
                      <code>{"{{proyecto}}"}</code> - Campo personalizado
                    </div>
                    <div className="p-2 bg-muted rounded">
                      <code>{"{{estado}}"}</code> - Campo personalizado
                    </div>
                    <div className="p-2 bg-muted rounded">
                      <code>{"{{ai_personalized_content}}"}</code> - Contenido
                      generado por IA
                    </div>
                    <div className="p-2 bg-muted rounded">
                      <code>{"{{timestamp}}"}</code> - Fecha y hora actual
                    </div>
                    <div className="p-2 bg-muted rounded">
                      <code>{"{{original_subject}}"}</code> - Asunto original
                      (respuestas)
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSaveTask} disabled={loading}>
                {editingTask ? "Actualizar" : "Crear"} Tarea
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Listado de tareas */}
      <div className="grid gap-6">
        {tasks.map((task) => {
          const categoryInfo = getCategoryInfo(task.category);
          const Icon = categoryInfo.icon;
          return (
            <Card key={task.id} className="relative">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${categoryInfo.color}`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{task.name}</CardTitle>
                      <CardDescription className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline">{categoryInfo.label}</Badge>
                        <div
                          className={`w-2 h-2 rounded-full ${
                            task.status === "active"
                              ? "bg-green-500"
                              : task.status === "error"
                              ? "bg-red-500"
                              : "bg-gray-500"
                          }`}
                        />
                        <span className="text-xs capitalize">
                          {task.status}
                        </span>
                        <span className="text-xs">
                          • {task.runCount ?? 0} ejecuciones
                        </span>
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleStatus(task.id)}
                    >
                      {task.status === "active" ? (
                        <Pause className="w-4 h-4" />
                      ) : (
                        <Play className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setEditingTask(task);
                        // Clonar para evitar mutar referencia original al editar
                        setNewTask(
                          JSON.parse(JSON.stringify(task)) as AdvancedTask
                        );
                        setIsDialogOpen(true);
                      }}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteTask(task.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-4">
                  {task.description && (
                    <p className="text-sm text-muted-foreground">
                      {task.description}
                    </p>
                  )}

                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="prompt">
                      <AccordionTrigger className="text-sm">
                        <div className="flex items-center">
                          <Code className="w-4 h-4 mr-2" />
                          Contexto del Bot
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="bg-muted p-3 rounded-md text-sm">
                          {task.prompt}
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="trigger">
                      <AccordionTrigger className="text-sm">
                        <div className="flex items-center">
                          <Webhook className="w-4 h-4 mr-2" />
                          {"Trigger: "}
                          {
                            triggerTypes.find(
                              (t) => t.value === task?.trigger?.type
                            )?.label
                          }
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2 text-sm">
                          {task?.trigger?.type === "email_received" &&
                            task?.trigger?.config?.emailConfig && (
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span className="font-medium">
                                    Proveedor:
                                  </span>
                                  <span className="text-muted-foreground">
                                    {task.trigger.config.emailConfig.provider}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="font-medium">Usuario:</span>
                                  <span className="text-muted-foreground">
                                    {task.trigger.config.emailConfig.username}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="font-medium">Carpeta:</span>
                                  <span className="text-muted-foreground">
                                    {
                                      task.trigger.config.emailConfig
                                        .monitorFolder
                                    }
                                  </span>
                                </div>

                                {task.trigger.config.emailFilters &&
                                  task.trigger.config.emailFilters.length >
                                    0 && (
                                    <div>
                                      <span className="font-medium">
                                        Filtros:
                                      </span>
                                      <div className="mt-1 space-y-1">
                                        {task.trigger.config.emailFilters.map(
                                          (filter, index) => (
                                            <div
                                              key={`${filter.field}-${index}`}
                                              className="text-xs bg-muted p-2 rounded"
                                            >
                                              {filter.field} {filter.operator} "
                                              {filter.value}"
                                            </div>
                                          )
                                        )}
                                      </div>
                                    </div>
                                  )}
                              </div>
                            )}

                          {Object.entries(task?.trigger?.config ?? {})
                            .filter(
                              ([key]) =>
                                !["emailConfig", "emailFilters"].includes(key)
                            )
                            .map(([k, v]) => (
                              <div
                                key={`tconf-${task.id}-${k}`}
                                className="flex justify-between"
                              >
                                <span className="font-medium">{k}:</span>
                                <span className="text-muted-foreground">
                                  {String(v)}
                                </span>
                              </div>
                            ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="actions">
                      <AccordionTrigger className="text-sm">
                        <div className="flex items-center">
                          <Terminal className="w-4 h-4 mr-2" />
                          {`Acciones (${task.actions?.length ?? 0})`}
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-3">
                          {(task.actions ?? []).map((action) => {
                            const actionType = actionTypes.find(
                              (t) => t.value === action.type
                            );
                            const getActionIcon = () => {
                              switch (action.type) {
                                case "email_reply":
                                  return Reply;
                                case "email_send":
                                  return Send;
                                case "email_forward":
                                  return Forward;
                                case "email_blast":
                                  return Mail;
                                default:
                                  return Terminal;
                              }
                            };
                            const ActionIcon = getActionIcon();

                            return (
                              <div
                                key={action.id}
                                className="border rounded-md p-3"
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center space-x-2">
                                    <ActionIcon className="w-4 h-4" />
                                    <span className="font-medium text-sm">
                                      {action.name || "(Sin nombre)"}
                                    </span>
                                  </div>
                                  <Badge variant="secondary">
                                    {actionType?.label}
                                  </Badge>
                                </div>

                                {action.type === "email_blast" &&
                                  action.config.campaign && (
                                    <div className="space-y-2">
                                      <div className="grid grid-cols-2 gap-4 text-xs">
                                        <div>
                                          <strong>Clientes:</strong>{" "}
                                          {
                                            action.config.campaign.clients
                                              .length
                                          }
                                        </div>
                                        <div>
                                          <strong>Enviados:</strong>{" "}
                                          {action.config.campaign.sentCount}
                                        </div>
                                        <div>
                                          <strong>Respuestas:</strong>{" "}
                                          {action.config.campaign.responseCount}
                                        </div>
                                        <div>
                                          <strong>Estado:</strong>
                                          <Badge
                                            variant={
                                              action.config.campaign.status ===
                                              "sent"
                                                ? "default"
                                                : "secondary"
                                            }
                                            className="ml-1"
                                          >
                                            {action.config.campaign.status}
                                          </Badge>
                                        </div>
                                      </div>

                                      <div className="text-xs">
                                        <strong>Asunto:</strong>{" "}
                                        {
                                          action.config.campaign.template
                                            .subject
                                        }
                                      </div>

                                      <details className="text-xs">
                                        <summary className="cursor-pointer font-medium">
                                          {`Ver clientes (${action.config.campaign.clients.length})`}
                                        </summary>
                                        <div className="mt-2 space-y-1 max-h-32 overflow-y-auto">
                                          {action.config.campaign.clients.map(
                                            (client) => (
                                              <div
                                                key={client.id}
                                                className="flex justify-between p-1 bg-muted rounded"
                                              >
                                                <span>{client.name}</span>
                                                <span className="text-muted-foreground">
                                                  {client.email}
                                                </span>
                                                {client.responseReceived && (
                                                  <Badge
                                                    variant="outline"
                                                    className="text-xs"
                                                  >
                                                    Respondió
                                                  </Badge>
                                                )}
                                              </div>
                                            )
                                          )}
                                        </div>
                                      </details>

                                      {action.config.campaign
                                        .autoReplyEnabled && (
                                        <div className="text-xs text-green-600">
                                          {"✓ Respuesta automática habilitada"}
                                        </div>
                                      )}
                                    </div>
                                  )}

                                {action.config.emailSubject && (
                                  <div className="text-xs text-muted-foreground mb-1">
                                    <strong>Asunto:</strong>{" "}
                                    {action.config.emailSubject}
                                  </div>
                                )}

                                {action.config.emailBody && (
                                  <code className="text-xs bg-muted p-2 rounded block whitespace-pre-wrap">
                                    {action.config.emailBody.slice(0, 200)}
                                    {(action.config.emailBody?.length ?? 0) >
                                    200
                                      ? "..."
                                      : ""}
                                  </code>
                                )}

                                {action.config.command && (
                                  <code className="text-xs bg-muted p-2 rounded block">
                                    {action.config.command}
                                  </code>
                                )}

                                {action.config.script && (
                                  <code className="text-xs bg-muted p-2 rounded block whitespace-pre-wrap">
                                    {action.config.script.slice(0, 200)}
                                    {(action.config.script?.length ?? 0) > 200
                                      ? "..."
                                      : ""}
                                  </code>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    {task.emailTemplates && task.emailTemplates.length > 0 && (
                      <AccordionItem value="email-templates">
                        <AccordionTrigger className="text-sm">
                          <div className="flex items-center">
                            <Mail className="w-4 h-4 mr-2" />
                            {`Plantillas de Email (${task.emailTemplates.length})`}
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-3">
                            {task.emailTemplates.map((template) => (
                              <div
                                key={`${task.id}-${template.id}`}
                                className="border rounded-md p-3"
                              >
                                <div className="font-medium text-sm mb-2">
                                  {template.name}
                                </div>
                                <div className="text-xs text-muted-foreground mb-1">
                                  <strong>Asunto:</strong> {template.subject}
                                </div>
                                <code className="text-xs bg-muted p-2 rounded block whitespace-pre-wrap">
                                  {template.body.slice(0, 150)}
                                  {(template.body?.length ?? 0) > 150
                                    ? "..."
                                    : ""}
                                </code>
                                {(template.variables?.length ?? 0) > 0 && (
                                  <div className="mt-2 text-xs">
                                    <strong>Variables:</strong>{" "}
                                    {(template.variables ?? []).join(", ")}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    )}

                    {task.variables &&
                      Object.keys(task.variables).length > 0 && (
                        <AccordionItem value="variables">
                          <AccordionTrigger className="text-sm">
                            <div className="flex items-center">
                              <Zap className="w-4 h-4 mr-2" />
                              {`Variables (${
                                Object.keys(task.variables).length
                              })`}
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              {Object.entries(task.variables).map(
                                ([varKey, value]) => (
                                  <div
                                    key={`${task.id}-${varKey}`}
                                    className="flex justify-between p-2 bg-muted rounded"
                                  >
                                    <span className="font-medium">{`{{${varKey}}}`}</span>
                                    <span className="text-muted-foreground">
                                      {String(value)}
                                    </span>
                                  </div>
                                )
                              )}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      )}
                  </Accordion>

                  {task.lastRun && (
                    <div className="text-xs text-muted-foreground">{`Última ejecución: ${task.lastRun}`}</div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}

        {tasks.length === 0 && !loading && (
          <Card className="text-center py-12">
            <CardContent>
              <Mail className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">
                No hay tareas configuradas
              </h3>
              <p className="text-muted-foreground mb-4">
                {
                  "Crea tu primera tarea automatizada con gestión de emails, triggers y acciones personalizadas"
                }
              </p>
              <Button
                onClick={() => {
                  setEditingTask(null);
                  setNewTask(resetNewTask());
                  setIsDialogOpen(true);
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Crear Primera Tarea
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
