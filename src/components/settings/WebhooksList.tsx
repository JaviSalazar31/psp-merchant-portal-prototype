import { useState } from 'react';
import {
  Box,
  Button,
  Chip,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
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
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import WebhookOutlinedIcon from '@mui/icons-material/WebhookOutlined';
import ContextBanner from '@/components/common/ContextBanner';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import CreateWebhookModal from './CreateWebhookModal';
import WebhookDeliveryHistory from './WebhookDeliveryHistory';
import TimeAgo from '@/components/common/TimeAgo';
import { useWebhooksStore } from '@/stores/webhooksStore';
import { toast } from '@/stores/toastStore';
import { colors } from '@/theme/tokens';
import type { MockWebhook } from '@/mocks/webhooks';

function lastActivity(wh: MockWebhook): Date | null {
  if (wh.deliveries.length === 0) return null;
  return wh.deliveries.reduce(
    (latest, d) => (d.timestamp.getTime() > latest.getTime() ? d.timestamp : latest),
    wh.deliveries[0].timestamp,
  );
}

function channelTarget(wh: MockWebhook): string {
  return (wh.type === 'email' ? wh.email : wh.url) ?? '—';
}

const HEAD_CELL = {
  fontSize: 11,
  letterSpacing: 0.5,
  color: colors.textSecondary,
  fontWeight: 700,
};

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
    toast.success(`Canal ${newStatus === 'Activo' ? 'reanudado' : 'pausado'}.`);
  };

  const handleConfirmDelete = async () => {
    if (!confirmDelete) return;
    const target = confirmDelete;
    setConfirmDelete(null);
    await deleteWebhook(target.id);
    toast.success('Canal de notificación eliminado.');
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
          Crear canal de notificación
        </Button>
      </Stack>

      <ContextBanner variant="info">
        Configurá canales para enterarte de los eventos de tu cuenta. Un canal puede avisarte
        por <strong>email</strong> o por <strong>callback</strong> — un POST firmado a una URL de
        tu servidor.
      </ContextBanner>

      <TableContainer
        sx={{
          border: `1px solid ${colors.borderDefault}`,
          borderRadius: 2,
          backgroundColor: colors.bgCard,
          overflow: 'auto',
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: colors.bgSubtle }}>
              <TableCell sx={HEAD_CELL}>CANAL</TableCell>
              <TableCell sx={HEAD_CELL}>TIPO</TableCell>
              <TableCell sx={HEAD_CELL}>EVENTOS</TableCell>
              <TableCell sx={HEAD_CELL}>ESTADO</TableCell>
              <TableCell sx={HEAD_CELL}>ÚLTIMA ACTIVIDAD</TableCell>
              <TableCell sx={HEAD_CELL} align="right">
                ACCIONES
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {webhooks.map(wh => {
              const last = lastActivity(wh);
              const isEmail = wh.type === 'email';
              return (
                <TableRow key={wh.id} hover>
                  <TableCell>
                    <Stack direction="row" spacing={1.25} alignItems="center">
                      <Box
                        sx={{
                          width: 32,
                          height: 32,
                          borderRadius: 1,
                          backgroundColor: colors.bgSubtle,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        {isEmail ? (
                          <EmailOutlinedIcon sx={{ fontSize: 18, color: colors.textSecondary }} />
                        ) : (
                          <WebhookOutlinedIcon sx={{ fontSize: 18, color: colors.textSecondary }} />
                        )}
                      </Box>
                      <Box sx={{ minWidth: 0 }}>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 600, fontFamily: isEmail ? undefined : 'monospace', wordBreak: 'break-all' }}
                        >
                          {channelTarget(wh)}
                        </Typography>
                        {wh.description && (
                          <Typography variant="caption" color="text.secondary">
                            {wh.description}
                          </Typography>
                        )}
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={isEmail ? 'Email' : 'Callback'}
                      size="small"
                      sx={{
                        backgroundColor: isEmail ? '#DBEAFE' : '#E0E7FF',
                        color: isEmail ? '#1E40AF' : '#3730A3',
                        fontWeight: 600,
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ fontSize: 13, color: colors.textSecondary }}>
                    {wh.events.length} {wh.events.length === 1 ? 'evento' : 'eventos'}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={wh.status}
                      size="small"
                      sx={{
                        backgroundColor:
                          wh.status === 'Activo' ? colors.bannerSuccess.bg : colors.bannerWarning.bg,
                        color:
                          wh.status === 'Activo' ? colors.bannerSuccess.fg : colors.bannerWarning.fg,
                        fontWeight: 600,
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ fontSize: 13, color: colors.textSecondary }}>
                    {last ? <TimeAgo date={last} variant="body2" /> : '—'}
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Acciones">
                      <IconButton
                        size="small"
                        onClick={e => setMenu({ anchor: e.currentTarget as HTMLElement, webhook: wh })}
                      >
                        <MoreVertIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              );
            })}
            {webhooks.length === 0 && (
              <TableRow>
                <TableCell colSpan={6}>
                  <Box sx={{ paddingY: 4, textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      Aún no configuraste canales de notificación. Creá uno para empezar.
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

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
            key="detail"
            onClick={() => {
              setDetailWebhook(menu.webhook);
              setMenu(null);
            }}
          >
            <ListItemIcon><VisibilityOutlinedIcon fontSize="small" /></ListItemIcon>
            <ListItemText primary="Ver detalles" primaryTypographyProps={{ fontSize: 14 }} />
          </MenuItem>,
          <MenuItem
            key="edit"
            onClick={() => {
              setCreateState({ open: true, webhook: menu.webhook });
              setMenu(null);
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
          <MenuItem
            key="delete"
            onClick={() => {
              setConfirmDelete(menu.webhook);
              setMenu(null);
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
        title="¿Eliminar este canal?"
        description={
          confirmDelete ? (
            <span>
              Vas a eliminar el canal <strong>{channelTarget(confirmDelete)}</strong>. Dejaremos
              de enviar eventos a este destino. Esta acción no se puede deshacer.
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
