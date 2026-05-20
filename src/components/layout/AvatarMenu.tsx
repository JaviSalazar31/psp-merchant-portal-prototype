import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Avatar,
  Box,
  Chip,
  Divider,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  Switch,
  Typography,
} from '@mui/material';
import CodeOutlinedIcon from '@mui/icons-material/CodeOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import { useAuthStore } from '@/stores/authStore';
import { useUIStore } from '@/stores/uiStore';
import { colors } from '@/theme/tokens';

function initialsOf(firstName?: string, lastName?: string): string {
  return `${firstName?.[0] ?? '?'}${lastName?.[0] ?? ''}`.toUpperCase();
}

// Operador (contexto multi-tenant): el comercio opera bajo esta red comercial.
const OPERATOR_NAME = 'Red Efectiva';

const ITEMS = [
  { label: 'Mi perfil', to: '/profile', icon: <PersonOutlineIcon fontSize="small" /> },
  { label: 'Cuenta', to: '/account', icon: <ManageAccountsOutlinedIcon fontSize="small" /> },
  { label: 'Centro de Seguridad', to: '/security', icon: <ShieldOutlinedIcon fontSize="small" /> },
  { label: 'Desarrolladores', to: '/developers', icon: <CodeOutlinedIcon fontSize="small" /> },
];

export function AvatarMenu() {
  const navigate = useNavigate();
  const user = useAuthStore(s => s.user);
  const logout = useAuthStore(s => s.logout);
  const darkMode = useUIStore(s => s.darkMode);
  const toggleDarkMode = useUIStore(s => s.toggleDarkMode);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  if (!user) return null;

  const handleLogout = () => {
    logout();
    setAnchorEl(null);
    navigate('/login', { replace: true });
  };

  return (
    <>
      <Stack
        direction="row"
        alignItems="center"
        spacing={1}
        component="button"
        onClick={e => setAnchorEl(e.currentTarget as HTMLElement)}
        sx={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: 0.5,
          borderRadius: 1,
          '&:hover': { backgroundColor: colors.bgSubtle },
        }}
      >
        <Avatar
          sx={{
            width: 36,
            height: 36,
            backgroundColor: colors.brandPrimary,
            color: colors.brandDarkest,
            fontSize: 14,
            fontWeight: 700,
          }}
        >
          {initialsOf(user.firstName, user.lastName)}
        </Avatar>
        <Box
          sx={{
            display: { xs: 'none', md: 'flex' },
            flexDirection: 'column',
            alignItems: 'flex-start',
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
            {user.firstName} {user.lastName}
          </Typography>
          <Typography variant="caption" sx={{ color: colors.textSecondary, lineHeight: 1.2 }}>
            {user.role}
          </Typography>
        </Box>
      </Stack>
      <Menu
        anchorEl={anchorEl}
        open={!!anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{ paper: { sx: { minWidth: 260, borderRadius: 1.5 } } }}
      >
        <Box sx={{ paddingX: 2, paddingY: 1.5 }}>
          <Typography
            variant="caption"
            sx={{
              color: colors.textSecondary,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: 0.5,
              display: 'block',
            }}
          >
            {OPERATOR_NAME}
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {user.firstName} {user.lastName}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
            {user.email}
          </Typography>
          <Chip
            label={user.role}
            size="small"
            sx={{
              mt: 0.5,
              fontWeight: 600,
              backgroundColor: colors.bgSubtle,
              color: colors.textPrimary,
            }}
          />
        </Box>
        <Divider />
        {ITEMS.map(item => (
          <MenuItem
            key={item.to}
            onClick={() => {
              navigate(item.to);
              setAnchorEl(null);
            }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} primaryTypographyProps={{ fontSize: 14 }} />
          </MenuItem>
        ))}
        <Divider />
        <MenuItem
          onClick={(e) => {
            e.stopPropagation();
            toggleDarkMode();
          }}
          sx={{ '&:hover': { backgroundColor: 'transparent' } }}
        >
          <ListItemIcon>
            <DarkModeOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Modo oscuro" primaryTypographyProps={{ fontSize: 14 }} />
          <Switch
            checked={darkMode}
            onChange={toggleDarkMode}
            size="small"
            sx={{
              '& .MuiSwitch-switchBase.Mui-checked': { color: colors.brandPrimary },
              '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                backgroundColor: colors.brandPrimary,
              },
            }}
            inputProps={{ 'aria-label': 'Activar modo oscuro' }}
          />
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Cerrar sesión" primaryTypographyProps={{ fontSize: 14 }} />
        </MenuItem>
      </Menu>
    </>
  );
}

export default AvatarMenu;
