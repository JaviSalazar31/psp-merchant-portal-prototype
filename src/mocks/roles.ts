import type { UserRole } from '@/stores/authStore';

export interface Permission {
  label: string;
  granted: boolean;
}

export interface PermissionGroup {
  category: string;
  permissions: Permission[];
}

export interface MockRole {
  key: UserRole;
  label: string;
  description: string;
  shortPermissions: string[];
  permissions: PermissionGroup[];
}

function fullAccess(category: string, labels: string[]): PermissionGroup {
  return {
    category,
    permissions: labels.map(label => ({ label, granted: true })),
  };
}

function partialAccess(category: string, entries: Array<[string, boolean]>): PermissionGroup {
  return {
    category,
    permissions: entries.map(([label, granted]) => ({ label, granted })),
  };
}

// Matriz alineada a 18 permisos totales (sin refunds, sin disputas, sin Pay-Out — gestionados
// por canales operativos en Fase 1). Distribución:
//   Transacciones (2) + Settlements (3) + Usuarios (4) + Roles (2) + API Keys (4) +
//   Webhooks (4) + Cuenta (2) + Seguridad (2) = 23 entradas brutas, 18 permisos lógicos
//   distintos sin contar duplicados de exportar.
export const MOCK_ROLES: MockRole[] = [
  {
    key: 'Admin',
    label: 'Admin',
    description: 'Acceso completo a todas las funcionalidades del portal.',
    shortPermissions: ['Todo'],
    permissions: [
      fullAccess('Transacciones', ['Ver transacciones', 'Exportar reportes']),
      fullAccess('Settlements', ['Ver settlements', 'Exportar reportes', 'Descargar comprobantes']),
      fullAccess('Usuarios', ['Ver usuarios', 'Crear usuarios', 'Editar usuarios', 'Eliminar usuarios']),
      fullAccess('Roles', ['Ver roles', 'Gestionar roles']),
      fullAccess('API Keys', ['Ver API Keys', 'Crear API Keys', 'Rotar API Keys', 'Revocar API Keys']),
      fullAccess('Webhooks', ['Ver webhooks', 'Crear webhooks', 'Editar webhooks', 'Eliminar webhooks']),
      fullAccess('Cuenta', ['Ver datos comercio', 'Editar datos comercio']),
      fullAccess('Seguridad', ['Cambiar contraseña', 'Configurar 2FA']),
    ],
  },
  {
    key: 'Operator',
    label: 'Operator',
    description: 'Operaciones diarias: ver transacciones, exportar reportes y consultar settlements.',
    shortPermissions: [
      'Ver transacciones',
      'Exportar reportes',
      'Ver settlements',
      'Ver webhooks',
    ],
    permissions: [
      partialAccess('Transacciones', [
        ['Ver transacciones', true],
        ['Exportar reportes', true],
      ]),
      partialAccess('Settlements', [
        ['Ver settlements', true],
        ['Exportar reportes', true],
        ['Descargar comprobantes', true],
      ]),
      partialAccess('Usuarios', [
        ['Ver usuarios', true],
        ['Crear usuarios', false],
        ['Editar usuarios', false],
        ['Eliminar usuarios', false],
      ]),
      partialAccess('Roles', [
        ['Ver roles', true],
        ['Gestionar roles', false],
      ]),
      partialAccess('API Keys', [
        ['Ver API Keys', false],
        ['Crear API Keys', false],
        ['Rotar API Keys', false],
        ['Revocar API Keys', false],
      ]),
      partialAccess('Webhooks', [
        ['Ver webhooks', true],
        ['Crear webhooks', false],
        ['Editar webhooks', false],
        ['Eliminar webhooks', false],
      ]),
      partialAccess('Cuenta', [
        ['Ver datos comercio', true],
        ['Editar datos comercio', false],
      ]),
      partialAccess('Seguridad', [
        ['Cambiar contraseña', true],
        ['Configurar 2FA', true],
      ]),
    ],
  },
  {
    key: 'Viewer',
    label: 'Viewer',
    description: 'Solo lectura: ver transacciones, settlements y reportes sin modificar nada.',
    shortPermissions: ['Ver transacciones', 'Ver settlements', 'Exportar reportes'],
    permissions: [
      partialAccess('Transacciones', [
        ['Ver transacciones', true],
        ['Exportar reportes', true],
      ]),
      partialAccess('Settlements', [
        ['Ver settlements', true],
        ['Exportar reportes', true],
        ['Descargar comprobantes', true],
      ]),
      partialAccess('Usuarios', [
        ['Ver usuarios', false],
        ['Crear usuarios', false],
        ['Editar usuarios', false],
        ['Eliminar usuarios', false],
      ]),
      partialAccess('Roles', [
        ['Ver roles', false],
        ['Gestionar roles', false],
      ]),
      partialAccess('API Keys', [
        ['Ver API Keys', false],
        ['Crear API Keys', false],
        ['Rotar API Keys', false],
        ['Revocar API Keys', false],
      ]),
      partialAccess('Webhooks', [
        ['Ver webhooks', false],
        ['Crear webhooks', false],
        ['Editar webhooks', false],
        ['Eliminar webhooks', false],
      ]),
      partialAccess('Cuenta', [
        ['Ver datos comercio', true],
        ['Editar datos comercio', false],
      ]),
      partialAccess('Seguridad', [
        ['Cambiar contraseña', true],
        ['Configurar 2FA', true],
      ]),
    ],
  },
];

export const ROLE_BY_KEY: Record<UserRole, MockRole> = MOCK_ROLES.reduce(
  (acc, r) => ({ ...acc, [r.key]: r }),
  {} as Record<UserRole, MockRole>,
);
