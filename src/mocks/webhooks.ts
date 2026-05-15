export type WebhookEventKey =
  | 'transaction.created'
  | 'transaction.authorized'
  | 'transaction.failed'
  | 'transaction.refunded'
  | 'settlement.processed'
  | 'dispute.opened'
  | 'dispute.closed';

export type WebhookDeliveryStatus = 'success' | 'failed' | 'retrying';

export interface MockWebhookDelivery {
  id: string;
  timestamp: Date;
  event: WebhookEventKey;
  statusCode: number;
  status: WebhookDeliveryStatus;
  attempts: number;
  maxAttempts: number;
  responseBodyPreview: string;
  latencyMs: number;
  nextRetry?: Date | null;
}

export interface MockWebhook {
  id: string;
  url: string;
  description: string;
  signingSecret: string;
  apiVersion: string;
  status: 'Activo' | 'Pausado';
  mode: 'sandbox' | 'production';
  events: WebhookEventKey[];
  deliveries: MockWebhookDelivery[];
  createdAt: Date;
  deliveryStats24h: { total: number; successful: number; failed: number };
}

// Poblado en Fase 8.
export const MOCK_WEBHOOKS: MockWebhook[] = [];

export const ALL_WEBHOOK_EVENTS: WebhookEventKey[] = [
  'transaction.created',
  'transaction.authorized',
  'transaction.failed',
  'transaction.refunded',
  'settlement.processed',
  'dispute.opened',
  'dispute.closed',
];
