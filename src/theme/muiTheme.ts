import { createTheme, type ThemeOptions } from '@mui/material/styles';
import { colors, typography, radius, shadows, breakpoints } from './tokens';

const themeOptions: ThemeOptions = {
  palette: {
    mode: 'light',
    primary: {
      main: colors.brandDarkest,
      contrastText: colors.textInverse,
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
      default: colors.bgPage,
      paper: colors.bgCard,
    },
    text: {
      primary: colors.textPrimary,
      secondary: colors.textSecondary,
      disabled: colors.textMuted,
    },
    divider: colors.borderDefault,
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
        body: { backgroundColor: colors.bgPage, color: colors.textPrimary },
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
          backgroundColor: colors.brandDarkest,
          color: colors.textInverse,
          '&:hover': { backgroundColor: '#1B2030' },
          '&.Mui-disabled': { backgroundColor: colors.brandDarkest, color: colors.textInverse, opacity: 0.5 },
        },
        outlined: {
          borderColor: colors.borderStrong,
          color: colors.textPrimary,
          '&:hover': { borderColor: colors.brandDarkest, backgroundColor: colors.bgSubtle },
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
          backgroundColor: colors.bgCard,
          '& fieldset': { borderColor: colors.borderDefault },
          '&:hover fieldset': { borderColor: colors.borderStrong },
          '&.Mui-focused fieldset': { borderColor: colors.borderFocus, borderWidth: 2 },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontSize: typography.sizes.bodyMD,
          color: colors.textSecondary,
          '&.Mui-focused': { color: colors.brandDarkest },
        },
      },
    },
    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          borderRadius: radius.lg,
          border: `1px solid ${colors.borderDefault}`,
          backgroundColor: colors.bgCard,
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
          backgroundColor: colors.bgCard,
          borderBottom: `1px solid ${colors.borderDefault}`,
          color: colors.textPrimary,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: { borderRight: `1px solid ${colors.borderDefault}` },
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

export const muiTheme = createTheme(themeOptions);
