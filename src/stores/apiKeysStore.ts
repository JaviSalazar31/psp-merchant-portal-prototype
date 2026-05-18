import { create } from 'zustand';
import {
  MOCK_API_KEYS,
  type ApiKeyMode,
  type ApiKeyType,
  type MockApiKey,
} from '@/mocks/apiKeys';

export type ApiKeyExpiration = 'never' | '30d' | '90d' | '1y';

export interface CreateApiKeyPayload {
  name: string;
  type: ApiKeyType;
  expiration: ApiKeyExpiration;
}

interface ApiKeysState {
  keys: MockApiKey[];
  mode: ApiKeyMode;
  saving: boolean;
  setMode: (mode: ApiKeyMode) => void;
  createKey: (payload: CreateApiKeyPayload) => Promise<MockApiKey>;
  renameKey: (id: string, name: string) => Promise<void>;
  rotateKey: (id: string) => Promise<MockApiKey | null>;
  deleteKey: (id: string) => Promise<void>;
}

const FAKE_LATENCY_MS = 700;
const fakeDelay = () => new Promise<void>(resolve => setTimeout(resolve, FAKE_LATENCY_MS));

let nextId = 1000;
function generateId() {
  nextId += 1;
  return `apik_${nextId}`;
}

const KEY_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz0123456789';
function randomChars(n: number) {
  let out = '';
  for (let i = 0; i < n; i += 1) {
    out += KEY_ALPHABET[Math.floor(Math.random() * KEY_ALPHABET.length)];
  }
  return out;
}

function expirationToDate(exp: ApiKeyExpiration): Date | null {
  if (exp === 'never') return null;
  const now = new Date();
  if (exp === '30d') return new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  if (exp === '90d') return new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);
  // 1 año
  return new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);
}

function buildFullKey(type: ApiKeyType): { prefix: string; fullKey: string; suffix: string } {
  const prefix = type === 'publishable' ? 'pk_test_' : type === 'secret' ? 'sk_test_' : 'rk_test_';
  const body = randomChars(40);
  const fullKey = `${prefix}${body}`;
  return { prefix, fullKey, suffix: body.slice(-8) };
}

export const useApiKeysStore = create<ApiKeysState>((set, get) => ({
  keys: MOCK_API_KEYS,
  mode: 'sandbox',
  saving: false,

  setMode: mode => set({ mode }),

  createKey: async ({ name, type, expiration }) => {
    set({ saving: true });
    await fakeDelay();
    const { prefix, fullKey, suffix } = buildFullKey(type);
    const newKey: MockApiKey = {
      id: generateId(),
      name,
      type,
      mode: get().mode,
      status: 'Activa',
      prefix,
      fullKey,
      suffix,
      createdAt: new Date(),
      expiresAt: expirationToDate(expiration),
      lastUsedAt: null,
    };
    set(state => ({ keys: [...state.keys, newKey], saving: false }));
    return newKey;
  },

  renameKey: async (id, name) => {
    set({ saving: true });
    await fakeDelay();
    set(state => ({
      keys: state.keys.map(k => (k.id === id ? { ...k, name } : k)),
      saving: false,
    }));
  },

  rotateKey: async id => {
    set({ saving: true });
    await fakeDelay();
    const original = get().keys.find(k => k.id === id);
    if (!original) {
      set({ saving: false });
      return null;
    }
    const { prefix, fullKey, suffix } = buildFullKey(original.type);
    const rotated: MockApiKey = {
      id: generateId(),
      name: original.name,
      type: original.type,
      mode: original.mode,
      status: 'Activa',
      prefix,
      fullKey,
      suffix,
      createdAt: new Date(),
      expiresAt: original.expiresAt,
      lastUsedAt: null,
    };
    set(state => ({
      keys: state.keys
        .map(k => (k.id === id ? { ...k, status: 'Revocada' as const } : k))
        .concat(rotated),
      saving: false,
    }));
    return rotated;
  },

  deleteKey: async id => {
    set({ saving: true });
    await fakeDelay();
    set(state => ({ keys: state.keys.filter(k => k.id !== id), saving: false }));
  },
}));
