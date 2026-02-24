export type Plan = {
  id: string;
  name: string;
  price: number;
  credits: number;
  tokens: number;
  monthlyConversations: number;
  dailyConversations: number;
  tokensPerConversation: number;
  costPerToken: number;
  features: string[];
  popular?: boolean;
};

export type Addon = {
  id: string;
  name: string;
  description: string;
  price: number;
  type: 'credits' | 'tokens';
  quantity: number;
};

export type CartItem = {
  id: string;
  type: 'plan' | 'addon';
  name: string;
  price: number;
  quantity: number;
  data: Plan | Addon;
};

export const plans: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    credits: 50,
    tokens: 50000,
    monthlyConversations: 200,
    dailyConversations: 7,
    tokensPerConversation: 0,
    costPerToken: 0,
    features: [
      'Chatbots IA habilitados',
      'WhatsApp QR (contactos propios)',
      '1 campaña activa',
      'Mensajes generados por IA'
    ]
  },
  {
    id: 'basico',
    name: 'Básico',
    price: 65,
    credits: 650,
    tokens: 10000000,
    monthlyConversations: 8000,
    dailyConversations: 260,
    tokensPerConversation: 1000,
    costPerToken: 0.00000650,
    features: [
      'Chatbots IA',
      'WhatsApp QR + Bulk',
      'Email campaigns',
      'Scraping (pago por uso)',
      'Automatizaciones avanzadas'
    ],
    popular: true
  },
  {
    id: 'estandar',
    name: 'Estándar',
    price: 100,
    credits: 1000,
    tokens: 23000000,
    monthlyConversations: 18000,
    dailyConversations: 600,
    tokensPerConversation: 1000,
    costPerToken: 0.00000430,
    features: [
      'Automatizaciones avanzadas',
      'WhatsApp + Email con IA',
      'Scraping Google Maps',
      'Enriquecimiento de leads'
    ]
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 595,
    credits: 5950,
    tokens: 140000000,
    monthlyConversations: 120000,
    dailyConversations: 4000,
    tokensPerConversation: 1000,
    costPerToken: 0.00000290,
    features: [
      'Todos los módulos desbloqueados',
      'Scraping masivo',
      'APIs + Integraciones',
      'Soporte dedicado'
    ]
  }
];

export const addons: Addon[] = [
  {
    id: 'credits-10',
    name: '10 Créditos',
    description: '10 créditos adicionales para tu cuenta',
    price: 1,
    type: 'credits',
    quantity: 10
  },
  {
    id: 'credits-50',
    name: '50 Créditos',
    description: '50 créditos adicionales (5% descuento)',
    price: 4.75,
    type: 'credits',
    quantity: 50
  },
  {
    id: 'credits-100',
    name: '100 Créditos',
    description: '100 créditos adicionales (10% descuento)',
    price: 9,
    type: 'credits',
    quantity: 100
  },
  {
    id: 'tokens-1m',
    name: '1M Tokens',
    description: '1 millón de tokens adicionales',
    price: 6.5,
    type: 'tokens',
    quantity: 1000000
  },
  {
    id: 'tokens-5m',
    name: '5M Tokens',
    description: '5 millones de tokens (5% descuento)',
    price: 30.88,
    type: 'tokens',
    quantity: 5000000
  },
  {
    id: 'tokens-10m',
    name: '10M Tokens',
    description: '10 millones de tokens (10% descuento)',
    price: 58.5,
    type: 'tokens',
    quantity: 10000000
  }
];
