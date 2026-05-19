import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Stack,
  Typography,
} from '@mui/material';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import { colors } from '@/theme/tokens';

interface InactivityModalProps {
  open: boolean;
  remainingSeconds: number;
  onStay: () => void;
  onLogout: () => void;
}

function formatMmSs(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

/**
 * Modal compacto que avisa al usuario que su sesión está por expirar por inactividad.
 * Muestra un countdown MM:SS y dos acciones: seguir conectado / cerrar sesión ahora.
 */
export function InactivityModal({ open, remainingSeconds, onStay, onLogout }: InactivityModalProps) {
  return (
    <Dialog
      open={open}
      onClose={() => {
        /* deliberadamente vacío: el usuario debe decidir explícitamente */
      }}
      disableEscapeKeyDown
      slotProps={{
        paper: {
          sx: {
            borderRadius: 2,
            maxWidth: 380,
            width: '100%',
            padding: 0,
          },
        },
      }}
    >
      <DialogContent sx={{ pt: 3, pb: 1.5, px: 3, textAlign: 'center' }}>
        <Stack spacing={1.5} alignItems="center">
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              backgroundColor: colors.bannerWarning.bg,
              color: colors.bannerWarning.fg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <AccessTimeRoundedIcon sx={{ fontSize: 32 }} />
          </Box>

          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Tu sesión expirará por inactividad
          </Typography>

          <Typography variant="body2" color="text.secondary">
            ¿Deseas continuar?
          </Typography>

          <Typography
            variant="h3"
            sx={{
              fontFamily: 'monospace',
              fontWeight: 700,
              fontSize: 28,
              color: colors.textPrimary,
              letterSpacing: 1,
              paddingTop: 0.5,
            }}
            aria-live="polite"
          >
            {formatMmSs(remainingSeconds)}
          </Typography>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3, pt: 1, flexDirection: 'column', gap: 1 }}>
        <Button
          variant="contained"
          fullWidth
          onClick={onStay}
          sx={{
            backgroundColor: colors.brandPrimary,
            color: colors.brandDarkest,
            fontWeight: 700,
            '&:hover': { backgroundColor: '#5DE82A' },
          }}
        >
          Sí, seguir conectado
        </Button>
        <Button variant="text" fullWidth onClick={onLogout} sx={{ color: colors.textSecondary }}>
          Cerrar sesión ahora
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default InactivityModal;
