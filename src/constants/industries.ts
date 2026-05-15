export const INDUSTRIES = [
  'Retail',
  'E-commerce',
  'SaaS',
  'Marketplace',
  'Servicios Financieros',
  'Educación',
  'Salud',
  'Turismo',
  'Entretenimiento',
  'Otros',
] as const;

export const MONTHLY_VOLUME_RANGES = [
  '<$10K',
  '$10K-50K',
  '$50K-100K',
  '$100K-500K',
  '$500K-1M',
  '$1M-5M',
  '$5M+',
] as const;

export const DEPARTMENTS = [
  { key: 'GENERAL', label: 'General', color: { bg: '#D1FAE5', fg: '#065F46' } },
  { key: 'COMMERCIAL', label: 'Comercial', color: { bg: '#DBEAFE', fg: '#1E40AF' } },
  { key: 'SUPPORT', label: 'Soporte Técnico', color: { bg: '#E0E7FF', fg: '#3730A3' } },
  { key: 'IT', label: 'Sistemas / IT', color: { bg: '#F3F4F6', fg: '#374151' } },
  { key: 'LEGAL', label: 'Jurídico', color: { bg: '#FEF3C7', fg: '#92400E' } },
  { key: 'ACCOUNTING', label: 'Contabilidad', color: { bg: '#FED7AA', fg: '#9A3412' } },
] as const;

export type DepartmentKey = (typeof DEPARTMENTS)[number]['key'];
