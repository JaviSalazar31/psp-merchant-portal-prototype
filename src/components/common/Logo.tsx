import { Box } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import type { ResponsiveStyleValue } from '@mui/system';
import { colors } from '@/theme/tokens';

interface LogoProps {
  width?: ResponsiveStyleValue<number | string>;
  color?: string;
  accentColor?: string;
  variant?: 'default' | 'inverse';
  sx?: SxProps<Theme>;
}

/**
 * Wordmark "paynau" con acento verde brand.
 * Inspirado en la captura 42 — lowercase con un punto/dot verde brand sobre la 'y'.
 */
export function Logo({
  width = 120,
  color,
  accentColor = colors.brandPrimary,
  variant = 'default',
  sx,
}: LogoProps) {
  const textColor = color ?? (variant === 'inverse' ? colors.textInverse : colors.brandDarkest);

  return (
    <Box
      component="svg"
      viewBox="0 0 240 64"
      sx={{ width, height: 'auto', display: 'block', ...sx }}
      role="img"
      aria-label="Paynau"
    >
      <text
        x="0"
        y="46"
        fontFamily='"Inter", -apple-system, sans-serif'
        fontWeight="700"
        fontSize="44"
        letterSpacing="-2"
        fill={textColor}
      >
        paynau
      </text>
      {/* Dot acento verde brand sobre la 'y' */}
      <circle cx="84" cy="14" r="7" fill={accentColor} />
    </Box>
  );
}

export default Logo;
