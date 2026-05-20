import { useState } from 'react';
import {
  Avatar,
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
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import UserFormModal from './UserFormModal';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import { useUsersStore } from '@/stores/usersStore';
import type { MockMerchantUser } from '@/mocks/users';
import type { UserRole } from '@/stores/authStore';
import { toast } from '@/stores/toastStore';
import { colors } from '@/theme/tokens';

function initials(u: MockMerchantUser): string {
  return `${u.firstName[0] ?? '?'}${u.lastName[0] ?? ''}`.toUpperCase();
}

const ROLE_COLORS: Record<UserRole, { bg: string; fg: string }> = {
  Admin: { bg: '#FEE2E2', fg: '#991B1B' },
  Finance: { bg: '#EDE9FE', fg: '#5B21B6' },
  Operator: { bg: '#DBEAFE', fg: '#1E40AF' },
  Viewer: { bg: '#F3F4F6', fg: '#374151' },
};

const STATUS_COLORS: Record<string, { bg: string; fg: string }> = {
  Activo: { bg: '#D1FAE5', fg: '#065F46' },
  Pendiente: { bg: '#FEF3C7', fg: '#92400E' },
  Suspendido: { bg: '#F3F4F6', fg: '#4B5563' },
};

export function UsersList() {
  const users = useUsersStore(s => s.users);
  const addUser = useUsersStore(s => s.addUser);
  const updateUser = useUsersStore(s => s.updateUser);
  const removeUser = useUsersStore(s => s.removeUser);
  const countAdmins = useUsersStore(s => s.countAdmins);

  const [modal, setModal] = useState<{ open: boolean; mode: 'create' | 'edit'; user?: MockMerchantUser | null }>({
    open: false,
    mode: 'create',
    user: null,
  });
  const [menu, setMenu] = useState<{ anchor: HTMLElement; user: MockMerchantUser } | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<MockMerchantUser | null>(null);

  const openCreate = () => setModal({ open: true, mode: 'create', user: null });
  const openEdit = (user: MockMerchantUser) => {
    setMenu(null);
    setModal({ open: true, mode: 'edit', user });
  };

  const handleResend = (user: MockMerchantUser) => {
    setMenu(null);
    toast.success(`Invitación reenviada a ${user.email}.`);
  };

  const handleSuspendToggle = (user: MockMerchantUser) => {
    setMenu(null);
    if (user.status === 'Suspendido') {
      updateUser(user.id, { status: 'Activo' });
      toast.success(`${user.firstName} reactivado.`);
    } else {
      // No permitir suspender al único Admin activo
      if (user.role === 'Admin' && countAdmins() <= 1) {
        toast.error('No podés suspender al último admin activo.');
        return;
      }
      updateUser(user.id, { status: 'Suspendido' });
      toast.info(`${user.firstName} suspendido.`);
    }
  };

  const handleAskDelete = (user: MockMerchantUser) => {
    setMenu(null);
    if (user.role === 'Admin' && countAdmins() <= 1) {
      toast.error('No podés eliminar al último admin activo.');
      return;
    }
    setConfirmDelete(user);
  };

  const handleConfirmDelete = () => {
    if (!confirmDelete) return;
    removeUser(confirmDelete.id);
    toast.success(`${confirmDelete.firstName} ${confirmDelete.lastName} fue eliminado.`);
    setConfirmDelete(null);
  };

  const handleFormSubmit = (values: { firstName: string; lastName: string; email: string; role: UserRole }) => {
    if (modal.mode === 'create') {
      addUser(values);
      toast.success(`Invitación enviada a ${values.email}.`);
    } else if (modal.user) {
      updateUser(modal.user.id, { firstName: values.firstName, lastName: values.lastName, role: values.role });
      toast.success('Datos del usuario actualizados.');
    }
    setModal({ open: false, mode: 'create', user: null });
  };

  return (
    <Stack spacing={3}>
      <Stack direction="row" justifyContent="flex-end">
        <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={openCreate}>
          Crear usuario
        </Button>
      </Stack>

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
                NOMBRE COMPLETO
              </TableCell>
              <TableCell sx={{ fontSize: 11, letterSpacing: 0.5, color: colors.textSecondary, fontWeight: 700 }}>
                EMAIL
              </TableCell>
              <TableCell sx={{ fontSize: 11, letterSpacing: 0.5, color: colors.textSecondary, fontWeight: 700 }}>
                ROL
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
            {users.map(u => {
              const roleColor = ROLE_COLORS[u.role];
              const statusColor = STATUS_COLORS[u.status];
              return (
                <TableRow key={u.id} hover>
                  <TableCell>
                    <Stack direction="row" alignItems="center" spacing={1.25}>
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          fontSize: 12,
                          fontWeight: 700,
                          backgroundColor: colors.brandPrimary,
                          color: colors.brandDarkest,
                        }}
                      >
                        {initials(u)}
                      </Avatar>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {u.firstName} {u.lastName}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell sx={{ color: colors.textSecondary, fontSize: 13 }}>{u.email}</TableCell>
                  <TableCell>
                    <Chip
                      label={u.role}
                      size="small"
                      sx={{ backgroundColor: roleColor.bg, color: roleColor.fg, fontWeight: 600 }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={u.status}
                      size="small"
                      sx={{ backgroundColor: statusColor.bg, color: statusColor.fg, fontWeight: 600 }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Acciones">
                      <IconButton
                        size="small"
                        onClick={e => setMenu({ anchor: e.currentTarget as HTMLElement, user: u })}
                      >
                        <MoreVertIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              );
            })}
            {users.length === 0 && (
              <TableRow>
                <TableCell colSpan={5}>
                  <Box sx={{ paddingY: 4, textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      No hay usuarios. Creá uno para empezar.
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
          <MenuItem key="edit" onClick={() => openEdit(menu.user)}>
            <ListItemIcon><EditOutlinedIcon fontSize="small" /></ListItemIcon>
            <ListItemText primary="Editar usuario" primaryTypographyProps={{ fontSize: 14 }} />
          </MenuItem>,
          menu.user.status === 'Pendiente' && (
            <MenuItem key="resend" onClick={() => handleResend(menu.user)}>
              <ListItemIcon><SendOutlinedIcon fontSize="small" /></ListItemIcon>
              <ListItemText primary="Reenviar invitación" primaryTypographyProps={{ fontSize: 14 }} />
            </MenuItem>
          ),
          <MenuItem key="suspend" onClick={() => handleSuspendToggle(menu.user)}>
            <ListItemIcon>
              {menu.user.status === 'Suspendido' ? (
                <PlayCircleOutlineIcon fontSize="small" />
              ) : (
                <PauseCircleOutlineIcon fontSize="small" />
              )}
            </ListItemIcon>
            <ListItemText
              primary={menu.user.status === 'Suspendido' ? 'Reactivar usuario' : 'Suspender usuario'}
              primaryTypographyProps={{ fontSize: 14 }}
            />
          </MenuItem>,
          <MenuItem
            key="delete"
            onClick={() => handleAskDelete(menu.user)}
            sx={{ color: colors.bannerError.fg }}
          >
            <ListItemIcon>
              <DeleteOutlineIcon fontSize="small" sx={{ color: colors.bannerError.fg }} />
            </ListItemIcon>
            <ListItemText primary="Eliminar usuario" primaryTypographyProps={{ fontSize: 14 }} />
          </MenuItem>,
        ]}
      </Menu>

      <UserFormModal
        open={modal.open}
        mode={modal.mode}
        user={modal.user}
        onClose={() => setModal({ open: false, mode: 'create', user: null })}
        onSubmit={handleFormSubmit}
      />

      <ConfirmDialog
        open={!!confirmDelete}
        title="¿Eliminar usuario?"
        description={
          <span>
            Vas a eliminar a{' '}
            <strong>
              {confirmDelete?.firstName} {confirmDelete?.lastName}
            </strong>
            . Esta acción no se puede deshacer.
          </span>
        }
        confirmLabel="Sí, eliminar"
        confirmColor="error"
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmDelete(null)}
      />
    </Stack>
  );
}

export default UsersList;
