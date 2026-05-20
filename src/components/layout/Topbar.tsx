import { Box, IconButton, Stack, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationBell from './NotificationBell';
import AvatarMenu from './AvatarMenu';
import { useAuthStore } from '@/stores/authStore';
import { colors } from '@/theme/tokens';

interface TopbarProps {
  onMenuClick: () => void;
}

export function Topbar({ onMenuClick }: TopbarProps) {
  const user = useAuthStore(s => s.user);

  return (
    <Box
      sx={{
        height: 64,
        paddingX: { xs: 1.5, md: 3 },
        backgroundColor: colors.bgCard,
        borderBottom: `1px solid ${colors.borderDefault}`,
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <IconButton
        onClick={onMenuClick}
        sx={{ display: { xs: 'inline-flex', md: 'none' }, mr: 1 }}
        aria-label="Abrir menú"
      >
        <MenuIcon />
      </IconButton>

      {user && (
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography
            variant="caption"
            sx={{ color: colors.textSecondary, display: { xs: 'none', sm: 'inline' } }}
          >
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

      <Box sx={{ flex: 1 }} />

      <Stack direction="row" alignItems="center" spacing={1}>
        <NotificationBell />
        <AvatarMenu />
      </Stack>
    </Box>
  );
}

export default Topbar;
