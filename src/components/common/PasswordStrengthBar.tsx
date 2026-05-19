import { Box, LinearProgress, Stack, Typography } from '@mui/material';
import { DEFAULT_PASSWORD_RULES, type PasswordRule } from './PasswordChecklist';
import { colors } from '@/theme/tokens';

interface PasswordStrengthBarProps {
  password: string;
  rules?: PasswordRule[];
}

type StrengthLevel = 'weak' | 'medium' | 'strong' | 'very-strong';

interface LevelMeta {
  label: string;
  value: number;
  color: string;
}

const LEVELS: Record<StrengthLevel, LevelMeta> = {
  weak: { label: 'Débil', value: 25, color: '#DC2626' },
  medium: { label: 'Media', value: 50, color: '#F59E0B' },
  strong: { label: 'Fuerte', value: 75, color: '#2563EB' },
  'very-strong': { label: 'Muy fuerte', value: 100, color: '#10B981' },
};

function calculateLevel(password: string, rules: PasswordRule[]): StrengthLevel {
  // Solo las reglas obligatorias cuentan (excluye las informativas como "máximo 24").
  const requiredRules = rules.filter(r => r.variant !== 'info');
  const metCount = requiredRules.filter(r => r.test(password)).length;

  if (metCount <= 1) return 'weak';
  if (metCount <= 3) return 'medium';
  if (metCount < requiredRules.length) return 'strong';
  // Todas las reglas obligatorias cumplidas + longitud generosa = muy fuerte.
  return password.length >= 12 ? 'very-strong' : 'strong';
}

/**
 * Barra de fuerza de contraseña con cuatro niveles (Débil / Media / Fuerte / Muy fuerte).
 * Aplica en registro, recuperación de contraseña y cambio de contraseña en /security.
 */
export function PasswordStrengthBar({
  password,
  rules = DEFAULT_PASSWORD_RULES,
}: PasswordStrengthBarProps) {
  if (!password) return null;

  const level = calculateLevel(password, rules);
  const meta = LEVELS[level];

  return (
    <Stack spacing={0.5} sx={{ paddingY: 0.5 }}>
      <Box sx={{ position: 'relative' }}>
        <LinearProgress
          variant="determinate"
          value={meta.value}
          sx={{
            height: 6,
            borderRadius: 999,
            backgroundColor: colors.borderDefault,
            '& .MuiLinearProgress-bar': {
              backgroundColor: meta.color,
              borderRadius: 999,
              transition: 'transform 200ms ease, background-color 200ms ease',
            },
          }}
        />
      </Box>
      <Stack direction="row" justifyContent="space-between" alignItems="baseline">
        <Typography
          variant="caption"
          sx={{ color: colors.textSecondary, fontWeight: 500 }}
        >
          Seguridad de la contraseña
        </Typography>
        <Typography
          variant="caption"
          sx={{ color: meta.color, fontWeight: 700, letterSpacing: 0.2 }}
        >
          {meta.label}
        </Typography>
      </Stack>
    </Stack>
  );
}

export default PasswordStrengthBar;
