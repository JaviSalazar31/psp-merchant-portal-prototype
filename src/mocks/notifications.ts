import type { InAppNotification } from '@/stores/notificationStore';

const min = (n: number) => n * 60 * 1000;
const hour = (n: number) => n * 60 * min(1);
const day = (n: number) => n * 24 * hour(1);

const now = Date.now();

export const MOCK_NOTIFICATIONS: InAppNotification[] = [
  {
    id: 'n_1',
    type: 'transaction',
    title: 'Transacción autorizada',
    message: 'Pago de $1.200,00 MXN aprobado · ref 6a1d010b',
    unread: true,
    createdAt: new Date(now - min(5)),
    link: '/transactions/pay-in',
  },
  {
    id: 'n_2',
    type: 'settlement',
    title: 'Settlement procesado',
    message: 'STL-20260514-008 · $45.230,00 MXN liquidados',
    unread: true,
    createdAt: new Date(now - hour(2)),
    link: '/settlements',
  },
  {
    id: 'n_3',
    type: 'system',
    title: 'Mantenimiento programado',
    message: 'Sábado 18 may, 02:00-04:00 ART · 30 min de downtime estimado',
    unread: true,
    createdAt: new Date(now - day(1)),
  },
  {
    id: 'n_4',
    type: 'transaction',
    title: '3 disputas abiertas',
    message: 'Revisá los chargebacks de los últimos 7 días',
    unread: false,
    createdAt: new Date(now - day(2)),
    link: '/transactions/pay-in',
  },
  {
    id: 'n_5',
    type: 'security',
    title: 'Nuevo inicio de sesión',
    message: 'Chrome en Windows · Buenos Aires · 192.168.1.X',
    unread: false,
    createdAt: new Date(now - day(3)),
    link: '/security',
  },
  {
    id: 'n_6',
    type: 'settlement',
    title: 'Próximo payout programado',
    message: '17 may 2026 · $45.230,00 MXN a BBVA México',
    unread: false,
    createdAt: new Date(now - day(4)),
    link: '/settlements',
  },
  {
    id: 'n_7',
    type: 'transaction',
    title: 'Tasa de aprobación al 94%',
    message: '+2% vs semana anterior',
    unread: false,
    createdAt: new Date(now - day(5)),
  },
  {
    id: 'n_8',
    type: 'system',
    title: 'Actualización de Términos',
    message: 'Actualizamos los Términos del servicio · Entra en vigor el 1 jun',
    unread: false,
    createdAt: new Date(now - day(7)),
  },
];
