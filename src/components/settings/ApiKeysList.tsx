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
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import ScheduleIcon from '@mui/icons-material/Schedule';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ContextBanner from '@/components/common/ContextBanner';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import CreateApiKeyModal from './CreateApiKeyModal';
import RevealKeyModal from './RevealKeyModal';
import RenameApiKeyModal from './RenameApiKeyModal';
import { useApiKeysStore } from '@/stores/apiKeysStore';
import { toast } from '@/stores/toastStore';
import { colors } from '@/theme/tokens';
import type { MockApiKey } from '@/mocks/apiKeys';

function fmtDate(d: Date): string {
  const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

function typeLabel(t: MockApiKey['type']) {
  if (t === 'publishable') return 'Publishable';
  if (t === 'secret') return 'Secret';
  return 'Restricted';
}

function maskedSecret(key: MockApiKey): string {
  if (key.type === 'publishable') return key.fullKey;
  // Para secret/restricted mostramos prefix + ••• + suffix.
  return `${key.prefix}••••••••••••••••••${key.suffix}`;
}

export function ApiKeysList() {
  const keys = useApiKeysStore(s => s.keys);
  const rotateKey = useApiKeysStore(s => s.rotateKey);
  const deleteKey = useApiKeysStore(s => s.deleteKey);

  const [createOpen, setCreateOpen] = useState(false);
  const [revealState, setRevealState] = useState<{
    key: MockApiKey | null;
    reason: 'new' | 'rotated' | 'reveal';
  }>({ key: null, reason: 'reveal' });
  const [renameTarget, setRenameTarget] = useState<MockApiKey | null>(null);
  const [confirmRotate, setConfirmRotate] = useState<MockApiKey | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<MockApiKey | null>(null);
  const [menu, setMenu] = useState<{ anchor: HTMLElement; key: MockApiKey } | null>(null);

  const handleReveal = (key: MockApiKey) => {
    setMenu(null);
    setRevealState({ key, reason: 'reveal' });
  };

  const handleCopyMasked = async (key: MockApiKey) => {
    try {
      await navigator.clipboard.writeText(key.fullKey);
      toast.success('Key copiada al portapapeles.');
    } catch {
      toast.error('No se pudo copiar.');
    }
  };

  const handleConfirmRotate = async () => {
    if (!confirmRotate) return;
    const target = confirmRotate;
    setConfirmRotate(null);
    const newKey = await rotateKey(target.id);
    if (newKey) {
      setRevealState({ key: newKey, reason: 'rotated' });
    }
  };

  const handleConfirmDelete = async () => {
    if (!confirmDelete) return;
    const target = confirmDelete;
    setConfirmDelete(null);
    await deleteKey(target.id);
    toast.success(`API Key «${target.name}» eliminada.`);
  };

  return (
    <Stack spacing={3}>
      <Stack direction="row" justifyContent="flex-end">
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setCreateOpen(true)}
        >
          Crear nueva API Key
        </Button>
      </Stack>

      <ContextBanner variant="info">
        Tus API keys actuales son de <strong>prueba</strong> y no procesan transacciones reales.
        Las keys productivas se generan automáticamente cuando tu cuenta se activa.
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
              <TableCell sx={{ fontSize: 11, letterSpacing: 0.5, color: colors.textSecondary, fontWeight: 700 }}>
                NOMBRE
              </TableCell>
              <TableCell sx={{ fontSize: 11, letterSpacing: 0.5, color: colors.textSecondary, fontWeight: 700 }}>
                TIPO
              </TableCell>
              <TableCell sx={{ fontSize: 11, letterSpacing: 0.5, color: colors.textSecondary, fontWeight: 700 }}>
                KEY
              </TableCell>
              <TableCell sx={{ fontSize: 11, letterSpacing: 0.5, color: colors.textSecondary, fontWeight: 700 }}>
                CREADA
              </TableCell>
              <TableCell sx={{ fontSize: 11, letterSpacing: 0.5, color: colors.textSecondary, fontWeight: 700 }}>
                ÚLTIMO USO
              </TableCell>
              <TableCell sx={{ fontSize: 11, letterSpacing: 0.5, color: colors.textSecondary, fontWeight: 700 }}>
                ESTADO
              </TableCell>
              <TableCell sx={{ fontSize: 11, letterSpacing: 0.5, color: colors.textSecondary, fontWeight: 700 }} align="right">
                ACCIONES
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {keys.map(key => {
              const isRevoked = key.status === 'Revocada';
              return (
                <TableRow key={key.id} hover sx={{ opacity: isRevoked ? 0.55 : 1 }}>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {key.name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={typeLabel(key.type)}
                      size="small"
                      sx={{
                        backgroundColor:
                          key.type === 'publishable' ? '#DBEAFE' : '#FEE2E2',
                        color: key.type === 'publishable' ? '#1E40AF' : '#991B1B',
                        fontWeight: 600,
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" alignItems="center" spacing={1}>
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
                          wordBreak: 'break-all',
                          maxWidth: 280,
                        }}
                      >
                        {maskedSecret(key)}
                      </Box>
                      {key.type === 'publishable' ? (
                        <Tooltip title="Copiar">
                          <IconButton size="small" onClick={() => handleCopyMasked(key)}>
                            <ContentCopyIcon fontSize="inherit" sx={{ fontSize: 16 }} />
                          </IconButton>
                        </Tooltip>
                      ) : (
                        <Tooltip title="Mostrar key completa">
                          <IconButton size="small" onClick={() => handleReveal(key)}>
                            <VisibilityOutlinedIcon fontSize="inherit" sx={{ fontSize: 16 }} />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Stack>
                  </TableCell>
                  <TableCell sx={{ fontSize: 13, color: colors.textSecondary }}>
                    {fmtDate(key.createdAt)}
                  </TableCell>
                  <TableCell sx={{ fontSize: 13, color: colors.textSecondary }}>
                    {key.lastUsedAt ? fmtDate(key.lastUsedAt) : '—'}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={key.status}
                      size="small"
                      sx={{
                        backgroundColor:
                          key.status === 'Activa'
                            ? colors.bannerSuccess.bg
                            : colors.bannerError.bg,
                        color:
                          key.status === 'Activa'
                            ? colors.bannerSuccess.fg
                            : colors.bannerError.fg,
                        fontWeight: 600,
                      }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Acciones">
                      <span>
                        <IconButton
                          size="small"
                          onClick={e => setMenu({ anchor: e.currentTarget as HTMLElement, key })}
                          disabled={isRevoked}
                        >
                          <MoreVertIcon fontSize="small" />
                        </IconButton>
                      </span>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              );
            })}
            {keys.length === 0 && (
              <TableRow>
                <TableCell colSpan={7}>
                  <Box sx={{ paddingY: 4, textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      Todavía no tenés API Keys. Empezá creando una nueva.
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
        slotProps={{ paper: { sx: { minWidth: 240, borderRadius: 1.5 } } }}
      >
        {menu && [
          <MenuItem
            key="rename"
            onClick={() => {
              setMenu(null);
              setRenameTarget(menu.key);
            }}
          >
            <ListItemIcon><EditOutlinedIcon fontSize="small" /></ListItemIcon>
            <ListItemText primary="Renombrar" primaryTypographyProps={{ fontSize: 14 }} />
          </MenuItem>,
          <MenuItem
            key="rotate"
            onClick={() => {
              setMenu(null);
              setConfirmRotate(menu.key);
            }}
          >
            <ListItemIcon><AutorenewIcon fontSize="small" /></ListItemIcon>
            <ListItemText primary="Rotar" primaryTypographyProps={{ fontSize: 14 }} />
          </MenuItem>,
          <Tooltip
            key="schedule"
            title="Disponible en la próxima versión."
            placement="left"
          >
            <span>
              <MenuItem disabled>
                <ListItemIcon><ScheduleIcon fontSize="small" /></ListItemIcon>
                <ListItemText primary="Programar rotación" primaryTypographyProps={{ fontSize: 14 }} />
              </MenuItem>
            </span>
          </Tooltip>,
          <MenuItem
            key="delete"
            onClick={() => {
              setMenu(null);
              setConfirmDelete(menu.key);
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

      <CreateApiKeyModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={key => {
          setCreateOpen(false);
          // Publishable keys ya se muestran completas en la tabla; igual abrimos el reveal
          // para confirmar al usuario que se creó correctamente con un acuse claro.
          setRevealState({ key, reason: 'new' });
        }}
      />

      <RevealKeyModal
        open={!!revealState.key}
        apiKey={revealState.key}
        reason={revealState.reason}
        onClose={() => setRevealState({ key: null, reason: 'reveal' })}
      />

      <RenameApiKeyModal
        open={!!renameTarget}
        apiKey={renameTarget}
        onClose={() => setRenameTarget(null)}
      />

      <ConfirmDialog
        open={!!confirmRotate}
        title="¿Rotar esta API Key?"
        description={
          confirmRotate ? (
            <span>
              Vas a crear una nueva key con el mismo nombre y tipo, y a revocar{' '}
              <strong>«{confirmRotate.name}»</strong>. La key anterior dejará de funcionar al
              instante. Asegurate de actualizarla en tu integración antes de continuar.
            </span>
          ) : (
            ''
          )
        }
        confirmLabel="Sí, rotar key"
        confirmColor="warning"
        onConfirm={handleConfirmRotate}
        onCancel={() => setConfirmRotate(null)}
      />

      <ConfirmDialog
        open={!!confirmDelete}
        title="¿Eliminar esta API Key?"
        description={
          confirmDelete ? (
            <span>
              Vas a eliminar <strong>«{confirmDelete.name}»</strong>. Cualquier integración que
              la esté usando va a dejar de funcionar. Esta acción no se puede deshacer.
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

export default ApiKeysList;
