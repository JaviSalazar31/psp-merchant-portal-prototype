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

export const ALL_WEBHOOK_EVENTS: WebhookEventKey[] = [
  'transaction.created',
  'transaction.authorized',
  'transaction.failed',
  'transaction.refunded',
  'settlement.processed',
  'dispute.opened',
  'dispute.closed',
];

export const WEBHOOK_EVENT_LABELS: Record<WebhookEventKey, string> = {
  'transaction.created': 'Transacción creada',
  'transaction.authorized': 'Transacción autorizada',
  'transaction.failed': 'Transacción fallida',
  'transaction.refunded': 'Transacción reembolsada',
  'settlement.processed': 'Settlement procesado',
  'dispute.opened': 'Disputa abierta',
  'dispute.closed': 'Disputa cerrada',
};

const today = new Date('2026-05-15T12:00:00').getTime();
const mins = (n: number) => n * 60 * 1000;
const hours = (n: number) => n * 60 * 60 * 1000;
const days = (n: number) => n * 24 * 60 * 60 * 1000;

export const MOCK_WEBHOOKS: MockWebhook[] = [
  {
    id: 'wh_1',
    url: 'https://tacospancho.mx/api/webhooks/paynau',
    description: 'Endpoint principal de producción del backend de Tacos Pancho.',
    signingSecret: 'whsec_8KqLm2pVnQrYjW3tBcN4FgD7HsZpRvKwMnUiTjLp9XqYzAbCdEf',
    apiVersion: '2026-04-22',
    status: 'Activo',
    mode: 'sandbox',
    events: ['transaction.created', 'transaction.authorized', 'transaction.failed'],
    createdAt: new Date(today - days(35)),
    deliveryStats24h: { total: 28, successful: 27, failed: 1 },
    deliveries: [
      {
        id: 'd_1_1',
        timestamp: new Date(today - mins(5)),
        event: 'transaction.authorized',
        statusCode: 200,
        status: 'success',
        attempts: 1,
        maxAttempts: 8,
        responseBodyPreview: '{"received":true}',
        latencyMs: 184,
      },
      {
        id: 'd_1_2',
        timestamp: new Date(today - mins(12)),
        event: 'transaction.created',
        statusCode: 200,
        status: 'success',
        attempts: 1,
        maxAttempts: 8,
        responseBodyPreview: '{"received":true}',
        latencyMs: 142,
      },
      {
        id: 'd_1_3',
        timestamp: new Date(today - mins(35)),
        event: 'transaction.failed',
        statusCode: 500,
        status: 'retrying',
        attempts: 3,
        maxAttempts: 8,
        responseBodyPreview: '{"error":"Internal server error"}',
        latencyMs: 5421,
        nextRetry: new Date(today + mins(25)),
      },
      {
        id: 'd_1_4',
        timestamp: new Date(today - hours(1) - mins(10)),
        event: 'transaction.authorized',
        statusCode: 200,
        status: 'success',
        attempts: 1,
        maxAttempts: 8,
        responseBodyPreview: '{"received":true}',
        latencyMs: 167,
      },
      {
        id: 'd_1_5',
        timestamp: new Date(today - hours(2) - mins(15)),
        event: 'transaction.authorized',
        statusCode: 200,
        status: 'success',
        attempts: 1,
        maxAttempts: 8,
        responseBodyPreview: '{"received":true}',
        latencyMs: 198,
      },
      {
        id: 'd_1_6',
        timestamp: new Date(today - hours(4)),
        event: 'transaction.created',
        statusCode: 200,
        status: 'success',
        attempts: 1,
        maxAttempts: 8,
        responseBodyPreview: '{"received":true}',
        latencyMs: 211,
      },
      {
        id: 'd_1_7',
        timestamp: new Date(today - hours(6) - mins(30)),
        event: 'transaction.authorized',
        statusCode: 200,
        status: 'success',
        attempts: 1,
        maxAttempts: 8,
        responseBodyPreview: '{"received":true}',
        latencyMs: 156,
      },
    ],
  },
  {
    id: 'wh_2',
    url: 'https://staging.tacospancho.mx/webhooks',
    description: 'Endpoint de staging — tests internos del equipo IT.',
    signingSecret: 'whsec_3MnPqLrStUvWxYzAbCdEfGhJkLm2pVnQrYjW3tBcN4FgD7Hs',
    apiVersion: '2026-04-22',
    status: 'Activo',
    mode: 'sandbox',
    events: [
      'transaction.created',
      'transaction.authorized',
      'transaction.failed',
      'transaction.refunded',
      'settlement.processed',
    ],
    createdAt: new Date(today - days(18)),
    deliveryStats24h: { total: 12, successful: 9, failed: 3 },
    deliveries: [
      {
        id: 'd_2_1',
        timestamp: new Date(today - hours(1)),
        event: 'transaction.failed',
        statusCode: 500,
        status: 'failed',
        attempts: 8,
        maxAttempts: 8,
        responseBodyPreview: '{"error":"timeout connecting to upstream"}',
        latencyMs: 30000,
        nextRetry: null,
      },
      {
        id: 'd_2_2',
        timestamp: new Date(today - hours(3) - mins(20)),
        event: 'transaction.failed',
        statusCode: 408,
        status: 'failed',
        attempts: 8,
        maxAttempts: 8,
        responseBodyPreview: '{"error":"request timeout"}',
        latencyMs: 30000,
        nextRetry: null,
      },
      {
        id: 'd_2_3',
        timestamp: new Date(today - hours(5)),
        event: 'transaction.authorized',
        statusCode: 200,
        status: 'success',
        attempts: 2,
        maxAttempts: 8,
        responseBodyPreview: '{"received":true}',
        latencyMs: 1240,
      },
      {
        id: 'd_2_4',
        timestamp: new Date(today - hours(7)),
        event: 'settlement.processed',
        statusCode: 200,
        status: 'success',
        attempts: 1,
        maxAttempts: 8,
        responseBodyPreview: '{"received":true}',
        latencyMs: 232,
      },
      {
        id: 'd_2_5',
        timestamp: new Date(today - hours(9) - mins(15)),
        event: 'transaction.created',
        statusCode: 200,
        status: 'success',
        attempts: 1,
        maxAttempts: 8,
        responseBodyPreview: '{"received":true}',
        latencyMs: 187,
      },
      {
        id: 'd_2_6',
        timestamp: new Date(today - hours(11)),
        event: 'transaction.failed',
        statusCode: 502,
        status: 'failed',
        attempts: 8,
        maxAttempts: 8,
        responseBodyPreview: '{"error":"bad gateway"}',
        latencyMs: 412,
        nextRetry: null,
      },
      {
        id: 'd_2_7',
        timestamp: new Date(today - hours(14)),
        event: 'transaction.refunded',
        statusCode: 200,
        status: 'success',
        attempts: 1,
        maxAttempts: 8,
        responseBodyPreview: '{"received":true}',
        latencyMs: 198,
      },
    ],
  },
];
