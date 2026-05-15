import type { UserRole } from '@/stores/authStore';

export interface PermissionGroup {
  category: string;
  permissions: { label: string; granted: boolean }[];
}

export interface MockRole {
  key: UserRole;
  label: string;
  description: string;
  assignedCount: number;
  permissions: PermissionGroup[];
}

// Poblado en Fase 7.
export const MOCK_ROLES: MockRole[] = [];
