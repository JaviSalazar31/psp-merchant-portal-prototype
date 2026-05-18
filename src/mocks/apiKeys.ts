export type ApiKeyType = 'publishable' | 'secret' | 'restricted';
export type ApiKeyStatus = 'Activa' | 'Revocada';
export type ApiKeyMode = 'sandbox' | 'production';

export interface MockApiKey {
  id: string;
  name: string;
  type: ApiKeyType;
  mode: ApiKeyMode;
  status: ApiKeyStatus;
  prefix: string;
  // Para publishable mostramos la key completa. Para secret guardamos suffix y revelamos al usuario.
  fullKey: string;
  suffix: string;
  createdAt: Date;
  expiresAt: Date | null;
  lastUsedAt: Date | null;
}

const today = new Date('2026-05-15T12:00:00').getTime();
const days = (n: number) => n * 24 * 60 * 60 * 1000;
const hours = (n: number) => n * 60 * 60 * 1000;

// En el prototipo solo existe modo Sandbox. Las keys de Producción se generan post-activación.
export const MOCK_API_KEYS: MockApiKey[] = [
  {
    id: 'apik_1',
    name: 'Default publishable',
    type: 'publishable',
    mode: 'sandbox',
    status: 'Activa',
    prefix: 'pk_test_',
    fullKey: 'pk_test_4eC39HqLyjWDarjtT1zdp7dcAtJxQXz8VnLp',
    suffix: 'p7dcAtJx',
    createdAt: new Date(today - days(35)),
    expiresAt: null,
    lastUsedAt: new Date(today - hours(2)),
  },
  {
    id: 'apik_2',
    name: 'Default secret',
    type: 'secret',
    mode: 'sandbox',
    status: 'Activa',
    prefix: 'sk_test_',
    fullKey: 'sk_test_51HQK3xLm2pVnQrYjW8tBcN4FgD7HsZpRvKwMnUiTjLp9XqYzBcDfGhJ',
    suffix: 'TjLp9Xqy',
    createdAt: new Date(today - days(35)),
    expiresAt: null,
    lastUsedAt: new Date(today - hours(8)),
  },
];
