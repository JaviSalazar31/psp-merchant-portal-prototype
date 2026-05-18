import type { Language } from '@/stores/authStore';

export interface ProfilePreferences {
  language: Language;
  timezone: string;
  dateFormat: string;
  numberFormat: string;
}

export interface ProfileNotifications {
  transactionAuthorized: boolean;
  disputeOpened: boolean;
  settlementProcessed: boolean;
  dailySummary: boolean;
}

export interface ProfileData {
  preferences: ProfilePreferences;
  notifications: ProfileNotifications;
}

export const TIMEZONE_OPTIONS = [
  { value: 'America/Argentina/Buenos_Aires', label: 'GMT-3 Buenos Aires' },
  { value: 'America/Sao_Paulo', label: 'GMT-3 São Paulo' },
  { value: 'America/Mexico_City', label: 'GMT-6 Ciudad de México' },
  { value: 'America/Bogota', label: 'GMT-5 Bogotá' },
  { value: 'America/Lima', label: 'GMT-5 Lima' },
  { value: 'America/Santiago', label: 'GMT-3 Santiago' },
] as const;

export const DATE_FORMAT_OPTIONS = [
  { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY (15/05/2026)' },
  { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY (05/15/2026)' },
  { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD (2026-05-15)' },
] as const;

export const NUMBER_FORMAT_OPTIONS = [
  { value: 'es-AR', label: '1.234,56 (es-AR)' },
  { value: 'en-US', label: '1,234.56 (en-US)' },
  { value: 'es-MX', label: '1,234.56 (es-MX)' },
] as const;

export const MOCK_PROFILE: ProfileData = {
  preferences: {
    language: 'es',
    timezone: 'America/Argentina/Buenos_Aires',
    dateFormat: 'DD/MM/YYYY',
    numberFormat: 'es-AR',
  },
  notifications: {
    transactionAuthorized: true,
    disputeOpened: true,
    settlementProcessed: true,
    dailySummary: false,
  },
};
