import { create } from "zustand";

export interface Server {
  id: string;
  name: string;
  ip: string;
  status: "running" | "stopped" | "maintenance";
  cpu: number;
  memory: number;
  storage: number;
  region: string;
  uptime: string;
  lastUpdate: string;
  os: string;
  cores: number;
  ram: string;
  price: number;
}

export const MOCK_SERVERS: Server[] = [
  {
    id: "1",
    name: "Server Principal",
    ip: "192.168.1.100",
    status: "running",
    cpu: 45,
    memory: 72,
    storage: 85,
    region: "us-east-1",
    uptime: "45 días, 12 horas",
    lastUpdate: "hace 2 minutos",
    os: "Ubuntu 22.04 LTS",
    cores: 8,
    ram: "32GB",
    price: 299.99,
  },
  {
    id: "2",
    name: "Server Backup",
    ip: "192.168.1.101",
    status: "running",
    cpu: 12,
    memory: 38,
    storage: 42,
    region: "us-west-2",
    uptime: "62 días, 3 horas",
    lastUpdate: "hace 1 minuto",
    os: "CentOS 8",
    cores: 4,
    ram: "16GB",
    price: 149.99,
  },
  {
    id: "3",
    name: "Server Desarrollo",
    ip: "192.168.1.102",
    status: "maintenance",
    cpu: 8,
    memory: 25,
    storage: 55,
    region: "eu-west-1",
    uptime: "5 días, 8 horas",
    lastUpdate: "hace 5 minutos",
    os: "Debian 11",
    cores: 2,
    ram: "8GB",
    price: 49.99,
  },
  {
    id: "4",
    name: "Server Producción",
    ip: "192.168.1.103",
    status: "running",
    cpu: 78,
    memory: 91,
    storage: 93,
    region: "us-east-1",
    uptime: "120 días, 5 horas",
    lastUpdate: "hace 30 segundos",
    os: "Ubuntu 20.04 LTS",
    cores: 16,
    ram: "64GB",
    price: 599.99,
  },
  {
    id: "5",
    name: "Server Cache",
    ip: "192.168.1.104",
    status: "stopped",
    cpu: 0,
    memory: 0,
    storage: 35,
    region: "ap-southeast-1",
    uptime: "offline",
    lastUpdate: "hace 2 horas",
    os: "Ubuntu 22.04 LTS",
    cores: 8,
    ram: "24GB",
    price: 249.99,
  },
];

interface ServerStore {
  servers: Server[];
  selectedServer: Server | null;
  setSelectedServer: (server: Server | null) => void;
  getServerById: (id: string) => Server | undefined;
}

export const useServerStore = create<ServerStore>((set, get) => ({
  servers: MOCK_SERVERS,
  selectedServer: MOCK_SERVERS[0],
  setSelectedServer: (server: Server | null) => set({ selectedServer: server }),
  getServerById: (id: string) => {
    const state = get();
    return state.servers.find((s) => s.id === id);
  },
}));
