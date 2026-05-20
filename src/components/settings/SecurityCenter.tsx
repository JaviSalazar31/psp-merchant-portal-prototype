import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockResetIcon from '@mui/icons-material/LockReset';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import ChangePasswordInline from './ChangePasswordInline';
import TimeAgo from '@/components/common/TimeAgo';
import { useAuthStore } from '@/stores/authStore';
import { useSecurityStore } from '@/stores/securityStore';
import { colors } from '@/theme/tokens';

function CardSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
        <Stack spacing={2.5}>
          <Stack spacing={0.5}>
            <Typography variant="h4">{title}</Typography>
            {description && (
              <Typography variant="body2" color="text.secondary">
                {description}
              </Typography>
            )}
          </Stack>
          {children}
        </Stack>
      </CardContent>
    </Card>
  );
}

export function SecurityCenter() {
  const user = useAuthStore(s => s.user);
  const passwordLastChangedAt = useSecurityStore(s => s.passwordLastChangedAt);
  const [pwdOpen, setPwdOpen] = useState(false);

  return (
    <Stack spacing={3}>
      <Stack spacing={0.5}>
        <Typography variant="h1">Centro de Seguridad</Typography>
        <Typography variant="body1" color="text.secondary">
          Configurá las opciones de seguridad de tu cuenta.
        </Typography>
      </Stack>

      <CardSection title="Email" description="El correo asociado a tu cuenta. Si necesitás cambiarlo, contactá a soporte.">
        <Tooltip title="Para cambios, contactá a soporte" placement="top-start">
          <Stack
            direction="row"
            alignItems="center"
            spacing={1.5}
            sx={{ backgroundColor: '#F5F5F5', borderRadius: 1.5, paddingX: 2, paddingY: 1.5 }}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                backgroundColor: colors.bgCard,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: colors.textSecondary,
              }}
            >
              <EmailOutlinedIcon />
            </Box>
            <Stack spacing={0.25}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {user?.email ?? '—'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Solo lectura
              </Typography>
            </Stack>
          </Stack>
        </Tooltip>
      </CardSection>

      <CardSection title="Autenticación de dos factores (2FA)">
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', sm: 'center' }}
        >
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ flex: 1 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                backgroundColor: colors.bgSubtle,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: colors.textSecondary,
              }}
            >
              <ShieldOutlinedIcon />
            </Box>
            <Stack spacing={0.5} sx={{ flex: 1 }}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  Verificación en dos pasos
                </Typography>
                <Chip
                  label="Próximamente disponible"
                  size="small"
                  sx={{
                    backgroundColor: colors.bgSubtle,
                    color: colors.textSecondary,
                    fontWeight: 600,
                  }}
                />
              </Stack>
              <Typography variant="body2" color="text.secondary">
                Agregá una capa extra de seguridad a tu cuenta. Te vamos a pedir un código de tu
                app autenticadora cada vez que inicies sesión.
              </Typography>
            </Stack>
          </Stack>
          <Tooltip title="Disponible en la próxima versión." placement="top">
            <span>
              <Button variant="outlined" disabled>
                Activar 2FA
              </Button>
            </span>
          </Tooltip>
        </Stack>
      </CardSection>

      <CardSection title="Contraseña" description="Recomendamos cambiarla cada 90 días.">
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', sm: 'center' }}
        >
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                backgroundColor: colors.bgSubtle,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: colors.textSecondary,
              }}
            >
              <LockResetIcon />
            </Box>
            <Stack spacing={0.25}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                Contraseña
              </Typography>
              <Stack direction="row" spacing={0.5} alignItems="baseline">
                <Typography variant="caption" color="text.secondary">
                  Último cambio:
                </Typography>
                <TimeAgo
                  date={passwordLastChangedAt}
                  variant="caption"
                  sx={{ color: colors.textSecondary }}
                />
              </Stack>
            </Stack>
          </Stack>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setPwdOpen(o => !o)}
            aria-expanded={pwdOpen}
          >
            {pwdOpen ? 'Cancelar cambio' : 'Cambiar contraseña'}
          </Button>
        </Stack>
        <ChangePasswordInline open={pwdOpen} onClose={() => setPwdOpen(false)} />
      </CardSection>
    </Stack>
  );
}

export default SecurityCenter;
