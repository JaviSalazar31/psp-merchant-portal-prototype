export type WebhookEventKey = 'approved' | 'declined' | 'error' | 'expired' | 'notification_error';
export type WebhookChannelType = 'email' | 'callback';
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

/**
 * Canal de notificación del comercio. Internamente seguimos llamándolo "webhook" en el
 * código; en la interfaz el usuario ve "canal de notificación". Un canal puede ser de
 * tipo email (alerta al correo) o callback (POST firmado a una URL del comercio).
 */
export interface MockWebhook {
  id: string;
  type: WebhookChannelType;
  /** Destino cuando el canal es de tipo callback. */
  url?: string;
  /** Destino cuando el canal es de tipo email. */
  email?: string;
  description: string;
  /** Sólo los canales callback tienen signing secret. */
  signingSecret?: string;
  apiVersion: string;
  status: 'Activo' | 'Pausado';
  events: WebhookEventKey[];
  deliveries: MockWebhookDelivery[];
  createdAt: Date;
  deliveryStats24h: { total: number; successful: number; failed: number };
}

export const ALL_WEBHOOK_EVENTS: WebhookEventKey[] = [
  'approved',
  'declined',
  'error',
  'expired',
  'notification_error',
];

/** Los nombres de evento se muestran siempre en inglés por consistencia de marca. */
export const WEBHOOK_EVENT_LABELS: Record<WebhookEventKey, string> = {
  approved: 'Approved',
  declined: 'Declined',
  error: 'Error',
  expired: 'Expired',
  notification_error: 'Notification Error',
};

/** Política de reintentos — se muestra en la sección "Detalles técnicos". */
export const WEBHOOK_RETRY_POLICY =
  '3 reintentos con backoff exponencial: el primero al minuto, el segundo a los 5 minutos y el tercero a los 30 minutos.';

/** Ejemplo de payload — se muestra en la sección "Detalles técnicos". */
export const WEBHOOK_PAYLOAD_EXAMPLE = `{
  "event": "approved",
  "transaction_id": "20260515-1200-pi00482",
  "amount": 199.95,
  "currency": "MXN",
  "timestamp": "2026-05-15T12:00:00Z"
}`;

const today = new Date('2026-05-15T12:00:00').getTime();
const mins = (n: number) => n * 60 * 1000;
const hours = (n: number) => n * 60 * 60 * 1000;
const days = (n: number) => n * 24 * 60 * 60 * 1000;

export const MOCK_WEBHOOKS: MockWebhook[] = [
  {
    id: 'wh_1',
    type: 'callback',
    url: 'https://tacospancho.mx/api/webhooks/psp',
    description: 'Endpoint principal de producción del backend de Tacos Pancho.',
    signingSecret: 'whsec_8KqLm2pVnQrYjW3tBcN4FgD7HsZpRvKwMnUiTjLp9XqYzAbCdEf',
    apiVersion: '2026-04-22',
    status: 'Activo',
    events: ['approved', 'declined', 'error'],
    createdAt: new Date(today - days(35)),
    deliveryStats24h: { total: 28, successful: 27, failed: 1 },
    deliveries: [
      {
        id: 'd_1_1',
        timestamp: new Date(today - mins(5)),
        event: 'approved',
        statusCode: 200,
        status: 'success',
        attempts: 1,
        maxAttempts: 3,
        responseBodyPreview: '{"received":true}',
        latencyMs: 184,
      },
      {
        id: 'd_1_2',
        timestamp: new Date(today - mins(12)),
        event: 'declined',
        statusCode: 200,
        status: 'success',
        attempts: 1,
        maxAttempts: 3,
        responseBodyPreview: '{"received":true}',
        latencyMs: 142,
      },
      {
        id: 'd_1_3',
        timestamp: new Date(today - mins(35)),
        event: 'error',
        statusCode: 500,
        status: 'retrying',
        attempts: 2,
        maxAttempts: 3,
        responseBodyPreview: '{"error":"Internal server error"}',
        latencyMs: 5421,
        nextRetry: new Date(today + mins(25)),
      },
      {
        id: 'd_1_4',
        timestamp: new Date(today - hours(2)),
        event: 'approved',
        statusCode: 200,
        status: 'success',
        attempts: 1,
        maxAttempts: 3,
        responseBodyPreview: '{"received":true}',
        latencyMs: 167,
      },
    ],
  },
  {
    id: 'wh_2',
    type: 'email',
    email: 'it-alerts@tacospancho.mx',
    description: 'Alertas operativas al equipo de IT por correo.',
    apiVersion: '2026-04-22',
    status: 'Activo',
    events: ['approved', 'declined', 'error', 'expired', 'notification_error'],
    createdAt: new Date(today - days(18)),
    deliveryStats24h: { total: 12, successful: 12, failed: 0 },
    deliveries: [
      {
        id: 'd_2_1',
        timestamp: new Date(today - hours(1)),
        event: 'error',
        statusCode: 200,
        status: 'success',
        attempts: 1,
        maxAttempts: 3,
        responseBodyPreview: 'Email entregado',
        latencyMs: 320,
      },
      {
        id: 'd_2_2',
        timestamp: new Date(today - hours(5)),
        event: 'approved',
        statusCode: 200,
        status: 'success',
        attempts: 1,
        maxAttempts: 3,
        responseBodyPreview: 'Email entregado',
        latencyMs: 287,
      },
    ],
  },
];
