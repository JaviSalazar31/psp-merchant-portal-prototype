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
 * Wordmark "PSP" — Payment Service Provider. Mayúsculas con un dot verde brand como acento
 * en la esquina superior derecha. Reemplaza al wordmark "paynau" de la primera versión del
 * prototipo: el portal tiene identidad propia dentro del grupo.
 */
export function Logo({
  width = 96,
  color,
  accentColor = colors.brandPrimary,
  variant = 'default',
  sx,
}: LogoProps) {
  const textColor = color ?? (variant === 'inverse' ? colors.textInverse : colors.brandDarkest);

  return (
    <Box
      component="svg"
      viewBox="0 0 200 64"
      sx={{ width, height: 'auto', display: 'block', ...sx }}
      role="img"
      aria-label="PSP"
    >
      <text
        x="0"
        y="48"
        fontFamily='"Inter", -apple-system, sans-serif'
        fontWeight="800"
        fontSize="48"
        letterSpacing="-1"
        fill={textColor}
      >
        PSP
      </text>
      {/* Dot acento verde brand sobre la 'P' final */}
      <circle cx="170" cy="16" r="7" fill={accentColor} />
    </Box>
  );
}

export default Logo;
