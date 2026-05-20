import type { TransactionStatusKey } from '@/constants/transactionStates';

export interface TransactionEvent {
  timestamp: Date;
  type:
    | 'created'
    | 'sent'
    | 'pending'
    | 'in_review'
    | 'authorized'
    | 'rejected'
    | 'failed'
    | 'dispute_opened'
    | 'refunded';
  description: string;
}

export interface MockTransaction {
  id: string;
  reference: string;
  createdAt: Date;
  approvedAt: Date | null;
  country: string;
  currency: string;
  paymentMethod: string;
  type: 'pay-in' | 'pay-out';
  amount: number;
  fees: number;
  taxes: number;
  netAmount: number;
  status: TransactionStatusKey;
  customerEmail: string;
  customerName: string;
  beneficiaryName?: string;
  partnerReference?: string;
  events: TransactionEvent[];
  metadata?: Record<string, string>;
  cardLast4?: string;
  errorCode?: string;
  /** Campo interno (NO renderizar). Adenda Cambio 8 — ceguera del proveedor. */
  _internal_provider?: string;
}

// ────────────────────────────────────────────────────────────────────
// Generador determinístico de mocks (sin Math.random; usa modular index)
// ────────────────────────────────────────────────────────────────────

const PAY_IN_DISTRIBUTION: TransactionStatusKey[] = [
  ...Array<TransactionStatusKey>(8).fill('CREADO'),
  ...Array<TransactionStatusKey>(15).fill('PENDIENTE'),
  ...Array<TransactionStatusKey>(5).fill('EN_REVISION'),
  ...Array<TransactionStatusKey>(12).fill('AUTORIZADO'),
  ...Array<TransactionStatusKey>(2).fill('EN_DISPUTA'),
  ...Array<TransactionStatusKey>(3).fill('REEMBOLSADO'),
  ...Array<TransactionStatusKey>(3).fill('RECHAZADO'),
  ...Array<TransactionStatusKey>(2).fill('FALLIDO'),
];

const PAY_OUT_DISTRIBUTION: TransactionStatusKey[] = [
  ...Array<TransactionStatusKey>(5).fill('CREADO'),
  ...Array<TransactionStatusKey>(9).fill('PENDIENTE'),
  ...Array<TransactionStatusKey>(3).fill('EN_REVISION'),
  ...Array<TransactionStatusKey>(8).fill('AUTORIZADO'),
  ...Array<TransactionStatusKey>(2).fill('REEMBOLSADO'),
  ...Array<TransactionStatusKey>(2).fill('RECHAZADO'),
  ...Array<TransactionStatusKey>(1).fill('FALLIDO'),
];

const COUNTRIES_DIST = [
  'MX', 'MX', 'MX', 'MX', 'MX',         // 50%
  'BR', 'BR', 'BR',                      // 30%
  'CO', 'CO',                            // 20%
];

const CURRENCY_BY_COUNTRY: Record<string, string> = {
  MX: 'MXN',
  BR: 'BRL',
  CO: 'COP',
};

const METHODS_BY_COUNTRY: Record<string, string[]> = {
  MX: ['CARD_CREDIT', 'CARD_DEBIT', 'SPEI', 'CASH'],
  BR: ['CARD_CREDIT', 'CARD_DEBIT', 'PIX', 'CASH'],
  CO: ['CARD_CREDIT', 'CARD_DEBIT', 'CASH'],
};

const PROVIDERS = ['Kushki', 'PayCash', 'Unlimit'];

const CUSTOMER_FIRST = [
  'Ana', 'Carlos', 'Mariana', 'Andrés', 'Lucía', 'Pablo', 'Fernanda',
  'João', 'Sofía', 'Roberto', 'Camila', 'Diego', 'Valentina', 'Joaquín',
  'Renata', 'Mateo', 'Isabella', 'Bruno', 'Florencia', 'Tomás',
];

const CUSTOMER_LAST = [
  'López', 'Silva', 'Torres', 'Quintero', 'Méndez', 'Ramírez', 'Castro',
  'Santos', 'Rodríguez', 'García', 'Vega', 'Fernández', 'Ortiz', 'Costa',
  'Romero', 'Núñez', 'Pereira', 'Alvarez', 'Martínez', 'Cruz',
];

