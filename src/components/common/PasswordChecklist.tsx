import { Box, Stack, Typography } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { colors } from '@/theme/tokens';

export interface PasswordRule {
  label: string;
  test: (pw: string) => boolean;
  /** Si es 'info', cuando no se cumple se muestra en gris/ⓘ en vez de amarillo/⚠ */
  variant?: 'rule' | 'info';
}

export const DEFAULT_PASSWORD_RULES: PasswordRule[] = [
  { label: 'Mínimo 8 caracteres', test: pw => pw.length >= 8 },
  { label: 'Al menos 1 número', test: pw => /[0-9]/.test(pw) },
  { label: 'Al menos 1 carácter especial (!@#$...)', test: pw => /[!@#$%^&*(),.?":{}|<>_\-+=/\\\[\];'`~]/.test(pw) },
  { label: 'Al menos 1 letra minúscula', test: pw => /[a-z]/.test(pw) },
  { label: 'Al menos 1 letra mayúscula', test: pw => /[A-Z]/.test(pw) },
  // Adenda v1 — Cambio 3: tope máximo 24 caracteres (informativo, ícono ⓘ no rojo).
  { label: 'Máximo 24 caracteres', test: pw => pw.length <= 24, variant: 'info' },
];

interface PasswordChecklistProps {
  password: string;
  rules?: PasswordRule[];
}

export function isPasswordValid(password: string, rules: PasswordRule[] = DEFAULT_PASSWORD_RULES): boolean {
  if (!password) return false;
  return rules.every(rule => rule.test(password));
}

export function PasswordChecklist({ password, rules = DEFAULT_PASSWORD_RULES }: PasswordChecklistProps) {
  const hasInput = password.length > 0;

  return (
    <Stack spacing={0.5} sx={{ paddingY: 0.5 }}>
      {rules.map(rule => {
        const met = rule.test(password);
        const isInfo = rule.variant === 'info';
        let icon;
        let color: string;

        if (!hasInput) {
          icon = <FiberManualRecordIcon sx={{ fontSize: 12 }} />;
          color = colors.pwReqInitial;
        } else if (met) {
          icon = <CheckCircleIcon sx={{ fontSize: 16 }} />;
          color = colors.pwReqMet;
        } else if (isInfo) {
          icon = <InfoOutlinedIcon sx={{ fontSize: 16 }} />;
          color = colors.textSecondary;
        } else {
          icon = <WarningRoundedIcon sx={{ fontSize: 16 }} />;
          color = colors.pwReqPending;
        }

        return (
          <Stack key={rule.label} direction="row" spacing={1} alignItems="center">
            <Box sx={{ color, display: 'flex', alignItems: 'center', width: 16, justifyContent: 'center' }}>
              {icon}
            </Box>
            <Typography variant="caption" sx={{ color, fontWeight: 500 }}>
              {rule.label}
            </Typography>
          </Stack>
        );
      })}
    </Stack>
  );
}

export default PasswordChecklist;
