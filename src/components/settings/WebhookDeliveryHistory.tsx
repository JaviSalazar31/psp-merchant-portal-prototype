import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  MenuItem,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import RefreshIcon from '@mui/icons-material/Refresh';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import PlayArrowOutlinedIcon from '@mui/icons-material/PlayArrowOutlined';
import WebhookTechnicalDetails from './WebhookTechnicalDetails';
import { useWebhooksStore } from '@/stores/webhooksStore';
import { toast } from '@/stores/toastStore';
import {
  ALL_WEBHOOK_EVENTS,
  WEBHOOK_EVENT_LABELS,
  type MockWebhook,
  type MockWebhookDelivery,
  type WebhookEventKey,
} from '@/mocks/webhooks';
import { colors } from '@/theme/tokens';

interface Props {
  open: boolean;
  webhook: MockWebhook | null;
  onClose: () => void;
}

function fmtDate(d: Date): string {
  const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

function fmtDateTime(d: Date): string {
  const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  const day = d.getDate().toString().padStart(2, '0');
  const hour = d.getHours().toString().padStart(2, '0');
  const minute = d.getMinutes().toString().padStart(2, '0');
  const second = d.getSeconds().toString().padStart(2, '0');
  return `${day} ${months[d.getMonth()]} ${hour}:${minute}:${second}`;
}

function statusColor(delivery: MockWebhookDelivery): { bg: string; fg: string } {
  if (delivery.status === 'success') return colors.bannerSuccess;
  if (delivery.status === 'retrying') return colors.bannerWarning;
  return colors.bannerError;
}

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ paddingY: 0.5 }}>
      <Typography variant="caption" sx={{ width: 200, color: colors.textSecondary, flexShrink: 0 }}>
        {label}
      </Typography>
      <Box sx={{ flex: 1, minWidth: 0 }}>{children}</Box>
    </Stack>
  );
}

