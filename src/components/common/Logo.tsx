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
 * Wordmark "PSP" — Payment Service Provider. El dot verde brand se ancla a la esquina
 * superior derecha de la última "P", como parte del wordmark (no flotando suelto).
 */
export function Logo({
  width = 84,
  color,
  accentColor = colors.brandPrimary,
  variant = 'default',
  sx,
}: LogoProps) {
  const textColor = color ?? (variant === 'inverse' ? colors.textInverse : colors.brandDarkest);

  return (
    <Box
      component="svg"
      viewBox="0 0 118 52"
      sx={{ width, height: 'auto', display: 'block', ...sx }}
      role="img"
      aria-label="PSP"
    >
      <text
        x="2"
        y="42"
        fontFamily='"Inter", -apple-system, sans-serif'
        fontWeight="800"
        fontSize="44"
        letterSpacing="-1"
        fill={textColor}
      >
        PSP
      </text>
      {/* Dot acento anclado sobre el trazo vertical de la última 'P', como un acento tipográfico. */}
      <circle cx="92" cy="11" r="5.5" fill={accentColor} />
    </Box>
  );
}

export default Logo;