const BENEFICIARY_NAMES = [
  'Distribuidora Norte SA',
  'Logística Express MX',
  'Importadora del Sur',
  'Servicios Profesionales SAS',
  'Proveedora Andina Ltda',
  'Comercializadora Pacific',
  'Tech Suppliers Brasil',
  'Refacciones Centrales',
];

const AMOUNT_PATTERNS = [
  // [base, multiplicador para que no quede redondo]
  { base: 199.95, mult: 1 },
  { base: 850.0, mult: 1 },
  { base: 1200.0, mult: 1 },
  { base: 2450.5, mult: 1 },
  { base: 3200.0, mult: 1 },
  { base: 549.9, mult: 1 },
  { base: 4500.0, mult: 1 },
  { base: 749.9, mult: 1 },
  { base: 1690.0, mult: 1 },
  { base: 95.0, mult: 1 },
];

const ERROR_CODES = [
  'CARD_DECLINED',
  'INSUFFICIENT_FUNDS',
  'CARD_EXPIRED',
  'FRAUD_SUSPECTED',
  'NETWORK_ERROR',
  'TIMEOUT',
  'LIMIT_EXCEEDED',
];

function pickAmount(country: string, baseIdx: number): number {
  const pattern = AMOUNT_PATTERNS[baseIdx % AMOUNT_PATTERNS.length];
  // COP es sin decimales y montos más grandes
  if (country === 'CO') return Math.round(pattern.base * 200);
  return pattern.base;
}

function hex(n: number, len: number): string {
  return n.toString(16).padStart(len, '0').slice(-len);
}

function makeId(date: Date, idx: number, prefix: string): string {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const hhmm = `${String(date.getHours()).padStart(2, '0')}${String(date.getMinutes()).padStart(2, '0')}`;
  return `${yyyy}${mm}${dd}-${hhmm}-${prefix}${hex(idx * 13, 4)}-${hex(idx * 71, 4)}-${hex(idx * 1531, 12)}`;
}

function makeReference(idx: number): string {
  return `${hex(idx * 7, 8)}-${hex(idx * 11, 4)}-${hex(idx * 17, 4)}-${hex(idx * 23, 4)}-${hex(idx * 31, 12)}`;
}

function buildEvents(
  status: TransactionStatusKey,
  createdAt: Date,
  approvedAt: Date | null,
): TransactionEvent[] {
  const t0 = createdAt;
  const t1 = new Date(t0.getTime() + 1000);
  const t2 = new Date(t0.getTime() + 2500);
  const t3 = new Date(t0.getTime() + 4200);
  const t4 = approvedAt ?? new Date(t0.getTime() + 6500);

  const events: TransactionEvent[] = [
    { timestamp: t0, type: 'created', description: 'Transacción creada' },
  ];

  switch (status) {
    case 'CREADO':
      return events;
    case 'PENDIENTE':
      events.push(
        { timestamp: t1, type: 'sent', description: 'Enviada a partner para procesamiento' },
        { timestamp: t2, type: 'pending', description: 'Partner recibió la solicitud' },
      );
      return events;
    case 'EN_REVISION':
      events.push(
        { timestamp: t1, type: 'sent', description: 'Enviada a partner para procesamiento' },
        { timestamp: t2, type: 'pending', description: 'Partner recibió la solicitud' },
        { timestamp: t3, type: 'in_review', description: 'Marcada para revisión manual por riesgo elevado' },
      );
      return events;
    case 'AUTORIZADO':
      events.push(
        { timestamp: t1, type: 'sent', description: 'Enviada a partner para procesamiento' },
        { timestamp: t2, type: 'pending', description: 'Partner recibió la solicitud' },
        { timestamp: t4, type: 'authorized', description: 'Pago autorizado por partner' },
      );
      return events;
    case 'EN_DISPUTA':
      events.push(
        { timestamp: t1, type: 'sent', description: 'Enviada a partner para procesamiento' },
        { timestamp: t2, type: 'pending', description: 'Partner recibió la solicitud' },
        { timestamp: t3, type: 'authorized', description: 'Pago autorizado por partner' },
        {
          timestamp: new Date(t0.getTime() + 1000 * 60 * 60 * 24 * 3),
          type: 'dispute_opened',
          description: 'Tarjetahabiente abrió disputa con el banco emisor',
        },
      );
      return events;
    case 'REEMBOLSADO':
      events.push(
        { timestamp: t1, type: 'sent', description: 'Enviada a partner para procesamiento' },
        { timestamp: t2, type: 'pending', description: 'Partner recibió la solicitud' },
        { timestamp: t3, type: 'authorized', description: 'Pago autorizado por partner' },
        {
          timestamp: new Date(t0.getTime() + 1000 * 60 * 60 * 24),
          type: 'refunded',
          description: 'Reembolso aprobado y procesado',
        },
      );
      return events;
    case 'RECHAZADO':
      events.push(
        { timestamp: t1, type: 'sent', description: 'Enviada a partner para procesamiento' },
        { timestamp: t2, type: 'in_review', description: 'Marcada para revisión manual' },
        { timestamp: t3, type: 'rejected', description: 'Rechazada tras revisión' },
      );
      return events;
    case 'FALLIDO':
      events.push({
        timestamp: t1,
        type: 'failed',
        description: 'No se pudo procesar la transacción',
      });
      return events;
  }
}

