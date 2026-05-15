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

// Poblado en Fase 8.
export const MOCK_API_KEYS: MockApiKey[] = [];
