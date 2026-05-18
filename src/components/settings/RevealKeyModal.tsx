import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ContextBanner from '@/components/common/ContextBanner';
import { toast } from '@/stores/toastStore';
import { colors } from '@/theme/tokens';
import type { MockApiKey } from '@/mocks/apiKeys';

interface Props {
  open: boolean;
  apiKey: MockApiKey | null;
  /** Si la key fue recién creada o rotada, el banner cambia el wording. */
  reason: 'new' | 'rotated' | 'reveal';
  onClose: () => void;
}

const TITLE: Record<Props['reason'], string> = {
  new: 'API Key creada correctamente',
  rotated: 'API Key rotada correctamente',
  reveal: 'Mostrar API Key',
};

const BANNER_BODY: Record<Props['reason'], string> = {
  new: 'Esta key te la mostramos solo una vez. Guardala en un lugar seguro — si la perdés, vas a tener que rotarla.',
  rotated:
    'La key anterior fue revocada. Esta nueva te la mostramos solo una vez — copiala antes de cerrar este diálogo.',
  reveal:
    'Por seguridad, normalmente mostramos solo el sufijo. Acá tenés la key completa — no la compartas por canales inseguros.',
};

export function RevealKeyModal({ open, apiKey, reason, onClose }: Props) {
  if (!apiKey) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(apiKey.fullKey);
      toast.success('Key copiada al portapapeles.');
    } catch {
      toast.error('No se pudo copiar. Seleccioná y copiá manualmente.');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth slotProps={{ paper: { sx: { borderRadius: 2, minWidth: { sm: 540 } } } }}>
      <DialogTitle sx={{ pr: 6 }}>
        {TITLE[reason]}
        <IconButton aria-label="Cerrar" onClick={onClose} sx={{ position: 'absolute', right: 12, top: 12 }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 0.5 }}>
          <ContextBanner variant={reason === 'reveal' ? 'info' : 'warning'}>
            {BANNER_BODY[reason]}
          </ContextBanner>

          <Stack spacing={0.5}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
              {apiKey.name} — {apiKey.type === 'publishable' ? 'Publishable' : apiKey.type === 'secret' ? 'Secret' : 'Restricted'}
            </Typography>
            <Box
              sx={{
                borderRadius: 1.5,
                border: `1px solid ${colors.borderDefault}`,
                backgroundColor: colors.bgSubtle,
                paddingX: 1.5,
                paddingY: 1.25,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <Box
                component="code"
                sx={{
                  flex: 1,
                  fontFamily: 'monospace',
                  fontSize: 13,
                  color: colors.textPrimary,
                  wordBreak: 'break-all',
                }}
              >
                {apiKey.fullKey}
              </Box>
              <Tooltip title="Copiar">
                <IconButton onClick={handleCopy} size="small">
                  <ContentCopyIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button variant="outlined" onClick={handleCopy}>
          Copiar
        </Button>
        <Button variant="contained" onClick={onClose}>
          Listo, la guardé
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default RevealKeyModal;
