import { createTheme, type ThemeOptions } from '@mui/material/styles';
import { colors, typography, radius, shadows, breakpoints } from './tokens';

export type ThemeMode = 'light' | 'dark';

interface ModePalette {
  bgPage: string;
  bgCard: string;
  bgSubtle: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  borderDefault: string;
  borderStrong: string;
}

const MODE_PALETTES: Record<ThemeMode, ModePalette> = {
  light: {
    bgPage: colors.bgPage,
    bgCard: colors.bgCard,
    bgSubtle: colors.bgSubtle,
    textPrimary: colors.textPrimary,
    textSecondary: colors.textSecondary,
    textMuted: colors.textMuted,
    borderDefault: colors.borderDefault,
    borderStrong: colors.borderStrong,
  },
  dark: {
    bgPage: '#0F141C',
    bgCard: '#1A2030',
    bgSubtle: '#222937',
    textPrimary: '#F3F4F6',
    textSecondary: '#9CA3AF',
    textMuted: '#6B7280',
    borderDefault: '#2A3142',
    borderStrong: '#3A4255',
  },
};

export function buildMuiTheme(mode: ThemeMode) {
  const palette = MODE_PALETTES[mode];

  const themeOptions: ThemeOptions = {
    palette: {
      mode,
      primary: {
        main: mode === 'dark' ? colors.brandPrimary : colors.brandDarkest,
        contrastText: mode === 'dark' ? colors.brandDarkest : colors.textInverse,
      },
      secondary: {
        main: colors.brandPrimary,
        contrastText: colors.brandDarkest,
      },
      success: { main: '#10B981' },
      warning: { main: '#F59E0B' },
      error: { main: '#DC2626' },
      info: { main: '#3B82F6' },
      background: {
        default: palette.bgPage,
        paper: palette.bgCard,
      },
      text: {
        primary: palette.textPrimary,
        secondary: palette.textSecondary,
        disabled: palette.textMuted,
      },
      divider: palette.borderDefault,
    },
    typography: {
      fontFamily: typography.fontFamily,
      h1: { fontSize: typography.sizes.displayLG, fontWeight: typography.weights.bold, lineHeight: 1.2 },
      h2: { fontSize: typography.sizes.displayMD, fontWeight: typography.weights.bold, lineHeight: 1.3 },
      h3: { fontSize: typography.sizes.headingLG, fontWeight: typography.weights.semibold, lineHeight: 1.35 },
      h4: { fontSize: typography.sizes.headingMD, fontWeight: typography.weights.semibold, lineHeight: 1.4 },
      h5: { fontSize: typography.sizes.headingSM, fontWeight: typography.weights.semibold, lineHeight: 1.5 },
      h6: { fontSize: typography.sizes.bodyLG, fontWeight: typography.weights.semibold, lineHeight: 1.5 },
      body1: { fontSize: typography.sizes.bodyMD, lineHeight: 1.6 },
      body2: { fontSize: typography.sizes.bodySM, lineHeight: 1.55 },
      caption: { fontSize: typography.sizes.caption, lineHeight: 1.5 },
      button: {
        fontSize: typography.sizes.bodyMD,
        fontWeight: typography.weights.semibold,
        textTransform: 'none',
        letterSpacing: 0,
      },
    },
    shape: { borderRadius: radius.md },
    breakpoints: { values: breakpoints },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: { backgroundColor: palette.bgPage, color: palette.textPrimary },
          a: { color: colors.textLink, textDecoration: 'none' },
          '*': { boxSizing: 'border-box' },
        },
      },
      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: {
          root: {
            borderRadius: radius.md,
            paddingInline: 20,
            paddingBlock: 10,
            minHeight: 42,
          },
          containedPrimary: {
            backgroundColor: mode === 'dark' ? colors.brandPrimary : colors.brandDarkest,
            color: mode === 'dark' ? colors.brandDarkest : colors.textInverse,
            '&:hover': {
              backgroundColor: mode === 'dark' ? '#5DE82A' : '#1B2030',
            },
            '&.Mui-disabled': {
              backgroundColor: mode === 'dark' ? colors.brandPrimary : colors.brandDarkest,
              color: mode === 'dark' ? colors.brandDarkest : colors.textInverse,
              opacity: 0.5,
            },
          },
          outlined: {
            borderColor: palette.borderStrong,
            color: palette.textPrimary,
            '&:hover': {
              borderColor: mode === 'dark' ? colors.brandPrimary : colors.brandDarkest,
              backgroundColor: palette.bgSubtle,
            },
          },
          text: {
            color: colors.textLink,
            '&:hover': { backgroundColor: 'rgba(16, 185, 129, 0.06)' },
          },
        },
      },
      MuiTextField: {
        defaultProps: { variant: 'outlined', size: 'medium', fullWidth: true },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: radius.md,
            backgroundColor: palette.bgCard,
            '& fieldset': { borderColor: palette.borderDefault },
            '&:hover fieldset': { borderColor: palette.borderStrong },
            '&.Mui-focused fieldset': { borderColor: colors.borderFocus, borderWidth: 2 },
          },
        },
      },
      MuiInputLabel: {
        styleOverrides: {
          root: {
            fontSize: typography.sizes.bodyMD,
            color: palette.textSecondary,
            '&.Mui-focused': { color: mode === 'dark' ? colors.brandPrimary : colors.brandDarkest },
          },
        },
      },
      MuiCard: {
        defaultProps: { elevation: 0 },
        styleOverrides: {
          root: {
            borderRadius: radius.lg,
            border: `1px solid ${palette.borderDefault}`,
            backgroundColor: palette.bgCard,
            boxShadow: shadows.sm,
          },
        },
      },
      MuiPaper: {
        defaultProps: { elevation: 0 },
        styleOverrides: { root: { backgroundImage: 'none' } },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: radius.full,
            fontWeight: typography.weights.medium,
            fontSize: typography.sizes.caption,
          },
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            backgroundColor: colors.brandDarkest,
            fontSize: typography.sizes.caption,
            paddingInline: 10,
            paddingBlock: 6,
            borderRadius: radius.sm,
          },
          arrow: { color: colors.brandDarkest },
        },
      },
      MuiAppBar: {
        defaultProps: { elevation: 0, color: 'inherit' },
        styleOverrides: {
          root: {
            backgroundColor: palette.bgCard,
            borderBottom: `1px solid ${palette.borderDefault}`,
            color: palette.textPrimary,
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: { borderRight: `1px solid ${palette.borderDefault}` },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: typography.weights.semibold,
            fontSize: typography.sizes.bodyMD,
            minHeight: 48,
          },
        },
      },
      MuiTabs: {
        styleOverrides: {
          indicator: { backgroundColor: colors.brandPrimary, height: 3 },
        },
      },
    },
  };

  return createTheme(themeOptions);
}

/** Theme por defecto (light). Para reaccionar a la preferencia del user usar `buildMuiTheme(mode)`. */
export const muiTheme = buildMuiTheme('light');
