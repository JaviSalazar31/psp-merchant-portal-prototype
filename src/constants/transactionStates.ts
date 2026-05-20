import { colors } from '@/theme/tokens';

export type TransactionStatusKey =
  | 'CREADO'
  | 'PENDIENTE'
  | 'EN_REVISION'
  | 'AUTORIZADO'
  | 'EN_DISPUTA'
  | 'REEMBOLSADO'
  | 'RECHAZADO'
  | 'FALLIDO';

export interface TransactionStateMeta {
  key: TransactionStatusKey;
  label: string;
  description: string;
  bg: string;
  fg: string;
  bannerVariant: 'success' | 'info' | 'warning' | 'error' | 'neutral' | null;
}

// Los labels de estado se muestran siempre en inglés por consistencia de marca.
// Las descripciones (prosa contextual) se mantienen en español rioplatense.
export const TRANSACTION_STATES: Record<TransactionStatusKey, TransactionStateMeta> = {
  CREADO: {
    key: 'CREADO',
    label: 'Created',
    description: 'Transacción creada exitosamente',
    bg: colors.statusCreado.bg,
    fg: colors.statusCreado.fg,
    bannerVariant: null,
  },
  PENDIENTE: {
    key: 'PENDIENTE',
    label: 'Pending',
    description: 'Esperando confirmación del partner de pago',
    bg: colors.statusPendiente.bg,
    fg: colors.statusPendiente.fg,
    bannerVariant: 'warning',
  },
  EN_REVISION: {
    key: 'EN_REVISION',
    label: 'Under Review',
    description: 'Alta riesgo, requiere revisión manual',
    bg: colors.statusEnRevision.bg,
    fg: colors.statusEnRevision.fg,
    bannerVariant: 'warning',
  },
  AUTORIZADO: {
    key: 'AUTORIZADO',
    label: 'Authorized',
    description: 'Pago autorizado por el partner',
    bg: colors.statusAutorizado.bg,
    fg: colors.statusAutorizado.fg,
    bannerVariant: 'success',
  },
  EN_DISPUTA: {
    key: 'EN_DISPUTA',
    label: 'In Dispute',
    description: 'Tarjetahabiente disputó el pago',
    bg: colors.statusEnDisputa.bg,
    fg: colors.statusEnDisputa.fg,
    bannerVariant: 'error',
  },
  REEMBOLSADO: {
    key: 'REEMBOLSADO',
    label: 'Refunded',
    description: 'Reembolso aprobado y procesado',
    bg: colors.statusReembolsado.bg,
    fg: colors.statusReembolsado.fg,
    bannerVariant: 'info',
  },
  RECHAZADO: {
    key: 'RECHAZADO',
    label: 'Rejected',
    description: 'Rechazado tras revisión',
    bg: colors.statusRechazado.bg,
    fg: colors.statusRechazado.fg,
    bannerVariant: 'error',
  },
  FALLIDO: {
    key: 'FALLIDO',
    label: 'Failed',
    description: 'Error en envío o procesamiento',
    bg: colors.statusFallido.bg,
    fg: colors.statusFallido.fg,
    bannerVariant: 'neutral',
  },
};

// Estados visibles para Pay-Out (Pay-Out no tiene EN_DISPUTA — las salidas no se disputan).
export const PAYOUT_STATES: TransactionStatusKey[] = [
  'CREADO',
  'PENDIENTE',
  'EN_REVISION',
  'AUTORIZADO',
  'REEMBOLSADO',
  'RECHAZADO',
  'FALLIDO',
];

export type SettlementStatusKey = 'PENDING' | 'IN_TRANSIT' | 'PAID' | 'FAILED';

// Los labels de settlement, igual que los de transacciones, se muestran en inglés
// por consistencia de marca (Cruce v2: Pending / Ready to settle / Settled).
export const SETTLEMENT_STATES: Record<SettlementStatusKey, { label: string; bg: string; fg: string }> = {
  PENDING: { label: 'Pending', bg: colors.statusPending.bg, fg: colors.statusPending.fg },
  IN_TRANSIT: { label: 'Ready to settle', bg: colors.statusInTransit.bg, fg: colors.statusInTransit.fg },
  PAID: { label: 'Settled', bg: colors.statusPaid.bg, fg: colors.statusPaid.fg },
  FAILED: { label: 'Failed', bg: colors.statusFailed.bg, fg: colors.statusFailed.fg },
};
