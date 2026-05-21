import { useState } from 'react';
import {
  Avatar,
  Box,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import Logo from '@/components/common/Logo';
import LanguageSelector from '@/components/common/LanguageSelector';
import { useAuthStore } from '@/stores/authStore';
import { colors } from '@/theme/tokens';

function initialsOf(firstName?: string, lastName?: string): string {
  const f = firstName?.[0] ?? '?';
  const l = lastName?.[0] ?? '';
  return `${f}${l}`.toUpperCase();
}

interface WizardHeaderProps {
  /** Si es true, el avatar solo expone "Cerrar sesión" (review-pending). */
  restricted?: boolean;
}

export function WizardHeader({ restricted = false }: WizardHeaderProps) {
  const navigate = useNavigate();
  const user = useAuthStore(s => s.user);
  const logout = useAuthStore(s => s.logout);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <Box
      sx={{
        backgroundColor: colors.bgCard,
        borderBottom: `1px solid ${colors.borderDefault}`,
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        spacing={2}
        sx={{ paddingX: { xs: 2, md: 4 }, paddingY: 1.5, minHeight: 64 }}
      >
        <Stack direction="row" alignItems="center" spacing={2}>
          <Logo width={112} />
          {user && (
            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              sx={{ display: { xs: 'none', sm: 'flex' } }}
            >
              <Typography variant="caption" sx={{ color: colors.textSecondary }}>
                Cliente:
              </Typography>
              <Box
                sx={{
                  paddingX: 1.25,
                  paddingY: 0.5,
                  borderRadius: 1,
                  backgroundColor: colors.brandDarkest,
                  color: colors.textInverse,
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                {user.companyName}
              </Box>
            </Stack>
          )}
        </Stack>

        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Box sx={{ display: { xs: 'none', sm: 'flex' } }}>
            <LanguageSelector />
          </Box>

          {user && (
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
                sx={{ display: { xs: 'none', md: 'flex' }, flexDirection: 'column', alignItems: 'flex-start' }}
              >
                <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
                  {user.firstName} {user.lastName}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: colors.textSecondary, lineHeight: 1.2 }}
                >
                  {user.role}
                </Typography>
              </Box>
            </Stack>
          )}

          <Menu
            anchorEl={anchorEl}
            open={!!anchorEl}
            onClose={() => setAnchorEl(null)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            slotProps={{ paper: { sx: { minWidth: 220, borderRadius: 1.5 } } }}
          >
            {!restricted && (
              <MenuItem disabled>
                <ListItemText
                  primary="Mi perfil"
                  secondary="Disponible tras la aprobación"
                  primaryTypographyProps={{ fontSize: 14 }}
                  secondaryTypographyProps={{ fontSize: 11 }}
                />
              </MenuItem>
            )}
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Cerrar sesión" primaryTypographyProps={{ fontSize: 14 }} />
            </MenuItem>
          </Menu>
        </Stack>
      </Stack>
    </Box>
  );
}

export default WizardHeader;
