import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useWebhooksStore } from '@/stores/webhooksStore';
import { toast } from '@/stores/toastStore';
import {
  ALL_WEBHOOK_EVENTS,
  WEBHOOK_EVENT_LABELS,
  type MockWebhook,
  type WebhookEventKey,
} from '@/mocks/webhooks';
import { colors } from '@/theme/tokens';

interface Props {
  open: boolean;
  /** Si viene un webhook, el modal se comporta como edición; si es null, es alta. */
  webhook: MockWebhook | null;
  onClose: () => void;
}

const HTTPS_REGEX = /^https:\/\/.+/i;

export function CreateWebhookModal({ open, webhook, onClose }: Props) {
  const createWebhook = useWebhooksStore(s => s.createWebhook);
  const updateWebhook = useWebhooksStore(s => s.updateWebhook);
  const saving = useWebhooksStore(s => s.saving);

  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [events, setEvents] = useState<WebhookEventKey[]>([]);
  const [urlTouched, setUrlTouched] = useState(false);

  useEffect(() => {
    if (!open) return;
    if (webhook) {
      setUrl(webhook.url);
      setDescription(webhook.description);
      setEvents(webhook.events);
    } else {
      setUrl('');
      setDescription('');
      setEvents(['transaction.authorized']);
    }
    setUrlTouched(false);
  }, [open, webhook]);

  const isEdit = !!webhook;
  const urlValid = HTTPS_REGEX.test(url);
  const canSubmit = urlValid && events.length > 0 && !saving;

  const toggleEvent = (event: WebhookEventKey, checked: boolean) => {
    setEvents(prev => (checked ? [...prev, event] : prev.filter(e => e !== event)));
  };

  const handleSubmit = async () => {
    if (!urlValid) {
      toast.error('La URL debe empezar con https://');
      return;
    }
    if (events.length === 0) {
      toast.error('Suscribite al menos a un evento.');
      return;
    }
    if (isEdit && webhook) {
      await updateWebhook(webhook.id, { url, description, events });
      toast.success('Webhook actualizado.');
    } else {
      await createWebhook({ url, description, events });
      toast.success('Webhook creado correctamente.');
    }
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{ paper: { sx: { borderRadius: 2, minWidth: { sm: 560 } } } }}
    >
      <DialogTitle sx={{ pr: 6 }}>
        {isEdit ? 'Editar webhook' : 'Agregar endpoint'}
        <IconButton aria-label="Cerrar" onClick={onClose} sx={{ position: 'absolute', right: 12, top: 12 }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2.5} sx={{ pt: 0.5 }}>
          <TextField
            label="URL del endpoint"
            value={url}
            onChange={e => {
              setUrl(e.target.value);
              setUrlTouched(true);
            }}
            disabled={saving}
            error={urlTouched && !urlValid}
            helperText={
              urlTouched && !urlValid
                ? 'Debe ser una URL https:// válida.'
                : 'Solo aceptamos endpoints sobre HTTPS.'
            }
            required
            placeholder="https://tu-dominio.com/webhooks/paynau"
          />

          <TextField
            label="Descripción"
            value={description}
            onChange={e => setDescription(e.target.value)}
            disabled={saving}
            multiline
            minRows={2}
            helperText="Opcional. Sirve para identificar el endpoint si tenés varios."
          />

          <Stack spacing={1}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              Eventos suscritos
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Vas a recibir un POST a tu endpoint cada vez que ocurra alguno de estos eventos.
            </Typography>
            <Box
              sx={{
                border: `1px solid ${colors.borderDefault}`,
                borderRadius: 1.5,
                paddingX: 1.5,
                paddingY: 1,
              }}
            >
              <Stack>
                {ALL_WEBHOOK_EVENTS.map(event => (
                  <FormControlLabel
                    key={event}
                    control={
                      <Checkbox
                        checked={events.includes(event)}
                        onChange={e => toggleEvent(event, e.target.checked)}
                        disabled={saving}
                        size="small"
                      />
                    }
                    label={
                      <Stack direction="row" spacing={1} alignItems="baseline">
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {WEBHOOK_EVENT_LABELS[event]}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ color: colors.textSecondary, fontFamily: 'monospace' }}
                        >
                          {event}
                        </Typography>
                      </Stack>
                    }
                  />
                ))}
              </Stack>
            </Box>
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} disabled={saving}>
          Cancelar
        </Button>
        <Button variant="contained" onClick={handleSubmit} disabled={!canSubmit}>
          {saving ? 'Guardando…' : isEdit ? 'Guardar cambios' : 'Crear webhook'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default CreateWebhookModal;