export function WebhookDeliveryHistory({ open, webhook, onClose }: Props) {
  const retryDelivery = useWebhooksStore(s => s.retryDelivery);
  const sendTestEvent = useWebhooksStore(s => s.sendTestEvent);
  const saving = useWebhooksStore(s => s.saving);

  const currentWebhook = useWebhooksStore(
    s => (webhook ? s.webhooks.find(w => w.id === webhook.id) : null) ?? webhook,
  );

  const [tab, setTab] = useState(0);
  const [secretVisible, setSecretVisible] = useState(false);
  const [testEvent, setTestEvent] = useState<WebhookEventKey>('approved');
  const [lastTestResult, setLastTestResult] = useState<MockWebhookDelivery | null>(null);

  useEffect(() => {
    if (open) {
      setTab(0);
      setSecretVisible(false);
      setLastTestResult(null);
      setTestEvent('approved');
    }
  }, [open, webhook?.id]);

  if (!currentWebhook) return null;

  const isEmail = currentWebhook.type === 'email';
  const target = (isEmail ? currentWebhook.email : currentWebhook.url) ?? '—';
  const secret = currentWebhook.signingSecret;

  const handleCopySecret = async () => {
    if (!secret) return;
    try {
      await navigator.clipboard.writeText(secret);
      toast.success('Signing secret copiado al portapapeles.');
    } catch {
      toast.error('No se pudo copiar.');
    }
  };

  const handleRetry = async (deliveryId: string) => {
    const result = await retryDelivery(currentWebhook.id, deliveryId);
    if (result) {
      toast.success(`Reintento enviado. Status ${result.statusCode}.`);
    } else {
      toast.error('No se pudo reintentar la entrega.');
    }
  };

  const handleSendTest = async () => {
    const result = await sendTestEvent(currentWebhook.id, testEvent);
    setLastTestResult(result);
    toast.success(`Evento de prueba enviado. Status ${result.statusCode}.`);
  };

  const maskedSecret = secret
    ? `${secret.slice(0, 11)}••••••••••••${secret.slice(-6)}`
    : '';

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      slotProps={{ paper: { sx: { borderRadius: 2, minWidth: { md: 800 } } } }}
    >
      <DialogTitle sx={{ pr: 6, pb: 0 }}>
        <Stack spacing={0.5}>
          <Typography variant="caption" color="text.secondary">
            Canal de notificación
          </Typography>
          <Typography variant="h4" sx={{ wordBreak: 'break-all' }}>
            {target}
          </Typography>
        </Stack>
        <IconButton aria-label="Cerrar" onClick={onClose} sx={{ position: 'absolute', right: 12, top: 12 }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <Box sx={{ borderBottom: `1px solid ${colors.borderDefault}` }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ px: 3 }} variant="scrollable" scrollButtons="auto">
          <Tab label="Detalles" />
          <Tab label="Eventos suscritos" />
          <Tab label="Historial de entregas" />
          <Tab label="Probar" />
        </Tabs>
      </Box>
      <DialogContent>
        {tab === 0 && (
          <Stack spacing={1.5} sx={{ pt: 1 }}>
            <Stack divider={<Divider flexItem />}>
              <DetailRow label="Tipo de canal">
                <Chip
                  label={isEmail ? 'Email' : 'Callback'}
                  size="small"
                  sx={{
                    backgroundColor: isEmail ? '#DBEAFE' : '#E0E7FF',
                    color: isEmail ? '#1E40AF' : '#3730A3',
                    fontWeight: 600,
                  }}
                />
              </DetailRow>
              <DetailRow label={isEmail ? 'Correo electrónico' : 'URL del servidor'}>
                <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
                  {target}
                </Typography>
              </DetailRow>
              <DetailRow label="Descripción">
                <Typography variant="body2">{currentWebhook.description || '—'}</Typography>
              </DetailRow>
              {!isEmail && secret && (
                <DetailRow label="Signing secret">
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Box
                      component="code"
                      sx={{
                        fontFamily: 'monospace',
                        fontSize: 12,
                        color: colors.textPrimary,
                        backgroundColor: colors.bgSubtle,
                        paddingX: 1,
                        paddingY: 0.5,
                        borderRadius: 1,
                        flex: 1,
                        wordBreak: 'break-all',
                      }}
                    >
                      {secretVisible ? secret : maskedSecret}
                    </Box>
                    <Tooltip title={secretVisible ? 'Ocultar' : 'Mostrar'}>
                      <IconButton size="small" onClick={() => setSecretVisible(v => !v)}>
                        {secretVisible ? (
                          <VisibilityOffOutlinedIcon fontSize="small" />
                        ) : (
                          <VisibilityOutlinedIcon fontSize="small" />
                        )}
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Copiar">
                      <IconButton size="small" onClick={handleCopySecret}>
                        <ContentCopyIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </DetailRow>
              )}
              <DetailRow label="Estado">
                <Chip
                  label={currentWebhook.status}
                  size="small"
                  sx={{
                    backgroundColor:
                      currentWebhook.status === 'Activo'
                        ? colors.bannerSuccess.bg
                        : colors.bannerWarning.bg,
                    color:
                      currentWebhook.status === 'Activo'
                        ? colors.bannerSuccess.fg
                        : colors.bannerWarning.fg,
                    fontWeight: 600,
                  }}
                />
              </DetailRow>
              <DetailRow label="Creado">
                <Typography variant="body2">{fmtDate(currentWebhook.createdAt)}</Typography>
              </DetailRow>
            </Stack>
            {!isEmail && <WebhookTechnicalDetails />}
          </Stack>
        )}

        {tab === 1 && (
          <Stack spacing={1} sx={{ pt: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Eventos a los que está suscrito este canal. Para modificarlos, editá el canal
              desde la lista.
            </Typography>
            <Box
              sx={{
                border: `1px solid ${colors.borderDefault}`,
                borderRadius: 1.5,
                paddingX: 1.5,
                paddingY: 1,
                mt: 1,
              }}
            >
              {ALL_WEBHOOK_EVENTS.map(event => {
                const isSubscribed = currentWebhook.events.includes(event);
                return (
                  <Stack
                    key={event}
                    direction="row"
                    spacing={1.5}
                    alignItems="center"
                    sx={{ paddingY: 0.75 }}
                  >
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        backgroundColor: isSubscribed ? colors.brandPrimary : colors.borderDefault,
                        flexShrink: 0,
                      }}
                    />
                    <Typography
                      variant="body2"
                      sx={{
                        flex: 1,
                        fontWeight: 500,
                        color: isSubscribed ? colors.textPrimary : colors.textMuted,
                      }}
                    >
                      {WEBHOOK_EVENT_LABELS[event]}
                    </Typography>
                    {isSubscribed && (
                      <Chip
                        label="Suscrito"
                        size="small"
                        sx={{
                          backgroundColor: colors.bannerSuccess.bg,
                          color: colors.bannerSuccess.fg,
                          fontWeight: 600,
                        }}
                      />
                    )}
                  </Stack>
                );
              })}
            </Box>
          </Stack>
        )}

        {tab === 2 && (
          <Stack spacing={2} sx={{ pt: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {currentWebhook.deliveryStats24h.total} entregas ·{' '}
              {currentWebhook.deliveryStats24h.successful} exitosas ·{' '}
              {currentWebhook.deliveryStats24h.failed} fallidas
              <Typography component="span" variant="caption" color="text.secondary">
                {' '}
                (últimas 24 horas)
              </Typography>
            </Typography>
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
                    <TableCell sx={{ fontSize: 11, letterSpacing: 0.5, color: colors.textSecondary, fontWeight: 700 }}>
                      TIMESTAMP
                    </TableCell>
                    <TableCell sx={{ fontSize: 11, letterSpacing: 0.5, color: colors.textSecondary, fontWeight: 700 }}>
                      EVENTO
                    </TableCell>
                    <TableCell sx={{ fontSize: 11, letterSpacing: 0.5, color: colors.textSecondary, fontWeight: 700 }}>
                      STATUS
                    </TableCell>
                    <TableCell sx={{ fontSize: 11, letterSpacing: 0.5, color: colors.textSecondary, fontWeight: 700 }}>
                      INTENTOS
                    </TableCell>
                    <TableCell sx={{ fontSize: 11, letterSpacing: 0.5, color: colors.textSecondary, fontWeight: 700 }}>
                      LATENCIA
                    </TableCell>
                    <TableCell sx={{ fontSize: 11, letterSpacing: 0.5, color: colors.textSecondary, fontWeight: 700 }} align="right">
                      ACCIONES
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {currentWebhook.deliveries.map(delivery => {
                    const color = statusColor(delivery);
                    const isRetryable = delivery.status !== 'success';
                    return (
                      <TableRow key={delivery.id} hover>
                        <TableCell sx={{ fontSize: 12, fontFamily: 'monospace' }}>
                          {fmtDateTime(delivery.timestamp)}
                        </TableCell>
                        <TableCell sx={{ fontSize: 12 }}>
                          {WEBHOOK_EVENT_LABELS[delivery.event]}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={`${delivery.statusCode} ${delivery.status === 'success' ? 'OK' : delivery.status === 'retrying' ? 'Reintentando' : 'Fallido'}`}
                            size="small"
                            sx={{ backgroundColor: color.bg, color: color.fg, fontWeight: 600 }}
                          />
                        </TableCell>
                        <TableCell sx={{ fontSize: 12 }}>
                          {delivery.attempts}/{delivery.maxAttempts}
                        </TableCell>
                        <TableCell sx={{ fontSize: 12 }}>{delivery.latencyMs} ms</TableCell>
                        <TableCell align="right">
                          {isRetryable && (
                            <Tooltip title="Reintentar envío">
                              <span>
                                <IconButton
                                  size="small"
                                  onClick={() => handleRetry(delivery.id)}
                                  disabled={saving}
                                >
                                  <RefreshIcon fontSize="small" />
                                </IconButton>
                              </span>
                            </Tooltip>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {currentWebhook.deliveries.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6}>
                        <Box sx={{ paddingY: 4, textAlign: 'center' }}>
                          <Typography variant="body2" color="text.secondary">
                            Aún no hay entregas. Probá enviar un evento de prueba desde la
                            pestaña «Probar».
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Stack>
        )}

        {tab === 3 && (
          <Stack spacing={2.5} sx={{ pt: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Enviá un evento de prueba para verificar que este canal recibe correctamente. No
              se generan datos reales: el payload es ficticio y no afecta tus reportes.
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                select
                label="Tipo de evento"
                value={testEvent}
                onChange={e => setTestEvent(e.target.value as WebhookEventKey)}
                disabled={saving}
                sx={{ flex: 1 }}
              >
                {ALL_WEBHOOK_EVENTS.map(event => (
                  <MenuItem key={event} value={event}>
                    {WEBHOOK_EVENT_LABELS[event]}
                  </MenuItem>
                ))}
              </TextField>
              <Button
                variant="contained"
                onClick={handleSendTest}
                disabled={saving}
                startIcon={<PlayArrowOutlinedIcon />}
                sx={{ minHeight: 56 }}
              >
                {saving ? 'Enviando…' : 'Enviar evento de prueba'}
              </Button>
            </Stack>
            {lastTestResult && (
              <Box
                sx={{
                  border: `1px solid ${colors.borderDefault}`,
                  borderRadius: 1.5,
                  padding: 2,
                  backgroundColor: colors.bgSubtle,
                }}
              >
                <Stack spacing={1}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      Resultado del último envío
                    </Typography>
                    <Chip
                      label={`${lastTestResult.statusCode} OK`}
                      size="small"
                      sx={{
                        backgroundColor: colors.bannerSuccess.bg,
                        color: colors.bannerSuccess.fg,
                        fontWeight: 600,
                      }}
                    />
                  </Stack>
                  <Typography variant="caption" color="text.secondary">
                    Latencia: {lastTestResult.latencyMs} ms · {fmtDateTime(lastTestResult.timestamp)}
                  </Typography>
                </Stack>
              </Box>
            )}
          </Stack>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default WebhookDeliveryHistory;
