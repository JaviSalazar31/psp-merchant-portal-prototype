import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import LockResetIcon from '@mui/icons-material/LockReset';
import ChangePasswordInline from './ChangePasswordInline';
import RolesList from '@/components/roles/RolesList';
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

      <CardSection title="Email" description="El correo asociado a tu cuenta.">
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
          <Stack spacing={0.25} sx={{ flex: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {user?.email ?? '—'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Solo lectura
            </Typography>
          </Stack>
          <Tooltip
            title="Por seguridad, el cambio de email debe solicitarse a soporte"
            placement="top-end"
          >
            <InfoOutlinedIcon
              sx={{ fontSize: 18, color: colors.textMuted, cursor: 'help' }}
              aria-label="Información sobre cambio de email"
            />
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

      <CardSection
        title="Roles disponibles"
        description="Información sobre los tipos de rol que existen en el portal y qué permisos tiene cada uno. Esta sección es consultiva: la asignación de roles a usuarios se hace desde Configuración → Usuarios."
      >
        <RolesList />
      </CardSection>
    </Stack>
  );
}

export default SecurityCenter;
