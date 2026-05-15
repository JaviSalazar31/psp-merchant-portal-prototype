/**
 * Design tokens del Merchant Portal Paynau.
 * Source of truth para paleta, tipografia, espaciados, radios, sombras y breakpoints.
 * Consumidos por muiTheme.ts y por componentes via sx={{ ... }}.
 */

export const colors = {
  // Brand
  brandPrimary: '#7CFF45',
  brandPrimaryDark: '#1F2937',
  brandDarkest: '#0A0E1A',

  // Hero panel gradient (split-screen pre-login y onboarding)
  heroPanelStart: '#0A1F0A',
  heroPanelMid: '#0F3D1F',
  heroPanelEnd: '#1A5733',

  // Backgrounds
  bgPage: '#F5F7FA',
  bgCard: '#FFFFFF',
  bgSubtle: '#F9FAFB',

  // Borders
  borderDefault: '#E5E7EB',
  borderStrong: '#D1D5DB',
  borderFocus: '#7CFF45',

  // Text
  textPrimary: '#111827',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',
  textInverse: '#FFFFFF',
  textLink: '#10B981',

  // Status badges de transacciones
  statusCreado: { bg: '#DBEAFE', fg: '#1E40AF' },
  statusPendiente: { bg: '#FEF3C7', fg: '#92400E' },
  statusEnRevision: { bg: '#FED7AA', fg: '#9A3412' },
  statusAutorizado: { bg: '#D1FAE5', fg: '#065F46' },
  statusEnDisputa: { bg: '#FEE2E2', fg: '#991B1B' },
  statusReembolsado: { bg: '#E0E7FF', fg: '#3730A3' },
  statusRechazado: { bg: '#FEE2E2', fg: '#991B1B' },
  statusFallido: { bg: '#F3F4F6', fg: '#4B5563' },

  // Status badges de settlements
  statusPending: { bg: '#FEF3C7', fg: '#92400E' },
  statusInTransit: { bg: '#DBEAFE', fg: '#1E40AF' },
  statusPaid: { bg: '#D1FAE5', fg: '#065F46' },
  statusFailed: { bg: '#FEE2E2', fg: '#991B1B' },

  // Banners contextuales en forms
  bannerInfo: { bg: '#EFF6FF', fg: '#1E40AF', border: '#BFDBFE' },
  bannerSuccess: { bg: '#ECFDF5', fg: '#065F46', border: '#A7F3D0' },
  bannerWarning: { bg: '#FFFBEB', fg: '#92400E', border: '#FCD34D' },
  bannerError: { bg: '#FEF2F2', fg: '#991B1B', border: '#FECACA' },

  // Password checklist tri-state
  pwReqInitial: '#9CA3AF',
  pwReqMet: '#10B981',
  pwReqPending: '#F59E0B',
} as const;

export const typography = {
  fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  sizes: {
    displayXL: 32,
    displayLG: 28,
    displayMD: 24,
    headingLG: 20,
    headingMD: 18,
    headingSM: 16,
    bodyLG: 16,
    bodyMD: 14,
    bodySM: 13,
    caption: 12,
    micro: 11,
  },
  weights: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
} as const;

export const radius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
} as const;

export const shadows = {
  none: 'none',
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.05)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
} as const;

export const breakpoints = {
  xs: 0,
  sm: 600,
  md: 900,
  lg: 1200,
  xl: 1536,
  xxl: 1920,
} as const;

// Gradient predefinido del hero panel
export const heroPanelGradient = `linear-gradient(135deg, ${colors.heroPanelStart} 0%, ${colors.heroPanelMid} 50%, ${colors.heroPanelEnd} 100%)`;