const today = new Date('2026-05-15T12:00:00').getTime();

function generateBatch(
  type: 'pay-in' | 'pay-out',
  distribution: TransactionStatusKey[],
  startIdx: number,
): MockTransaction[] {
  return distribution.map((status, i) => {
    const idx = startIdx + i;
    // Distribución temporal: spread over last 30 days
    const offsetMinutes = (idx * 137) % (60 * 24 * 30);
    const createdAt = new Date(today - offsetMinutes * 60 * 1000);
    const country = COUNTRIES_DIST[idx % COUNTRIES_DIST.length];
    const currency = CURRENCY_BY_COUNTRY[country];
    const methods = METHODS_BY_COUNTRY[country];
    const paymentMethod = methods[idx % methods.length];
    const amount = pickAmount(country, idx);
    const fees = Number((amount * 0.025).toFixed(country === 'CO' ? 0 : 2));
    const taxes = Number((fees * 0.16).toFixed(country === 'CO' ? 0 : 2));
    const netAmount = Number((amount - fees - taxes).toFixed(country === 'CO' ? 0 : 2));
    const approvedAt = status === 'AUTORIZADO' || status === 'EN_DISPUTA' || status === 'REEMBOLSADO'
      ? new Date(createdAt.getTime() + 6500)
      : null;

    const firstName = CUSTOMER_FIRST[idx % CUSTOMER_FIRST.length];
    const lastName = CUSTOMER_LAST[(idx * 7) % CUSTOMER_LAST.length];
    const customerName = `${firstName} ${lastName}`;
    // Normalizamos primero con NFD para descomponer acentos en caracter base + diacritico,
    // despues quitamos los diacriticos (\u0300-\u036f). Asi 'Lopez' / 'Garcia' / 'Nunez'
    // mantienen todas las letras en vez de quedar 'lpez', 'garca', 'nez'.
    const emailUser = firstName.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    const emailDomain = lastName.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z]/g, '');
    const customerEmail = `${emailUser}.${emailDomain}@ejemplo.com`;
    const cardLast4 = paymentMethod.startsWith('CARD')
      ? String(1000 + ((idx * 31) % 9000))
      : undefined;
    const beneficiaryName = type === 'pay-out'
      ? BENEFICIARY_NAMES[idx % BENEFICIARY_NAMES.length]
      : undefined;
    const provider = PROVIDERS[idx % PROVIDERS.length];
    const partnerReference =
      country === 'MX' && paymentMethod === 'SPEI'
        ? `CEP-${1000000000 + idx}`
        : undefined;
    const errorCode =
      status === 'FALLIDO' || status === 'RECHAZADO'
        ? ERROR_CODES[idx % ERROR_CODES.length]
        : undefined;

    const prefix = type === 'pay-in' ? 'pi' : 'po';
    return {
      id: makeId(createdAt, idx, prefix),
      reference: makeReference(idx),
      createdAt,
      approvedAt,
      country,
      currency,
      paymentMethod,
      type,
      amount,
      fees,
      taxes,
      netAmount,
      status,
      customerEmail,
      customerName,
      beneficiaryName,
      partnerReference,
      events: buildEvents(status, createdAt, approvedAt),
      cardLast4,
      errorCode,
      _internal_provider: provider,
    };
  });
}

export const MOCK_TRANSACTIONS: MockTransaction[] = [
  ...generateBatch('pay-in', PAY_IN_DISTRIBUTION, 0),
  ...generateBatch('pay-out', PAY_OUT_DISTRIBUTION, 100),
];
