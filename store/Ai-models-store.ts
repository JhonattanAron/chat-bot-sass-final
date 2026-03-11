import { create } from "zustand";

export interface Model {
  id: number;
  name: string;
  provider: string;
  category: string;
  description: string;
  cost: string;
  tags: string[];
  image: string;
  longDescription?: string;
  features?: string[];
  apiEndpoint?: string;
  implementationCode?: string;
  pythonCode?: string;
}

interface ModelStore {
  models: Model[];
  searchTerm: string;
  selectedCategory: string;
  sortBy: string;
  setSearchTerm: (term: string) => void;
  setSelectedCategory: (category: string) => void;
  setSortBy: (sort: string) => void;
  initializeModels: (models: Model[]) => void;
  getFilteredModels: () => Model[];
  getModelById: (id: number) => Model | undefined;
}

const INITIAL_MODELS: Model[] = [
  {
    id: 1,
    name: "Flux Pro Image Generator",
    provider: "Flux",
    category: "Generación de Imágenes",
    description:
      "Generador de imágenes de alta calidad con velocidad optimizada",
    cost: "5 créditos por imagen",
    tags: ["rápido", "alta calidad"],
    image: "/models/flux-pro.jpg",
    longDescription:
      "Flux Pro es el generador de imágenes más rápido y eficiente del mercado. Utiliza la última tecnología de difusión latente para crear imágenes de calidad profesional en segundos.",
    features: [
      "Generación en tiempo real",
      "Soporte para múltiples estilos",
      "Control fino de parámetros",
      "Generación de lotes",
      "API integrada",
    ],
    apiEndpoint: "https://api.flux.ai/v1/generate",
    implementationCode: `const response = await fetch('https://api.flux.ai/v1/generate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY',
  },
  body: JSON.stringify({
    prompt: 'A beautiful sunset over mountains',
    width: 1024,
    height: 1024,
    num_images: 1,
    quality: 'high',
  }),
});

const data = await response.json();
console.log('Generated image URL:', data.image_url);`,
    pythonCode: `import requests
import json

api_key = 'YOUR_API_KEY'
url = 'https://api.flux.ai/v1/generate'

headers = {
    'Content-Type': 'application/json',
    'Authorization': f'Bearer {api_key}'
}

payload = {
    'prompt': 'A beautiful sunset over mountains',
    'width': 1024,
    'height': 1024,
    'num_images': 1,
    'quality': 'high'
}

response = requests.post(url, headers=headers, json=payload)
data = response.json()
print(f"Generated image URL: {data['image_url']}")`,
  },
  {
    id: 2,
    name: "SDXL Image Model",
    provider: "Stability",
    category: "Generación de Imágenes",
    description:
      "Modelo estable de difusión XL para generación de imágenes realistas",
    cost: "3 créditos por imagen",
    tags: ["popular", "alta calidad"],
    image: "/models/sdxl.jpg",
    longDescription:
      "Stability AI SDXL es uno de los modelos de generación de imágenes más populares. Ofrece un excelente equilibrio entre calidad y velocidad.",
    features: [
      "Generación fotorealista",
      "Múltiples resoluciones",
      "Control de semilla para reproducibilidad",
      "Estilos personalizados",
      "Bajo latency",
    ],
    apiEndpoint:
      "https://api.stability.ai/v1/generate/stable-diffusion-xl-1024-v1-0",
    implementationCode: `const response = await fetch('https://api.stability.ai/v1/generate/stable-diffusion-xl-1024-v1-0', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY',
  },
  body: JSON.stringify({
    text_prompts: [
      {
        text: 'A serene lake surrounded by mountains',
        weight: 1,
      },
    ],
    cfg_scale: 7,
    height: 1024,
    width: 1024,
    samples: 1,
    steps: 30,
  }),
});

const data = await response.json();
const image = data.artifacts[0].base64;`,
    pythonCode: `import requests
import base64

api_key = 'YOUR_API_KEY'
url = 'https://api.stability.ai/v1/generate/stable-diffusion-xl-1024-v1-0'

headers = {
    'Content-Type': 'application/json',
    'Authorization': f'Bearer {api_key}'
}

payload = {
    'text_prompts': [
        {
            'text': 'A serene lake surrounded by mountains',
            'weight': 1
        }
    ],
    'cfg_scale': 7,
    'height': 1024,
    'width': 1024,
    'samples': 1,
    'steps': 30
}

response = requests.post(url, headers=headers, json=payload)
data = response.json()
image_data = base64.b64decode(data['artifacts'][0]['base64'])
with open('image.png', 'wb') as f:
    f.write(image_data)`,
  },
  {
    id: 3,
    name: "GPT Image Generation",
    provider: "OpenAI",
    category: "Generación de Imágenes",
    description:
      "Generación de imágenes creativas basada en descripción de texto",
    cost: "8 créditos por imagen",
    tags: ["creativo", "popular"],
    image: "/models/gpt-image.jpg",
    longDescription:
      "DALL-E 3 es el generador de imágenes de OpenAI que entiende instrucciones en lenguaje natural con precisión.",
    features: [
      "Comprensión avanzada de prompts",
      "Generación de múltiples variaciones",
      "Edición de imágenes (inpainting)",
      "Resoluciones personalizadas",
      "Integración con ChatGPT",
    ],
    apiEndpoint: "https://api.openai.com/v1/images/generations",
    implementationCode: `const openai = require('openai');

const client = new openai.OpenAI({
  apiKey: 'YOUR_API_KEY',
});

async function generateImage() {
  const image = await client.images.generate({
    model: 'dall-e-3',
    prompt: 'A futuristic city with neon lights and flying cars',
    n: 1,
    size: '1024x1024',
    quality: 'hd',
  });

  console.log('Image URL:', image.data[0].url);
  return image.data[0].url;
}

generateImage();`,
    pythonCode: `from openai import OpenAI

client = OpenAI(api_key='YOUR_API_KEY')

response = client.images.generate(
    model='dall-e-3',
    prompt='A futuristic city with neon lights and flying cars',
    n=1,
    size='1024x1024',
    quality='hd'
)

print(f"Image URL: {response.data[0].url}")`,
  },
  {
    id: 4,
    name: "Llama 3 Text AI",
    provider: "Meta",
    category: "Texto",
    description:
      "Modelo de lenguaje avanzado para generación y análisis de texto",
    cost: "2 créditos por 1K tokens",
    tags: ["rápido", "eficiente"],
    image: "/models/llama3.jpg",
    longDescription:
      "Llama 3 es el modelo de lenguaje de código abierto más potente de Meta, optimizado para conversaciones naturales.",
    features: [
      "Contexto de 8K tokens",
      "Soporte multilingüe",
      "Excelente en razonamiento",
      "Bajo costo por token",
      "Fácil de implementar",
    ],
    apiEndpoint: "https://api.llama-api.com/v1/chat/completions",
    implementationCode: `const response = await fetch('https://api.llama-api.com/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY',
  },
  body: JSON.stringify({
    model: 'llama-3-70b-chat',
    messages: [
      {
        role: 'user',
        content: '¿Cuál es la capital de Francia?',
      },
    ],
    temperature: 0.7,
    max_tokens: 256,
  }),
});

const data = await response.json();
console.log('Response:', data.choices[0].message.content);`,
    pythonCode: `import requests

api_key = 'YOUR_API_KEY'
url = 'https://api.llama-api.com/v1/chat/completions'

headers = {
    'Content-Type': 'application/json',
    'Authorization': f'Bearer {api_key}'
}

payload = {
    'model': 'llama-3-70b-chat',
    'messages': [
        {
            'role': 'user',
            'content': '¿Cuál es la capital de Francia?'
        }
    ],
    'temperature': 0.7,
    'max_tokens': 256
}

response = requests.post(url, headers=headers, json=payload)
data = response.json()
print(f"Response: {data['choices'][0]['message']['content']}")`,
  },
  {
    id: 5,
    name: "GPT-4 Turbo",
    provider: "OpenAI",
    category: "Texto",
    description: "Modelo de lenguaje más avanzado para tareas complejas",
    cost: "4 créditos por 1K tokens",
    tags: ["popular", "potente"],
    image: "/models/gpt4.jpg",
    longDescription:
      "GPT-4 Turbo es el modelo más avanzado de OpenAI con 128K tokens de contexto y capacidades mejoradas en razonamiento.",
    features: [
      "Contexto de 128K tokens",
      "Mejor comprensión de instrucciones",
      "Visión de imágenes",
      "Conocimiento actualizado",
      "Máxima precisión",
    ],
    apiEndpoint: "https://api.openai.com/v1/chat/completions",
    implementationCode: `const openai = require('openai');

const client = new openai.OpenAI({
  apiKey: 'YOUR_API_KEY',
});

async function chat() {
  const response = await client.chat.completions.create({
    model: 'gpt-4-turbo',
    messages: [
      {
        role: 'system',
        content: 'Eres un asistente útil.',
      },
      {
        role: 'user',
        content: 'Explica la teoría de la relatividad de forma sencilla',
      },
    ],
    temperature: 0.7,
    max_tokens: 500,
  });

  console.log('Response:', response.choices[0].message.content);
}

chat();`,
    pythonCode: `from openai import OpenAI

client = OpenAI(api_key='YOUR_API_KEY')

response = client.chat.completions.create(
    model='gpt-4-turbo',
    messages=[
        {
            'role': 'system',
            'content': 'Eres un asistente útil.'
        },
        {
            'role': 'user',
            'content': 'Explica la teoría de la relatividad de forma sencilla'
        }
    ],
    temperature=0.7,
    max_tokens=500
)

print(f"Response: {response.choices[0].message.content}")`,
  },
  {
    id: 6,
    name: "Claude 3 Opus",
    provider: "Anthropic",
    category: "Texto",
    description: "Modelo versátil para una amplia gama de tareas de lenguaje",
    cost: "3 créditos por 1K tokens",
    tags: ["versátil", "confiable"],
    image: "/models/claude3.jpg",
    longDescription:
      "Claude 3 Opus de Anthropic es un modelo de IA poderoso y versátil, ideal para análisis profundos y tareas complejas.",
    features: [
      "Contexto de 200K tokens",
      "Análisis profundo",
      "Escritura creativa",
      "Procesamiento de documentos",
      "Salida estructurada",
    ],
    apiEndpoint: "https://api.anthropic.com/v1/messages",
    implementationCode: `const Anthropic = require('@anthropic-ai/sdk');

const client = new Anthropic({
  apiKey: 'YOUR_API_KEY',
});

async function askClaude() {
  const message = await client.messages.create({
    model: 'claude-3-opus-20240229',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: '¿Cuáles son los beneficios principales de la IA en la medicina?',
      },
    ],
  });

  console.log('Response:', message.content[0].text);
}

askClaude();`,
    pythonCode: `import anthropic

client = anthropic.Anthropic(api_key='YOUR_API_KEY')

message = client.messages.create(
    model='claude-3-opus-20240229',
    max_tokens=1024,
    messages=[
        {
            'role': 'user',
            'content': '¿Cuáles son los beneficios principales de la IA en la medicina?'
        }
    ]
)

print(f"Response: {message.content[0].text}")`,
  },
  {
    id: 7,
    name: "Runway Gen-3 Video",
    provider: "Runway",
    category: "Video",
    description:
      "Generación de videos de alta calidad a partir de texto e imágenes",
    cost: "20 créditos por video",
    tags: ["innovador", "alta calidad"],
    image: "/models/runway.jpg",
    longDescription:
      "Runway Gen-3 es el modelo generador de video más avanzado, capaz de crear videos fotorealistas y de alta calidad.",
    features: [
      "Generación a partir de texto",
      "Extensión de videos",
      "Edición inteligente",
      "Efectos especiales",
      "Control fino",
    ],
    apiEndpoint: "https://api.runwayml.com/v1/video_generations",
    implementationCode: `const response = await fetch('https://api.runwayml.com/v1/video_generations', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    prompt: 'A cinematic scene of a dragon flying over mountains',
    duration: 5,
    resolution: '1280x720',
  }),
});

const data = await response.json();
console.log('Video ID:', data.id);`,
    pythonCode: `import requests

headers = {'Authorization': 'Bearer YOUR_API_KEY'}
url = 'https://api.runwayml.com/v1/video_generations'

payload = {
    'prompt': 'A cinematic scene of a dragon flying over mountains',
    'duration': 5,
    'resolution': '1280x720'
}

response = requests.post(url, headers=headers, json=payload)
data = response.json()
print(f"Video ID: {data['id']}")`,
  },
  {
    id: 8,
    name: "Synthesia AI Video",
    provider: "Synthesia",
    category: "Video",
    description: "Crear videos de presentación con avatares de IA",
    cost: "15 créditos por video",
    tags: ["profesional", "rápido"],
    image: "/models/synthesia.jpg",
    longDescription:
      "Synthesia permite crear videos profesionales con avatares virtuales, perfecto para presentaciones y entrenamientos.",
    features: [
      "Avatares realistas",
      "Múltiples idiomas",
      "Edición sencilla",
      "Plantillas profesionales",
      "Exportación rápida",
    ],
    apiEndpoint: "https://api.synthesia.io/v1/videos",
    implementationCode: `const response = await fetch('https://api.synthesia.io/v1/videos', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    title: 'My First Video',
    description: 'A professional presentation',
    script: 'Hello, this is my presentation about AI.',
    avatarId: 'avatar-1',
    language: 'es',
  }),
});

const data = await response.json();
console.log('Video created:', data.id);`,
    pythonCode: `import requests

headers = {'Authorization': 'Bearer YOUR_API_KEY'}
url = 'https://api.synthesia.io/v1/videos'

payload = {
    'title': 'My First Video',
    'description': 'A professional presentation',
    'script': 'Hello, this is my presentation about AI.',
    'avatarId': 'avatar-1',
    'language': 'es'
}

response = requests.post(url, headers=headers, json=payload)
data = response.json()
print(f"Video created: {data['id']}")`,
  },
  {
    id: 9,
    name: "Eleven Labs Text-to-Speech",
    provider: "Eleven Labs",
    category: "Audio",
    description: "Síntesis de voz natural con múltiples idiomas y voces",
    cost: "5 créditos por minuto",
    tags: ["natural", "multiidioma"],
    image: "/models/eleven-labs.jpg",
    longDescription:
      "Eleven Labs ofrece síntesis de voz ultra-realista con voces naturales en múltiples idiomas.",
    features: [
      "Voces naturales",
      "Bajo latency",
      "Múltiples idiomas",
      "Control de emociones",
      "Generación streaming",
    ],
    apiEndpoint: "https://api.elevenlabs.io/v1/text-to-speech",
    implementationCode: `const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM', {
  method: 'POST',
  headers: {
    'xi-api-key': 'YOUR_API_KEY',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    text: 'Hola, esto es una prueba de síntesis de voz',
    model_id: 'eleven_monolingual_v1',
    voice_settings: { stability: 0.5, similarity_boost: 0.75 },
  }),
});

const audioBlob = await response.blob();
const url = URL.createObjectURL(audioBlob);
const audio = new Audio(url);
audio.play();`,
    pythonCode: `import requests

headers = {'xi-api-key': 'YOUR_API_KEY'}
url = 'https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM'

payload = {
    'text': 'Hola, esto es una prueba de síntesis de voz',
    'model_id': 'eleven_monolingual_v1',
    'voice_settings': {
        'stability': 0.5,
        'similarity_boost': 0.75
    }
}

response = requests.post(url, headers=headers, json=payload)
with open('speech.mp3', 'wb') as f:
    f.write(response.content)`,
  },
  {
    id: 10,
    name: "Jukebox Audio Generation",
    provider: "OpenAI",
    category: "Audio",
    description: "Generación de música y audio original",
    cost: "10 créditos por canción",
    tags: ["creativo", "innovador"],
    image: "/models/jukebox.jpg",
    longDescription:
      "Jukebox de OpenAI genera música original con varios géneros y estilos.",
    features: [
      "Múltiples géneros",
      "Control de duración",
      "Variaciones creativas",
      "Audio estéreo",
      "Calidad alta",
    ],
    apiEndpoint: "https://api.openai.com/v1/audio/generation",
    implementationCode: `const response = await fetch('https://api.openai.com/v1/audio/generation', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    prompt: 'Upbeat electronic dance music',
    duration: 30,
    genre: 'electronic',
  }),
});

const data = await response.json();
console.log('Music generated:', data.audio_url);`,
    pythonCode: `import requests

headers = {'Authorization': 'Bearer YOUR_API_KEY'}
url = 'https://api.openai.com/v1/audio/generation'

payload = {
    'prompt': 'Upbeat electronic dance music',
    'duration': 30,
    'genre': 'electronic'
}

response = requests.post(url, headers=headers, json=payload)
data = response.json()
print(f"Music generated: {data['audio_url']}")`,
  },
  {
    id: 11,
    name: "Whisper Speech Recognition",
    provider: "OpenAI",
    category: "Audio",
    description: "Reconocimiento de voz robusto en múltiples idiomas",
    cost: "1 crédito por minuto",
    tags: ["rápido", "preciso"],
    image: "/models/whisper.jpg",
    longDescription:
      "Whisper de OpenAI es un modelo de reconocimiento de voz robusto y preciso en múltiples idiomas.",
    features: [
      "99% de precisión",
      "Múltiples idiomas",
      "Bajo ruido",
      "Rápido",
      "Código abierto",
    ],
    apiEndpoint: "https://api.openai.com/v1/audio/transcriptions",
    implementationCode: `const fs = require('fs');
const FormData = require('form-data');

const formData = new FormData();
formData.append('file', fs.createReadStream('audio.mp3'));
formData.append('model', 'whisper-1');
formData.append('language', 'es');

const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
  method: 'POST',
  headers: { 'Authorization': 'Bearer YOUR_API_KEY', ...formData.getHeaders() },
  body: formData,
});

const data = await response.json();
console.log('Transcription:', data.text);`,
    pythonCode: `import openai

client = openai.OpenAI(api_key='YOUR_API_KEY')

with open('audio.mp3', 'rb') as audio_file:
    transcript = client.audio.transcriptions.create(
        model='whisper-1',
        file=audio_file,
        language='es'
    )

print(f"Transcription: {transcript.text}")`,
  },
  {
    id: 12,
    name: "MuseNet Composition",
    provider: "OpenAI",
    category: "Audio",
    description: "Composición de música original en varios géneros",
    cost: "8 créditos por composición",
    tags: ["musical", "versátil"],
    image: "/models/musenet.jpg",
    longDescription:
      "MuseNet compone música original en varios géneros y estilos musicales.",
    features: [
      "Varios géneros",
      "Composiciones originales",
      "Duración variable",
      "Instrumenación rica",
      "Calidad profesional",
    ],
    apiEndpoint: "https://api.openai.com/v1/audio/composition",
    implementationCode: `const response = await fetch('https://api.openai.com/v1/audio/composition', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    genre: 'classical',
    style: 'symphony',
    duration: 120,
    tempo: 'moderate',
  }),
});

const data = await response.json();
console.log('Composition URL:', data.audio_url);`,
    pythonCode: `import requests

headers = {'Authorization': 'Bearer YOUR_API_KEY'}
url = 'https://api.openai.com/v1/audio/composition'

payload = {
    'genre': 'classical',
    'style': 'symphony',
    'duration': 120,
    'tempo': 'moderate'
}

response = requests.post(url, headers=headers, json=payload)
data = response.json()
print(f"Composition URL: {data['audio_url']}")`,
  },
];

export const useModelStore = create<ModelStore>((set, get) => ({
  models: INITIAL_MODELS,
  searchTerm: "",
  selectedCategory: "Todas",
  sortBy: "popular",

  setSearchTerm: (term: string) => set({ searchTerm: term }),
  setSelectedCategory: (category: string) =>
    set({ selectedCategory: category }),
  setSortBy: (sort: string) => set({ sortBy: sort }),

  initializeModels: (models: Model[]) => set({ models }),

  getFilteredModels: () => {
    const state = get();
    const { models, searchTerm, selectedCategory, sortBy } = state;

    const filteredModels = models.filter((model) => {
      const matchesSearch =
        model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        model.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        model.provider.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === "Todas" || model.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });

    const sortedModels = [...filteredModels].sort((a, b) => {
      if (sortBy === "cost") {
        const costA = parseInt(a.cost);
        const costB = parseInt(b.cost);
        return costA - costB;
      }
      if (sortBy === "popular") {
        return b.tags.includes("popular") ? 1 : -1;
      }
      return 0;
    });

    return sortedModels;
  },

  getModelById: (id: number) => {
    const state = get();
    return state.models.find((model) => model.id === id);
  },
}));
