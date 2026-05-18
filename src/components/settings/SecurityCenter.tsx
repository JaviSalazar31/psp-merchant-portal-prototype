import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import ComputerOutlinedIcon from '@mui/icons-material/ComputerOutlined';
import LaptopMacOutlinedIcon from '@mui/icons-material/LaptopMacOutlined';
import PhoneIphoneOutlinedIcon from '@mui/icons-material/PhoneIphoneOutlined';
import LockResetIcon from '@mui/icons-material/LockReset';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import ChangePasswordModal from './ChangePasswordModal';
import TimeAgo from '@/components/common/TimeAgo';
import { useSecurityStore } from '@/stores/securityStore';
import { toast } from '@/stores/toastStore';
import { colors } from '@/theme/tokens';
import type { ActiveSession } from '@/mocks/security';

function DeviceIcon({ device, os }: { device: string; os: string }) {
  if (device === 'Mobile') return <PhoneIphoneOutlinedIcon sx={{ fontSize: 22 }} />;
  if (os.toLowerCase().includes('mac')) return <LaptopMacOutlinedIcon sx={{ fontSize: 22 }} />;
  return <ComputerOutlinedIcon sx={{ fontSize: 22 }} />;
}

function fmtDateTime(d: Date): string {
  const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  const day = d.getDate().toString().padStart(2, '0');
  const hour = d.getHours().toString().padStart(2, '0');
  const minute = d.getMinutes().toString().padStart(2, '0');
  return `${day} ${months[d.getMonth()]} ${hour}:${minute}`;
}

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
  const passwordLastChangedAt = useSecurityStore(s => s.passwordLastChangedAt);
  const activeSessions = useSecurityStore(s => s.activeSessions);
  const loginActivity = useSecurityStore(s => s.loginActivity);
  const revokeSession = useSecurityStore(s => s.revokeSession);
  const revokeAllOtherSessions = useSecurityStore(s => s.revokeAllOtherSessions);

  const [pwdOpen, setPwdOpen] = useState(false);
  const [confirmRevoke, setConfirmRevoke] = useState<ActiveSession | null>(null);
  const [confirmRevokeAll, setConfirmRevokeAll] = useState(false);

  const otherSessionsCount = activeSessions.filter(s => !s.isCurrent).length;

  const handleConfirmRevoke = async () => {
    if (!confirmRevoke) return;
    const target = confirmRevoke;
    setConfirmRevoke(null);
    await revokeSession(target.id);
    toast.success(`Sesión en ${target.browser} (${target.city}) cerrada.`);
  };

  const handleConfirmRevokeAll = async () => {
    setConfirmRevokeAll(false);
    const removed = await revokeAllOtherSessions();
    if (removed > 0) {
      toast.success(
        `Se cerraron ${removed} ${removed === 1 ? 'sesión' : 'sesiones'} en otros dispositivos.`,
      );
    } else {
      toast.info('No había otras sesiones para cerrar.');
    }
  };

  return (
    <Stack spacing={3}>
      <Stack spacing={0.5}>
        <Typography variant="h1">Centro de Seguridad</Typography>
        <Typography variant="body1" color="text.secondary">
          Configurá las opciones de seguridad de tu cuenta.
        </Typography>
      </Stack>

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
          <Button variant="outlined" onClick={() => setPwdOpen(true)}>
            Cambiar contraseña
          </Button>
        </Stack>
      </CardSection>

      <CardSection title="Autenticación de dos factores (2FA)">
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', sm: 'center' }}
        >
          <Stack spacing={0.5} sx={{ flex: 1 }}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                Verificación en dos pasos
              </Typography>
              <Chip
                label="Próximamente"
                size="small"
                sx={{
                  backgroundColor: colors.bannerInfo.bg,
                  color: colors.bannerInfo.fg,
                  fontWeight: 600,
                }}
              />
            </Stack>
            <Typography variant="body2" color="text.secondary">
              Agregá una capa extra de seguridad a tu cuenta. Te vamos a pedir un código de tu
              app autenticadora cada vez que inicies sesión.
            </Typography>
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

      <CardSection
        title="Sesiones activas"
        description="Dispositivos donde tu cuenta está conectada actualmente."
      >
        <Stack spacing={1.25} divider={<Divider flexItem />}>
          {activeSessions.map(session => (
            <Stack
              key={session.id}
              direction={{ xs: 'column', sm: 'row' }}
              spacing={1.5}
              alignItems={{ xs: 'flex-start', sm: 'center' }}
              justifyContent="space-between"
              sx={{ paddingY: 1 }}
            >
              <Stack direction="row" alignItems="center" spacing={1.5} sx={{ flex: 1, minWidth: 0 }}>
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
                    flexShrink: 0,
                  }}
                >
                  <DeviceIcon device={session.device} os={session.os} />
                </Box>
                <Stack spacing={0.25} sx={{ minWidth: 0 }}>
                  <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {session.browser} · {session.os}
                    </Typography>
                    {session.isCurrent && (
                      <Chip
                        label="Sesión actual"
                        size="small"
                        sx={{
                          backgroundColor: colors.bannerSuccess.bg,
                          color: colors.bannerSuccess.fg,
                          fontWeight: 600,
                        }}
                      />
                    )}
                  </Stack>
                  <Typography variant="caption" color="text.secondary">
                    {session.city} · IP {session.ipMasked}
                  </Typography>
                  <Stack direction="row" spacing={0.5} alignItems="baseline">
                    <Typography variant="caption" color="text.secondary">
                      Última actividad:
                    </Typography>
                    <TimeAgo
                      date={session.lastActivityAt}
                      variant="caption"
                      sx={{ color: colors.textSecondary }}
                    />
                  </Stack>
                </Stack>
              </Stack>
              {!session.isCurrent && (
                <Button
                  size="small"
                  variant="text"
                  color="error"
                  onClick={() => setConfirmRevoke(session)}
                >
                  Cerrar sesión
                </Button>
              )}
            </Stack>
          ))}
        </Stack>
        {otherSessionsCount > 0 && (
          <Box sx={{ pt: 1 }}>
            <Button
              variant="outlined"
              color="error"
              size="small"
              onClick={() => setConfirmRevokeAll(true)}
            >
              Cerrar todas las otras sesiones
            </Button>
          </Box>
        )}
      </CardSection>

      <CardSection
        title="Historial de actividad"
        description="Últimos accesos a tu cuenta."
      >
        <TableContainer
          sx={{
            border: `1px solid ${colors.borderDefault}`,
            borderRadius: 1.5,
            overflow: 'auto',
          }}
        >
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: colors.bgSubtle }}>
                <TableCell
                  sx={{
                    fontSize: 11,
                    letterSpacing: 0.5,
                    color: colors.textSecondary,
                    fontWeight: 700,
                  }}
                >
                  FECHA
                </TableCell>
                <TableCell
                  sx={{
                    fontSize: 11,
                    letterSpacing: 0.5,
                    color: colors.textSecondary,
                    fontWeight: 700,
                  }}
                >
                  ORIGEN
                </TableCell>
                <TableCell
                  sx={{
                    fontSize: 11,
                    letterSpacing: 0.5,
                    color: colors.textSecondary,
                    fontWeight: 700,
                  }}
                >
                  DISPOSITIVO
                </TableCell>
                <TableCell
                  sx={{
                    fontSize: 11,
                    letterSpacing: 0.5,
                    color: colors.textSecondary,
                    fontWeight: 700,
                  }}
                  align="right"
                >
                  RESULTADO
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loginActivity.map(entry => (
                <TableRow key={entry.id} hover>
                  <TableCell sx={{ fontSize: 13 }}>{fmtDateTime(entry.timestamp)}</TableCell>
                  <TableCell sx={{ fontSize: 13 }}>
                    <Stack spacing={0.25}>
                      <Typography variant="body2" sx={{ fontSize: 13 }}>
                        {entry.city}
                      </Typography>
                      <Typography variant="caption" sx={{ color: colors.textMuted, fontFamily: 'monospace' }}>
                        {entry.ipMasked}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell sx={{ fontSize: 13 }}>
                    {entry.browser} · {entry.os}
                  </TableCell>
                  <TableCell align="right">
                    <Chip
                      label={entry.result === 'success' ? 'Éxito' : 'Fallido'}
                      size="small"
                      sx={{
                        backgroundColor:
                          entry.result === 'success'
                            ? colors.bannerSuccess.bg
                            : colors.bannerError.bg,
                        color:
                          entry.result === 'success'
                            ? colors.bannerSuccess.fg
                            : colors.bannerError.fg,
                        fontWeight: 600,
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardSection>

      <ChangePasswordModal open={pwdOpen} onClose={() => setPwdOpen(false)} />

      <ConfirmDialog
        open={!!confirmRevoke}
        title="¿Cerrar sesión?"
        description={
          confirmRevoke ? (
            <span>
              Vas a cerrar la sesión de{' '}
              <strong>
                {confirmRevoke.browser} en {confirmRevoke.os}
              </strong>{' '}
              ({confirmRevoke.city}). El usuario tendrá que volver a iniciar sesión.
            </span>
          ) : (
            ''
          )
        }
        confirmLabel="Sí, cerrar sesión"
        confirmColor="error"
        onConfirm={handleConfirmRevoke}
        onCancel={() => setConfirmRevoke(null)}
      />

      <ConfirmDialog
        open={confirmRevokeAll}
        title="¿Cerrar todas las otras sesiones?"
        description={
          <span>
            Vas a cerrar <strong>{otherSessionsCount}</strong>{' '}
            {otherSessionsCount === 1 ? 'sesión' : 'sesiones'} activas en otros dispositivos. Tu
            sesión actual no se verá afectada.
          </span>
        }
        confirmLabel="Sí, cerrar todas"
        confirmColor="error"
        onConfirm={handleConfirmRevokeAll}
        onCancel={() => setConfirmRevokeAll(false)}
      />
    </Stack>
  );
}

export default SecurityCenter;
