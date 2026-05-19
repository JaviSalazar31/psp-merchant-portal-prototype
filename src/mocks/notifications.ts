import type { InAppNotification } from '@/stores/notificationStore';

const min = (n: number) => n * 60 * 1000;
const hour = (n: number) => n * 60 * min(1);
const day = (n: number) => n * 24 * hour(1);

const now = Date.now();

// Cuatro tipos productivos para Fase 1:
// 1) settlement_available — liquidación disponible para revisión
// 2) document_rejected — documento del wizard rechazado por Backoffice
// 3) transactions_bulk_change — cambio masivo de estado en transacciones (10+ en últimas 24h)
// 4) api_key_expiring — API Key próxima a expirar (7 días o menos)
export const MOCK_NOTIFICATIONS: InAppNotification[] = [
  {
    id: 'n_1',
    type: 'settlement',
    title: 'Liquidación disponible para revisión',
    message: 'STL-20260514-008 · $45.230,00 MXN listos para liquidar',
    unread: true,
    createdAt: new Date(now - hour(2)),
    link: '/settlements',
  },
  {
    id: 'n_2',
    type: 'transaction',
    title: '12 transacciones cambiaron de estado',
    message: 'Movimientos en las últimas 24 hs · revisá el detalle',
    unread: true,
    createdAt: new Date(now - hour(6)),
    link: '/transactions/pay-in',
  },
  {
    id: 'n_3',
    type: 'security',
    title: 'Documento del onboarding rechazado',
    message: 'Acta Constitutiva · el equipo de Backoffice solicita una corrección',
    unread: true,
    createdAt: new Date(now - day(1)),
    link: '/account',
  },
  {
    id: 'n_4',
    type: 'security',
    title: 'API Key próxima a expirar',
    message: 'Default secret vence el 26 may 2026 · 7 días restantes',
    unread: false,
    createdAt: new Date(now - day(2)),
    link: '/api-keys',
  },
  {
    id: 'n_5',
    type: 'settlement',
    title: 'Liquidación disponible para revisión',
    message: 'STL-20260512-004 · R$ 24.499,94 BRL listos para liquidar',
    unread: false,
    createdAt: new Date(now - day(3)),
    link: '/settlements',
  },
  {
    id: 'n_6',
    type: 'transaction',
    title: '18 transacciones cambiaron de estado',
    message: 'Movimientos en las últimas 24 hs · revisá el detalle',
    unread: false,
    createdAt: new Date(now - day(5)),
    link: '/transactions/pay-in',
  },
];
