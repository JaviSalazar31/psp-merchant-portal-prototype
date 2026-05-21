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
import LogoutIcon from '@mui/icons-material/Logout';
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import LanguageOutlinedIcon from '@mui/icons-material/LanguageOutlined';
import CheckIcon from '@mui/icons-material/Check';
import { useAuthStore, type Language } from '@/stores/authStore';
import { useUIStore } from '@/stores/uiStore';
import { toast } from '@/stores/toastStore';
import { colors } from '@/theme/tokens';

function initialsOf(firstName?: string, lastName?: string): string {
  return `${firstName?.[0] ?? '?'}${lastName?.[0] ?? ''}`.toUpperCase();
}

// Header del menú: muestra el comercio del usuario logueado (companyName del
// authStore). Antes era una constante hardcoded "Red Efectiva" — pasamos al
// dato dinámico para que cada comercio vea su propio nombre.

const ITEMS = [
  { label: 'Información', to: '/profile', icon: <InfoOutlinedIcon fontSize="small" /> },
  { label: 'Cuenta', to: '/account', icon: <ManageAccountsOutlinedIcon fontSize="small" /> },
  { label: 'Centro de Seguridad', to: '/security', icon: <ShieldOutlinedIcon fontSize="small" /> },
];

// Los 3 idiomas oficiales del portal post-login (Cruce v2 14/05).
// La selección persiste en localStorage vía uiStore (clave 'psp-ui-preferences')
// y NO desloguea — fue bug de plataforma legacy y se evita explícitamente.
// La traducción real de la UI queda fuera del MVP (es Fase 11); por ahora la
// selección guarda preferencia y muestra un aviso para English / Português.
const LANGUAGES: { code: Language; label: string; short: string }[] = [
  { code: 'es', label: 'Español', short: 'Español' },
  { code: 'en', label: 'English', short: 'English' },
  { code: 'pt-BR', label: 'Português (Brasil)', short: 'Português' },
];

const COMING_SOON_TOAST: Partial<Record<Language, string>> = {
  en: 'English version coming soon',
  'pt-BR': 'Versão em português em breve',
};

export function AvatarMenu() {
  const navigate = useNavigate();
  const user = useAuthStore(s => s.user);
  const logout = useAuthStore(s => s.logout);
  const darkMode = useUIStore(s => s.darkMode);
  const toggleDarkMode = useUIStore(s => s.toggleDarkMode);
  const language = useUIStore(s => s.language);
  const setLanguage = useUIStore(s => s.setLanguage);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  if (!user) return null;

  const handleLogout = () => {
    logout();
    setAnchorEl(null);
    navigate('/login', { replace: true });
  };

  const handleLanguageChange = (code: Language) => {
    setLanguage(code);
    const comingSoon = COMING_SOON_TOAST[code];
    if (comingSoon) toast.info(comingSoon);
  };

  const currentLanguageShort =
    LANGUAGES.find(l => l.code === language)?.short ?? 'Español';

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
            {user.companyName}
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
        {/* Idioma — header tenue + 3 opciones inline. No desloguea (regla NotebookLM). */}
        <Box sx={{ paddingX: 2, paddingTop: 1, paddingBottom: 0.5 }}>
          <Stack direction="row" alignItems="center" spacing={0.75}>
            <LanguageOutlinedIcon sx={{ fontSize: 16, color: colors.textSecondary }} />
            <Typography
              variant="caption"
              sx={{
                color: colors.textSecondary,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: 0.5,
              }}
            >
              Idioma · {currentLanguageShort}
            </Typography>
          </Stack>
        </Box>
        {LANGUAGES.map(opt => {
          const isCurrent = opt.code === language;
          return (
            <MenuItem
              key={opt.code}
              selected={isCurrent}
              onClick={() => handleLanguageChange(opt.code)}
              sx={{ paddingLeft: 4.5 }}
            >
              <ListItemText
                primary={opt.label}
                primaryTypographyProps={{ fontSize: 14, fontWeight: isCurrent ? 600 : 400 }}
              />
              {isCurrent && (
                <CheckIcon sx={{ fontSize: 18, color: colors.brandPrimary, ml: 1 }} />
              )}
            </MenuItem>
          );
        })}
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
