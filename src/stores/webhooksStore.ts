import { create } from 'zustand';
import {
  MOCK_WEBHOOKS,
  type MockWebhook,
  type MockWebhookDelivery,
  type WebhookEventKey,
} from '@/mocks/webhooks';

export interface CreateWebhookPayload {
  url: string;
  description: string;
  events: WebhookEventKey[];
}

interface WebhooksState {
  webhooks: MockWebhook[];
  mode: 'sandbox' | 'production';
  saving: boolean;
  setMode: (mode: 'sandbox' | 'production') => void;
  createWebhook: (payload: CreateWebhookPayload) => Promise<MockWebhook>;
  updateWebhook: (id: string, patch: Partial<Pick<MockWebhook, 'url' | 'description' | 'events' | 'status'>>) => Promise<void>;
  deleteWebhook: (id: string) => Promise<void>;
  retryDelivery: (webhookId: string, deliveryId: string) => Promise<MockWebhookDelivery | null>;
  sendTestEvent: (webhookId: string, event: WebhookEventKey) => Promise<MockWebhookDelivery>;
}

const FAKE_LATENCY_MS = 700;
const fakeDelay = () => new Promise<void>(resolve => setTimeout(resolve, FAKE_LATENCY_MS));

let nextId = 1000;
function generateId(prefix: string) {
  nextId += 1;
  return `${prefix}_${nextId}`;
}

const SECRET_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz0123456789';
function randomSecret(n: number) {
  let out = '';
  for (let i = 0; i < n; i += 1) {
    out += SECRET_ALPHABET[Math.floor(Math.random() * SECRET_ALPHABET.length)];
  }
  return out;
}

function buildTestDelivery(event: WebhookEventKey): MockWebhookDelivery {
  // Simulamos respuesta exitosa para el test event.
  return {
    id: generateId('d'),
    timestamp: new Date(),
    event,
    statusCode: 200,
    status: 'success',
    attempts: 1,
    maxAttempts: 8,
    responseBodyPreview: '{"received":true}',
    latencyMs: 120 + Math.floor(Math.random() * 180),
  };
}

export const useWebhooksStore = create<WebhooksState>((set, get) => ({
  webhooks: MOCK_WEBHOOKS,
  mode: 'sandbox',
  saving: false,

  setMode: mode => set({ mode }),

  createWebhook: async ({ url, description, events }) => {
    set({ saving: true });
    await fakeDelay();
    const newWh: MockWebhook = {
      id: generateId('wh'),
      url,
      description,
      signingSecret: `whsec_${randomSecret(48)}`,
      apiVersion: '2026-04-22',
      status: 'Activo',
      mode: get().mode,
      events,
      deliveries: [],
      createdAt: new Date(),
      deliveryStats24h: { total: 0, successful: 0, failed: 0 },
    };
    set(state => ({ webhooks: [...state.webhooks, newWh], saving: false }));
    return newWh;
  },

  updateWebhook: async (id, patch) => {
    set({ saving: true });
    await fakeDelay();
    set(state => ({
      webhooks: state.webhooks.map(w => (w.id === id ? { ...w, ...patch } : w)),
      saving: false,
    }));
  },

  deleteWebhook: async id => {
    set({ saving: true });
    await fakeDelay();
    set(state => ({ webhooks: state.webhooks.filter(w => w.id !== id), saving: false }));
  },

  retryDelivery: async (webhookId, deliveryId) => {
    set({ saving: true });
    await fakeDelay();
    const webhook = get().webhooks.find(w => w.id === webhookId);
    const delivery = webhook?.deliveries.find(d => d.id === deliveryId);
    if (!webhook || !delivery) {
      set({ saving: false });
      return null;
    }
    // En el reintento manual simulamos éxito y resetear retry chain.
    const retried: MockWebhookDelivery = {
      ...delivery,
      id: generateId('d'),
      timestamp: new Date(),
      statusCode: 200,
      status: 'success',
      attempts: delivery.attempts + 1,
      responseBodyPreview: '{"received":true}',
      latencyMs: 180,
      nextRetry: null,
    };
    set(state => ({
      webhooks: state.webhooks.map(w =>
        w.id === webhookId
          ? { ...w, deliveries: [retried, ...w.deliveries.filter(d => d.id !== deliveryId)] }
          : w,
      ),
      saving: false,
    }));
    return retried;
  },

  sendTestEvent: async (webhookId, event) => {
    set({ saving: true });
    await fakeDelay();
    const delivery = buildTestDelivery(event);
    set(state => ({
      webhooks: state.webhooks.map(w =>
        w.id === webhookId ? { ...w, deliveries: [delivery, ...w.deliveries] } : w,
      ),
      saving: false,
    }));
    return delivery;
  },
}));
