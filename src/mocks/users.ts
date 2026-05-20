import type { UserRole } from '@/stores/authStore';

export type MerchantUserStatus = 'Activo' | 'Pendiente' | 'Suspendido';

export interface MockMerchantUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  status: MerchantUserStatus;
  createdAt: Date;
  lastLogin: Date | null;
}

const days = (n: number) => n * 24 * 60 * 60 * 1000;
const today = new Date('2026-05-15T12:00:00').getTime();

export const MOCK_MERCHANT_USERS: MockMerchantUser[] = [
  {
    id: 'mu_1',
    firstName: 'Bruno',
    lastName: 'Fernández',
    email: 'bruno@tacospancho.mx',
    role: 'Admin',
    status: 'Activo',
    createdAt: new Date(today - days(45)),
    lastLogin: new Date(today - 60 * 60 * 1000),
  },
  {
    id: 'mu_2',
    firstName: 'Ai',
    lastName: 'Coleman',
    email: 'ai.coleman@tacospancho.mx',
    role: 'Operator',
    status: 'Activo',
    createdAt: new Date(today - days(30)),
    lastLogin: new Date(today - days(1)),
  },
  {
    id: 'mu_3',
    firstName: 'María',
    lastName: 'Rodríguez',
    email: 'maria.rodriguez@tacospancho.mx',
    role: 'Operator',
    status: 'Activo',
    createdAt: new Date(today - days(22)),
    lastLogin: new Date(today - days(2)),
  },
  {
    id: 'mu_finance',
    firstName: 'Sofía',
    lastName: 'Torres',
    email: 'sofia.torres@tacospancho.mx',
    role: 'Finance',
    status: 'Activo',
    createdAt: new Date(today - days(20)),
    lastLogin: new Date(today - days(1)),
  },
  {
    id: 'mu_4',
    firstName: 'Juan',
    lastName: 'García',
    email: 'juan.garcia@tacospancho.mx',
    role: 'Viewer',
    status: 'Activo',
    createdAt: new Date(today - days(18)),
    lastLogin: new Date(today - days(5)),
  },
  {
    id: 'mu_5',
    firstName: 'Laura',
    lastName: 'Pérez',
    email: 'laura.perez@tacospancho.mx',
    role: 'Viewer',
    status: 'Pendiente',
    createdAt: new Date(today - days(2)),
    lastLogin: null,
  },
];
