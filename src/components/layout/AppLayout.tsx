import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Drawer } from '@mui/material';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import NotificationDrawer from './NotificationDrawer';
import { useNotificationStore } from '@/stores/notificationStore';
import { MOCK_NOTIFICATIONS } from '@/mocks/notifications';
import { colors } from '@/theme/tokens';

export function AppLayout() {
  const hydrate = useNotificationStore(s => s.hydrate);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    // Hidratamos las notifs mock una sola vez al entrar al área autenticada.
    if (useNotificationStore.getState().notifications.length === 0) {
      hydrate(MOCK_NOTIFICATIONS);
    }
  }, [hydrate]);

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
    </Box>
  );
}

export default AppLayout;
