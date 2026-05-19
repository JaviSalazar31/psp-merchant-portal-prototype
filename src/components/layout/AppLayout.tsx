import { useCallback, useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Box, Drawer } from '@mui/material';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import NotificationDrawer from './NotificationDrawer';
import InactivityModal from '@/components/common/InactivityModal';
import { useInactivityTimer } from '@/hooks/useInactivityTimer';
import { useNotificationStore } from '@/stores/notificationStore';
import { useAuthStore } from '@/stores/authStore';
import { toast } from '@/stores/toastStore';
import { MOCK_NOTIFICATIONS } from '@/mocks/notifications';
import { colors } from '@/theme/tokens';

const INACTIVITY_MS = 3 * 60 * 1000;
const COUNTDOWN_MS = 2 * 60 * 1000;

export function AppLayout() {
  const hydrate = useNotificationStore(s => s.hydrate);
  const logout = useAuthStore(s => s.logout);
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    // Hidratamos las notifs mock una sola vez al entrar al área autenticada.
    if (useNotificationStore.getState().notifications.length === 0) {
      hydrate(MOCK_NOTIFICATIONS);
    }
  }, [hydrate]);

  const handleSessionExpire = useCallback(() => {
    logout();
    toast.info('Tu sesión expiró por inactividad.');
    navigate('/login', { replace: true });
  }, [logout, navigate]);

  const { modalOpen, remainingSeconds, stayConnected, logoutNow } = useInactivityTimer({
    inactivityMs: INACTIVITY_MS,
    countdownMs: COUNTDOWN_MS,
    onExpire: handleSessionExpire,
  });

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: colors.bgPage }}>
      {/* Sidebar permanente en MD+ */}
      <Box sx={{ display: { xs: 'none', md: 'block' } }}>
        <Sidebar variant="permanent" />
      </Box>

      {/* Drawer overlay para SM/XS */}
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        sx={{ display: { xs: 'block', md: 'none' } }}
        slotProps={{ paper: { sx: { width: 240, border: 'none' } } }}
      >
        <Sidebar variant="temporary" onNavigate={() => setMobileOpen(false)} />
      </Drawer>

      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Topbar onMenuClick={() => setMobileOpen(true)} />

        <Box
          component="main"
          sx={{
            flex: 1,
            paddingX: { xs: 2, sm: 3, md: 4 },
            paddingY: { xs: 2, sm: 3, md: 4 },
            overflow: 'auto',
          }}
        >
          <Outlet />
        </Box>
      </Box>

      <NotificationDrawer />

      <InactivityModal
        open={modalOpen}
        remainingSeconds={remainingSeconds}
        onStay={stayConnected}
        onLogout={logoutNow}
      />
    </Box>
  );
}

export default AppLayout;
