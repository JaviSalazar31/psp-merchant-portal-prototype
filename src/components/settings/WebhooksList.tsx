import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ContextBanner from '@/components/common/ContextBanner';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import CreateWebhookModal from './CreateWebhookModal';
import WebhookDeliveryHistory from './WebhookDeliveryHistory';
import TimeAgo from '@/components/common/TimeAgo';
import { useWebhooksStore } from '@/stores/webhooksStore';
import { toast } from '@/stores/toastStore';
import { colors } from '@/theme/tokens';
import type { MockWebhook } from '@/mocks/webhooks';

function successRate(wh: MockWebhook): number {
  const total = wh.deliveryStats24h.total;
  if (total === 0) return 100;
  return Math.round((wh.deliveryStats24h.successful / total) * 100);
}

function lastDelivery(wh: MockWebhook): MockWebhook['deliveries'][number] | null {
  if (wh.deliveries.length === 0) return null;
  return wh.deliveries.reduce((latest, d) =>
    d.timestamp.getTime() > latest.timestamp.getTime() ? d : latest,
  );
}

export function WebhooksList() {
  const webhooks = useWebhooksStore(s => s.webhooks);
  const updateWebhook = useWebhooksStore(s => s.updateWebhook);
  const deleteWebhook = useWebhooksStore(s => s.deleteWebhook);

  const [createState, setCreateState] = useState<{ open: boolean; webhook: MockWebhook | null }>({
    open: false,
    webhook: null,
  });
  const [detailWebhook, setDetailWebhook] = useState<MockWebhook | null>(null);
  const [menu, setMenu] = useState<{ anchor: HTMLElement; webhook: MockWebhook } | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<MockWebhook | null>(null);

  const handleToggleStatus = async (wh: MockWebhook) => {
    setMenu(null);
    const newStatus = wh.status === 'Activo' ? 'Pausado' : 'Activo';
    await updateWebhook(wh.id, { status: newStatus });
    toast.success(`Webhook ${newStatus === 'Activo' ? 'reanudado' : 'pausado'}.`);
  };

  const handleConfirmDelete = async () => {
    if (!confirmDelete) return;
    const target = confirmDelete;
    setConfirmDelete(null);
    await deleteWebhook(target.id);
    toast.success('Webhook eliminado.');
  };

  return (
    <Stack spacing={3}>
      <Stack direction="row" justifyContent="flex-end">
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setCreateState({ open: true, webhook: null })}
        >
          Agregar endpoint
        </Button>
      </Stack>

      <ContextBanner variant="info">
        Tus endpoints reciben un POST firmado con HMAC SHA256 usando el{' '}
        <strong>signing secret</strong> de cada webhook. Verificá la firma del header{' '}
        <code>PSP-Signature</code> antes de procesar el evento.
      </ContextBanner>

      <Stack spacing={2}>
        {webhooks.map(wh => {
          const last = lastDelivery(wh);
          const rate = successRate(wh);
          const hasIssues = wh.deliveryStats24h.failed > 0;

          return (
            <Card key={wh.id}>
              <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                <Stack spacing={1.5}>
                  <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={1.5}
                    alignItems={{ xs: 'flex-start', sm: 'center' }}
                    justifyContent="space-between"
                  >
                    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ flex: 1, minWidth: 0 }}>
                      <Box
                        sx={{
                          width: 10,
                          height: 10,
                          borderRadius: '50%',
                          backgroundColor:
                            wh.status === 'Activo' ? '#10B981' : colors.borderStrong,
                          flexShrink: 0,
                        }}
                      />
                      <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                          <Typography
                            variant="body1"
                            sx={{
                              fontWeight: 600,
                              wordBreak: 'break-all',
                              fontFamily: 'monospace',
                              fontSize: 14,
                            }}
                          >
                            {wh.url}
                          </Typography>
                          <Chip
                            label={wh.status}
                            size="small"
                            sx={{
                              backgroundColor:
                                wh.status === 'Activo'
                                  ? colors.bannerSuccess.bg
                                  : colors.bannerWarning.bg,
                              color:
                                wh.status === 'Activo'
                                  ? colors.bannerSuccess.fg
                                  : colors.bannerWarning.fg,
                              fontWeight: 600,
                            }}
                          />
                        </Stack>
                        {wh.description && (
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.25 }}>
                            {wh.description}
                          </Typography>
                        )}
                      </Box>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Button
                        variant="outlined"
                        size="small"
                        endIcon={<OpenInNewIcon fontSize="small" />}
                        onClick={() => setDetailWebhook(wh)}
                      >
                        Ver detalles
                      </Button>
                      <IconButton
                        size="small"
                        onClick={e => setMenu({ anchor: e.currentTarget as HTMLElement, webhook: wh })}
                      >
                        <MoreVertIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                  </Stack>

                  <Divider />

                  <Stack
                    direction="row"
                    spacing={{ xs: 2, md: 4 }}
                    sx={{ flexWrap: 'wrap', rowGap: 1 }}
                  >
                    <Stack spacing={0.25}>
                      <Typography variant="caption" color="text.secondary">
                        Eventos suscritos
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {wh.events.length}
                      </Typography>
                    </Stack>
                    <Stack spacing={0.25}>
                      <Typography variant="caption" color="text.secondary">
                        Entregas últimas 24h
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {wh.deliveryStats24h.total}
                      </Typography>
                    </Stack>
                    <Stack spacing={0.25}>
                      <Typography variant="caption" color="text.secondary">
                        Tasa de éxito
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          color: rate >= 95
                            ? colors.bannerSuccess.fg
                            : rate >= 80
                              ? colors.bannerWarning.fg
                              : colors.bannerError.fg,
                        }}
                      >
                        {rate}%
                      </Typography>
                    </Stack>
                    <Stack spacing={0.25}>
                      <Typography variant="caption" color="text.secondary">
                        Última entrega
                      </Typography>
                      {last ? (
                        <Stack direction="row" spacing={1} alignItems="baseline">
                          <TimeAgo
                            date={last.timestamp}
                            variant="body2"
                            sx={{ fontWeight: 600 }}
                          />
                          <Typography variant="caption" color="text.secondary">
                            · {last.statusCode}{' '}
                            {last.status === 'success'
                              ? 'OK'
                              : last.status === 'retrying'
                                ? 'reintentando'
                                : 'fallida'}
                          </Typography>
                        </Stack>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          Sin entregas
                        </Typography>
                      )}
                    </Stack>
                  </Stack>

                  {hasIssues && (
                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      sx={{
                        backgroundColor: colors.bannerWarning.bg,
                        color: colors.bannerWarning.fg,
                        borderRadius: 1.5,
                        paddingX: 1.5,
                        paddingY: 0.75,
                      }}
                    >
                      <WarningAmberIcon sx={{ fontSize: 18 }} />
                      <Typography variant="caption" sx={{ fontWeight: 600 }}>
                        {wh.deliveryStats24h.failed}{' '}
                        {wh.deliveryStats24h.failed === 1 ? 'fallo' : 'fallos'} en las últimas
                        24h. Revisá el historial de entregas.
                      </Typography>
                    </Stack>
                  )}
                </Stack>
              </CardContent>
            </Card>
          );
        })}

        {webhooks.length === 0 && (
          <Card>
            <CardContent sx={{ paddingY: 6 }}>
              <Stack spacing={1.5} alignItems="center" sx={{ textAlign: 'center' }}>
                <Typography variant="h4">Aún no agregaste endpoints</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 480 }}>
                  Configurá un endpoint HTTPS para recibir eventos en tiempo real cuando
                  ocurran transacciones, settlements o disputas.
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setCreateState({ open: true, webhook: null })}
                  sx={{ mt: 1 }}
                >
                  Agregar endpoint
                </Button>
              </Stack>
            </CardContent>
          </Card>
        )}
      </Stack>

      <Menu
        anchorEl={menu?.anchor}
        open={!!menu}
        onClose={() => setMenu(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{ paper: { sx: { minWidth: 220, borderRadius: 1.5 } } }}
      >
        {menu && [
          <MenuItem
            key="edit"
            onClick={() => {
              setMenu(null);
              setCreateState({ open: true, webhook: menu.webhook });
            }}
          >
            <ListItemIcon><EditOutlinedIcon fontSize="small" /></ListItemIcon>
            <ListItemText primary="Editar" primaryTypographyProps={{ fontSize: 14 }} />
          </MenuItem>,
          <MenuItem key="toggle" onClick={() => handleToggleStatus(menu.webhook)}>
            <ListItemIcon>
              {menu.webhook.status === 'Activo' ? (
                <PauseCircleOutlineIcon fontSize="small" />
              ) : (
                <PlayCircleOutlineIcon fontSize="small" />
              )}
            </ListItemIcon>
            <ListItemText
              primary={menu.webhook.status === 'Activo' ? 'Pausar' : 'Reanudar'}
              primaryTypographyProps={{ fontSize: 14 }}
            />
          </MenuItem>,
          <Tooltip
            key="rotate-secret"
            title="Disponible en la próxima versión."
            placement="left"
          >
            <span>
              <MenuItem disabled>
                <ListItemIcon><EditOutlinedIcon fontSize="small" /></ListItemIcon>
                <ListItemText primary="Rotar signing secret" primaryTypographyProps={{ fontSize: 14 }} />
              </MenuItem>
            </span>
          </Tooltip>,
          <MenuItem
            key="delete"
            onClick={() => {
              setMenu(null);
              setConfirmDelete(menu.webhook);
            }}
            sx={{ color: colors.bannerError.fg }}
          >
            <ListItemIcon>
              <DeleteOutlineIcon fontSize="small" sx={{ color: colors.bannerError.fg }} />
            </ListItemIcon>
            <ListItemText primary="Eliminar" primaryTypographyProps={{ fontSize: 14 }} />
          </MenuItem>,
        ]}
      </Menu>

      <CreateWebhookModal
        open={createState.open}
        webhook={createState.webhook}
        onClose={() => setCreateState({ open: false, webhook: null })}
      />

      <WebhookDeliveryHistory
        open={!!detailWebhook}
        webhook={detailWebhook}
        onClose={() => setDetailWebhook(null)}
      />

      <ConfirmDialog
        open={!!confirmDelete}
        title="¿Eliminar este webhook?"
        description={
          confirmDelete ? (
            <span>
              Vas a eliminar el endpoint <strong>{confirmDelete.url}</strong>. Dejaremos de
              enviar eventos a esta URL. Esta acción no se puede deshacer.
            </span>
          ) : (
            ''
          )
        }
        confirmLabel="Sí, eliminar"
        confirmColor="error"
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmDelete(null)}
      />
    </Stack>
  );
}

export default WebhooksList;
