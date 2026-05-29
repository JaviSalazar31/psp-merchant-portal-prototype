import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import MarkEmailReadOutlinedIcon from '@mui/icons-material/MarkEmailReadOutlined';
import { colors } from '@/theme/tokens';
import { toast } from '@/stores/toastStore';

export type LockoutType = 'now' | 'persistent';

interface LockoutDialogProps {
  open: boolean;
  type: LockoutType;
  lockedUntil?: number;
  onClose: () => void;
}

function formatCountdown(msRemaining: number): string {
  const total = Math.max(0, Math.floor(msRemaining / 1000));
  const mm = Math.floor(total / 60).toString().padStart(2, '0');
  const ss = (total % 60).toString().padStart(2, '0');
  return `${mm}:${ss}`;
}

export function LockoutDialog({ open, type, lockedUntil, onClose }: LockoutDialogProps) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    if (!open || type !== 'now') return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [open, type]);

  const remaining = lockedUntil ? Math.max(0, lockedUntil - now) : 0;
  const isPersistent = type === 'persistent';

  const handleClose = () => {
    if (isPersistent) {
      toast.success('Te enviamos un correo con instrucciones para desbloquear tu cuenta.');
    }
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
      slotProps={{ paper: { sx: { borderRadius: 2 } } }}
    >
      <DialogTitle sx={{ pt: 3, pb: 1 }}>
        <Stack spacing={1.5} alignItems="center" textAlign="center">
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              backgroundColor: colors.bannerError.bg,
              color: colors.bannerError.fg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {isPersistent ? (
              <MarkEmailReadOutlinedIcon sx={{ fontSize: 28 }} />
            ) : (
              <LockOutlinedIcon sx={{ fontSize: 28 }} />
            )}
          </Box>
          <Typography variant="h3">
            {isPersistent ? 'Cuenta bloqueada' : 'Cuenta bloqueada temporalmente'}
          </Typography>
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ pb: 1 }}>
        <Stack spacing={2} alignItems="center" textAlign="center">
          {isPersistent ? (
            <Typography variant="body1" color="text.secondary">
              Por motivos de seguridad bloqueamos tu cuenta. Te enviamos un correo con instrucciones para
              desbloquearla.
            </Typography>
          ) : (
            <>
              <Typography variant="body1" color="text.secondary">
                Por seguridad, tu cuenta está bloqueada por 5 minutos.
              </Typography>
              <Box
                sx={{
                  fontFamily: '"Inter", monospace',
                  fontSize: 36,
                  fontWeight: 700,
                  letterSpacing: 2,
                  color: colors.brandDarkest,
                  paddingX: 3,
                  paddingY: 1.5,
                  backgroundColor: colors.bgSubtle,
                  borderRadius: 1.5,
                  border: `1px solid ${colors.borderDefault}`,
                }}
              >
                {formatCountdown(remaining)}
              </Box>
              <Typography variant="caption" color="text.secondary">
                Vas a poder reintentar cuando el contador llegue a 00:00.
              </Typography>
            </>
          )}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, pt: 1 }}>
        {isPersistent ? (
          // Bloqueo persistente: no hay contador que destrabe. La recuperación
          // es la única salida real → acción primaria.
          <Stack spacing={1} sx={{ width: '100%' }}>
            <Button
              component={RouterLink}
              to="/password-reset"
              variant="contained"
              color="primary"
              onClick={handleClose}
              fullWidth
            >
              Recuperar contraseña
            </Button>
            <Button variant="text" color="inherit" onClick={handleClose} fullWidth>
              Cerrar
            </Button>
          </Stack>
        ) : (
          // Bloqueo temporal: el camino primario es esperar el contador.
          // Recuperar es secundario (por si no recuerda la clave).
          <Stack spacing={1} sx={{ width: '100%' }}>
            <Button variant="contained" color="primary" onClick={handleClose} fullWidth>
              Entendido
            </Button>
            <Button
              component={RouterLink}
              to="/password-reset"
              variant="text"
              color="inherit"
              onClick={handleClose}
              fullWidth
            >
              ¿Olvidaste tu contraseña? Recuperala
            </Button>
          </Stack>
        )}
      </DialogActions>
    </Dialog>
  );
}

export default LockoutDialog;
