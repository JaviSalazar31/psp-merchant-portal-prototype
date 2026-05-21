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
 * Logo PSP — Payment Service Provider.
 *
 * Rediseñado 21/05 con foco en presencia visual y aspecto fintech moderno:
 * - Símbolo geométrico a la izquierda: dos flechas opuestas en gradient
 *   que representan el flujo bidireccional de pagos (pay-in / pay-out).
 * - Wordmark "PSP" con gradient vertical sutil (oscuro → más oscuro) para
 *   dar profundidad sin perder legibilidad en sizes chicos.
 * - Dot acento verde brand sobre la última "P" con glow suave que aporta
 *   personalidad sin ser invasivo.
 *
 * El componente es 100% SVG inline (sin imágenes externas), escalable
 * a cualquier tamaño y soporta variante "inverse" para fondos oscuros.
 */
export function Logo({
  width = 110,
  color,
  accentColor = colors.brandPrimary,
  variant = 'default',
  sx,
}: LogoProps) {
  const textColor = color ?? (variant === 'inverse' ? colors.textInverse : colors.brandDarkest);
  const isInverse = variant === 'inverse';

  // IDs únicos por instancia para evitar colisiones de defs si hay múltiples logos.
  const idPrefix = `psp-logo-${Math.random().toString(36).slice(2, 8)}`;
  const textGradId = `${idPrefix}-text`;
  const symbolGradId = `${idPrefix}-symbol`;
  const glowId = `${idPrefix}-glow`;

  return (
    <Box
      component="svg"
      viewBox="0 0 168 52"
      sx={{ width, height: 'auto', display: 'block', ...sx }}
      role="img"
      aria-label="PSP — Payment Service Provider"
    >
      <defs>
        {/* Gradient vertical del wordmark: top más claro, bottom más oscuro */}
        <linearGradient id={textGradId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={textColor} stopOpacity={isInverse ? 1 : 0.95} />
          <stop offset="100%" stopColor={textColor} stopOpacity={1} />
        </linearGradient>

        {/* Gradient del símbolo geométrico: verde brand → verde más oscuro */}
        <linearGradient id={symbolGradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={accentColor} />
          <stop offset="100%" stopColor={colors.brandPrimaryDark} />
        </linearGradient>

        {/* Glow filter sutil para el dot accent */}
        <filter id={glowId} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Símbolo geométrico: dos chevrons opuestos representando flujo bidireccional */}
      <g transform="translate(2, 12)">
        {/* Chevron superior apuntando a la derecha */}
        <path
          d="M 0 4 L 10 4 L 16 10 L 10 16 L 0 16 L 6 10 Z"
          fill={`url(#${symbolGradId})`}
          opacity="0.95"
        />
        {/* Chevron inferior apuntando a la izquierda */}
        <path
          d="M 22 14 L 12 14 L 6 20 L 12 26 L 22 26 L 16 20 Z"
          fill={`url(#${symbolGradId})`}
          opacity="0.75"
        />
      </g>

      {/* Wordmark "PSP" con gradient */}
      <text
        x="42"
        y="42"
        fontFamily='"Inter", -apple-system, sans-serif'
        fontWeight="800"
        fontSize="44"
        letterSpacing="-1.5"
        fill={`url(#${textGradId})`}
      >
        PSP
      </text>

      {/* Dot acento con glow suave anclado sobre la última 'P' */}
      <circle
        cx="138"
        cy="11"
        r="5.5"
        fill={accentColor}
        filter={`url(#${glowId})`}
      />
      {/* Refuerzo del dot sin filter para que el centro quede nítido */}
      <circle cx="138" cy="11" r="4" fill={accentColor} />
    </Box>
  );
}

export default Logo;
