import { Box, Button, Dialog, DialogContent, IconButton, Stack, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { colors } from '@/theme/tokens';

interface SolicitudEnviadaModalProps {
  open: boolean;
  onClose: () => void;
}

export function SolicitudEnviadaModal({ open, onClose }: SolicitudEnviadaModalProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      slotProps={{ paper: { sx: { borderRadius: 2 } } }}
    >
      <IconButton
        onClick={onClose}
        sx={{ position: 'absolute', right: 12, top: 12 }}
        size="small"
      >
        <CloseIcon fontSize="small" />
      </IconButton>
      <DialogContent sx={{ pt: 5, pb: 4 }}>
        <Stack spacing={2.5} alignItems="center" textAlign="center">
          <Box
            sx={{
              width: 72,
              height: 72,
              borderRadius: '50%',
              backgroundColor: colors.bannerSuccess.bg,
              color: colors.pwReqMet,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CheckCircleIcon sx={{ fontSize: 44 }} />
          </Box>
          <Typography variant="h2">¡Solicitud Enviada!</Typography>
          <Typography variant="body1" color="text.secondary">
            La solicitud de onboarding para tu empresa fue recibida correctamente. Nuestro equipo la revisará
            manualmente y te contactaremos pronto.
          </Typography>
          <Button variant="contained" color="primary" fullWidth onClick={onClose}>
            Volver al inicio
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}

export default SolicitudEnviadaModal;
