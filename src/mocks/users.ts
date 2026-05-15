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

// Poblado en Fase 7.
export const MOCK_MERCHANT_USERS: MockMerchantUser[] = [];
