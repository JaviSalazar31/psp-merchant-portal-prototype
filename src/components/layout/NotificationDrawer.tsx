import { Box, Button, Divider, Drawer, IconButton, Stack, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import { useNavigate } from 'react-router-dom';
import { useNotificationStore, type InAppNotification } from '@/stores/notificationStore';
import TimeAgo from '@/components/common/TimeAgo';
import { colors } from '@/theme/tokens';

const ICON_BY_TYPE: Record<InAppNotification['type'], React.ReactNode> = {
  transaction: <SwapHorizIcon sx={{ fontSize: 18 }} />,
  settlement: <AccountBalanceWalletOutlinedIcon sx={{ fontSize: 18 }} />,
  system: <SettingsOutlinedIcon sx={{ fontSize: 18 }} />,
  security: <ShieldOutlinedIcon sx={{ fontSize: 18 }} />,
};

const ICON_BG_BY_TYPE: Record<InAppNotification['type'], string> = {
  transaction: colors.bannerSuccess.bg,
  settlement: colors.bannerInfo.bg,
  system: colors.bgSubtle,
  security: colors.bannerWarning.bg,
};

const ICON_FG_BY_TYPE: Record<InAppNotification['type'], string> = {
  transaction: colors.bannerSuccess.fg,
  settlement: colors.bannerInfo.fg,
  system: colors.textSecondary,
  security: colors.bannerWarning.fg,
};

export function NotificationDrawer() {
  const navigate = useNavigate();
  const open = useNotificationStore(s => s.drawerOpen);
  const setOpen = useNotificationStore(s => s.setDrawerOpen);
  const notifications = useNotificationStore(s => s.notifications);
  const markAsRead = useNotificationStore(s => s.markAsRead);
  const markAllAsRead = useNotificationStore(s => s.markAllAsRead);
  const hasUnread = notifications.some(n => n.unread);

  const handleClick = (n: InAppNotification) => {
    if (n.unread) markAsRead(n.id);
    if (n.link) {
      navigate(n.link);
      setOpen(false);
    }
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={() => setOpen(false)}
      slotProps={{
        paper: {
          sx: { width: { xs: '100%', sm: 400 }, maxWidth: '100%' },
        },
      }}
    >
      <Box
        sx={{
          paddingX: 2.5,
          paddingY: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: `1px solid ${colors.borderDefault}`,
        }}
      >
        <Typography variant="h4">Notificaciones</Typography>
        <Stack direction="row" alignItems="center" spacing={0.5}>
          {hasUnread && (
            <Button size="small" onClick={() => markAllAsRead()}>
              Marcar todas como leídas
            </Button>
          )}
          <IconButton size="small" onClick={() => setOpen(false)}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Stack>
      </Box>

      {notifications.length === 0 ? (
        <Box sx={{ padding: 4, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            No tenés notificaciones nuevas.
          </Typography>
        </Box>
      ) : (
        <Stack divider={<Divider sx={{ borderColor: colors.borderDefault }} />}>
          {notifications.map(n => (
            <Box
              key={n.id}
              role="button"
              onClick={() => handleClick(n)}
              sx={{
                paddingX: 2.5,
                paddingY: 1.5,
                cursor: n.link ? 'pointer' : 'default',
                backgroundColor: n.unread ? colors.bgSubtle : 'transparent',
                transition: 'background 120ms ease',
                '&:hover': { backgroundColor: colors.bgSubtle },
              }}
            >
              <Stack direction="row" spacing={1.5}>
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    backgroundColor: ICON_BG_BY_TYPE[n.type],
                    color: ICON_FG_BY_TYPE[n.type],
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {ICON_BY_TYPE[n.type]}
                </Box>
                <Stack spacing={0.25} sx={{ flex: 1, minWidth: 0 }}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    {n.unread && (
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          backgroundColor: colors.brandPrimary,
                          flexShrink: 0,
                        }}
                      />
                    )}
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {n.title}
                    </Typography>
                  </Stack>
                  <Typography variant="caption" color="text.secondary">
                    {n.message}
                  </Typography>
                  <TimeAgo
                    date={n.createdAt}
                    variant="caption"
                    sx={{ color: colors.textMuted, fontSize: 11 }}
                  />
                </Stack>
              </Stack>
            </Box>
          ))}
        </Stack>
      )}
    </Drawer>
  );
}

export default NotificationDrawer;
