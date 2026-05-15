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

export const MOCK_ROLES: MockRole[] = [
  {
    key: 'Admin',
    label: 'Admin',
    description: 'Acceso completo a todas las funcionalidades del portal.',
    shortPermissions: ['Todo'],
    permissions: [
      fullAccess('Transacciones', [
        'Ver transacciones',
        'Crear refunds',
        'Marcar disputas',
        'Exportar reportes',
        'Crear Pay-Out',
      ]),
      fullAccess('Settlements', ['Ver settlements', 'Exportar reportes', 'Descargar comprobantes']),
      fullAccess('Usuarios', ['Ver usuarios', 'Crear usuarios', 'Editar usuarios', 'Eliminar usuarios']),
      fullAccess('Roles', ['Ver roles', 'Gestionar roles']),
      fullAccess('API Keys', ['Ver API Keys', 'Crear API Keys', 'Rotar API Keys', 'Revocar API Keys']),
      fullAccess('Webhooks', ['Ver webhooks', 'Crear webhooks', 'Editar webhooks', 'Eliminar webhooks']),
      fullAccess('Cuenta', ['Ver datos comercio', 'Editar datos comercio']),
      fullAccess('Seguridad', ['Ver sesiones', 'Cerrar sesiones', 'Configurar 2FA']),
    ],
  },
  {
    key: 'Operator',
    label: 'Operator',
    description: 'Operaciones diarias: ver transacciones, crear refunds y exportar reportes.',
    shortPermissions: [
      'Ver transacciones',
      'Crear refunds',
      'Exportar reportes',
      'Ver settlements',
    ],
    permissions: [
      partialAccess('Transacciones', [
        ['Ver transacciones', true],
        ['Crear refunds', true],
        ['Marcar disputas', true],
        ['Exportar reportes', true],
        ['Crear Pay-Out', false],
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
        ['Ver sesiones', true],
        ['Cerrar sesiones', false],
        ['Configurar 2FA', false],
      ]),
    ],
  },
  {
    key: 'Viewer',
    label: 'Viewer',
    description: 'Solo lectura: ver transacciones, settlements y reportes sin modificar nada.',
    shortPermissions: ['Ver transacciones', 'Ver settlements', 'Ver reportes'],
    permissions: [
      partialAccess('Transacciones', [
        ['Ver transacciones', true],
        ['Crear refunds', false],
        ['Marcar disputas', false],
        ['Exportar reportes', true],
        ['Crear Pay-Out', false],
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
        ['Ver sesiones', true],
        ['Cerrar sesiones', false],
        ['Configurar 2FA', false],
      ]),
    ],
  },
];

export const ROLE_BY_KEY: Record<UserRole, MockRole> = MOCK_ROLES.reduce(
  (acc, r) => ({ ...acc, [r.key]: r }),
  {} as Record<UserRole, MockRole>,
);
