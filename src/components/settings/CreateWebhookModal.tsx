import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import WebhookTechnicalDetails from './WebhookTechnicalDetails';
import { useWebhooksStore } from '@/stores/webhooksStore';
import { toast } from '@/stores/toastStore';
import {
  ALL_WEBHOOK_EVENTS,
  WEBHOOK_EVENT_LABELS,
  type MockWebhook,
  type WebhookChannelType,
  type WebhookEventKey,
} from '@/mocks/webhooks';
import { colors } from '@/theme/tokens';

interface Props {
  open: boolean;
  /** Si viene un canal, el modal se comporta como edición; si es null, es alta. */
  webhook: MockWebhook | null;
  onClose: () => void;
}

const HTTPS_REGEX = /^https:\/\/.+/i;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function CreateWebhookModal({ open, webhook, onClose }: Props) {
  const createWebhook = useWebhooksStore(s => s.createWebhook);
  const updateWebhook = useWebhooksStore(s => s.updateWebhook);
  const saving = useWebhooksStore(s => s.saving);

  const [type, setType] = useState<WebhookChannelType>('callback');
  const [url, setUrl] = useState('');
  const [email, setEmail] = useState('');
  const [description, setDescription] = useState('');
  const [events, setEvents] = useState<WebhookEventKey[]>(['approved']);
  const [touched, setTouched] = useState(false);
  /** Secret revelado una única vez tras crear un canal callback. */
  const [createdSecret, setCreatedSecret] = useState<string | null>(null);

  const isEdit = !!webhook;

  useEffect(() => {
    if (!open) return;
    if (webhook) {
      setType(webhook.type);
      setUrl(webhook.url ?? '');
      setEmail(webhook.email ?? '');
      setDescription(webhook.description);
      setEvents(webhook.events);
    } else {
      setType('callback');
      setUrl('');
      setEmail('');
      setDescription('');
      setEvents(['approved']);
    }
    setTouched(false);
    setCreatedSecret(null);
  }, [open, webhook]);

  const urlValid = HTTPS_REGEX.test(url);
  const emailValid = EMAIL_REGEX.test(email);
  const destinationValid = type === 'callback' ? urlValid : emailValid;
  const canSubmit = destinationValid && events.length > 0 && !saving;

  const toggleEvent = (event: WebhookEventKey, checked: boolean) => {
    setEvents(prev => (checked ? [...prev, event] : prev.filter(e => e !== event)));
  };

  const handleSubmit = async () => {
    setTouched(true);
    if (!destinationValid || events.length === 0) return;

    if (isEdit && webhook) {
      await updateWebhook(webhook.id, {
        url: type === 'callback' ? url : undefined,
        email: type === 'email' ? email : undefined,
        description,
        events,
      });
      toast.success('Canal de notificación actualizado.');
      onClose();
      return;
    }

    const created = await createWebhook({ type, url, email, description, events });
    if (created.type === 'callback' && created.signingSecret) {
      setCreatedSecret(created.signingSecret);
    } else {
      toast.success('Canal de notificación creado.');
      onClose();
    }
  };

  const handleCopySecret = async () => {
    if (!createdSecret) return;
    try {
      await navigator.clipboard.writeText(createdSecret);
      toast.success('Secret copiado al portapapeles.');
    } catch {
      toast.error('No se pudo copiar.');
    }
  };

  if (createdSecret) {
    return (
      <Dialog open={open} maxWidth="sm" fullWidth slotProps={{ paper: { sx: { borderRadius: 2 } } }}>
        <DialogTitle>Canal de notificación creado</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 0.5 }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <CheckCircleOutlineIcon sx={{ color: colors.pwReqMet }} />
              <Typography variant="body2">Tu canal de notificación quedó activo.</Typography>
            </Stack>
            <Box
              sx={{
                backgroundColor: colors.bannerWarning.bg,
                color: colors.bannerWarning.fg,
                border: `1px solid ${colors.bannerWarning.border}`,
                borderRadius: 1.5,
                paddingX: 2,
                paddingY: 1.25,
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                Este es tu secret. Guardalo en un lugar seguro, no se mostrará de nuevo.
              </Typography>
            </Box>
            <Stack direction="row" spacing={1} alignItems="center">
              <Box
                component="code"
                sx={{
                  flex: 1,
                  fontFamily: 'monospace',
                  fontSize: 12,
                  color: colors.textPrimary,
                  backgroundColor: colors.bgSubtle,
                  paddingX: 1.5,
                  paddingY: 1,
                  borderRadius: 1,
                  wordBreak: 'break-all',
                }}
              >
                {createdSecret}
              </Box>
              <Tooltip title="Copiar">
                <IconButton onClick={handleCopySecret}>
                  <ContentCopyIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button variant="contained" onClick={onClose}>
            Listo
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{ paper: { sx: { borderRadius: 2, minWidth: { sm: 560 } } } }}
    >
      <DialogTitle sx={{ pr: 6 }}>
        {isEdit ? 'Editar canal de notificación' : 'Crear canal de notificación'}
        <IconButton aria-label="Cerrar" onClick={onClose} sx={{ position: 'absolute', right: 12, top: 12 }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2.5} sx={{ pt: 0.5 }}>
          <FormControl>
            <FormLabel sx={{ fontSize: 14, fontWeight: 600, color: colors.textPrimary, mb: 0.5 }}>
              Tipo de canal
            </FormLabel>
            <RadioGroup
              row
              value={type}
              onChange={e => setType(e.target.value as WebhookChannelType)}
            >
              <FormControlLabel value="email" control={<Radio size="small" />} label="Email" disabled={isEdit} />
              <FormControlLabel
                value="callback"
                control={<Radio size="small" />}
                label="Callback (Webhook)"
                disabled={isEdit}
              />
            </RadioGroup>
          </FormControl>

          {type === 'callback' ? (
            <TextField
              label="URL del servidor"
              value={url}
              onChange={e => setUrl(e.target.value)}
              disabled={saving}
              error={touched && !urlValid}
              helperText={
                touched && !urlValid
                  ? 'Debe ser una URL https:// válida.'
                  : 'URL de tu servidor que recibirá peticiones POST.'
              }
              required
              placeholder="https://tu-dominio.com/webhooks"
            />
          ) : (
            <TextField
              label="Correo electrónico"
              value={email}
              onChange={e => setEmail(e.target.value)}
              disabled={saving}
              error={touched && !emailValid}
              helperText={
                touched && !emailValid
                  ? 'Ingresá un correo electrónico válido.'
                  : 'Vas a recibir un aviso por correo cada vez que ocurra un evento.'
              }
              required
              placeholder="alertas@tu-dominio.com"
            />
          )}

          <TextField
            label="Descripción"
            value={description}
            onChange={e => setDescription(e.target.value)}
            disabled={saving}
            multiline
            minRows={2}
            helperText="Opcional. Sirve para identificar el canal si tenés varios."
          />

          <Stack spacing={1}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              Eventos
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Elegí qué eventos disparan una notificación a este canal.
            </Typography>
            <Box
              sx={{
                border: `1px solid ${colors.borderDefault}`,
                borderRadius: 1.5,
                paddingX: 1.5,
                paddingY: 0.5,
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
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {WEBHOOK_EVENT_LABELS[event]}
                      </Typography>
                    }
                  />
                ))}
              </Stack>
            </Box>
            {touched && events.length === 0 && (
              <Typography variant="caption" sx={{ color: colors.bannerError.fg }}>
                Elegí al menos un evento.
              </Typography>
            )}
          </Stack>

          {type === 'callback' && <WebhookTechnicalDetails />}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} disabled={saving}>
          Cancelar
        </Button>
        <Button variant="contained" onClick={handleSubmit} disabled={!canSubmit}>
          {saving ? 'Guardando…' : isEdit ? 'Guardar cambios' : 'Crear canal'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default CreateWebhookModal;
