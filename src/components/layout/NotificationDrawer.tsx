import { Box, Button, Divider, Drawer, IconButton, Link, Stack, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import VpnKeyOutlinedIcon from '@mui/icons-material/VpnKeyOutlined';
import TuneOutlinedIcon from '@mui/icons-material/TuneOutlined';
import { useNavigate } from 'react-router-dom';
import { useNotificationStore, type InAppNotification } from '@/stores/notificationStore';
import TimeAgo from '@/components/common/TimeAgo';
import { colors } from '@/theme/tokens';

const ICON_BY_TYPE: Record<InAppNotification['type'], React.ReactNode> = {
  settlement_available: <PaidOutlinedIcon sx={{ fontSize: 18 }} />,
  document_rejected: <WarningAmberIcon sx={{ fontSize: 18 }} />,
  transactions_bulk: <NotificationsOutlinedIcon sx={{ fontSize: 18 }} />,
  api_key_expiring: <VpnKeyOutlinedIcon sx={{ fontSize: 18 }} />,
};

// Cada tipo tiene su par de colores (fondo / ícono) para distinguir la urgencia de un vistazo.
const COLOR_BY_TYPE: Record<InAppNotification['type'], { bg: string; fg: string }> = {
  settlement_available: { bg: colors.bannerSuccess.bg, fg: colors.pwReqMet },
  document_rejected: { bg: colors.bannerWarning.bg, fg: colors.bannerWarning.fg },
  transactions_bulk: { bg: colors.bannerInfo.bg, fg: colors.bannerInfo.fg },
  api_key_expiring: { bg: '#FEF9C3', fg: '#A16207' },
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

  const goToSettings = () => {
    navigate('/developers');
    setOpen(false);
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={() => setOpen(false)}
      slotProps={{
        paper: {
          sx: {
            width: { xs: '100%', sm: 400 },
            maxWidth: '100%',
            display: 'flex',
            flexDirection: 'column',
          },
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

      <Box sx={{ flex: 1, overflowY: 'auto' }}>
        {notifications.length === 0 ? (
          <Box sx={{ padding: 4, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              No tenés notificaciones nuevas.
            </Typography>
          </Box>
        ) : (
          <Stack divider={<Divider sx={{ borderColor: colors.borderDefault }} />}>
            {notifications.map(n => {
              const palette = COLOR_BY_TYPE[n.type];
              return (
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
                        backgroundColor: palette.bg,
                        color: palette.fg,
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
              );
            })}
          </Stack>
        )}
      </Box>

      <Box
        sx={{
          borderTop: `1px solid ${colors.borderDefault}`,
          paddingX: 2.5,
          paddingY: 1.5,
        }}
      >
        <Link
          component="button"
          variant="body2"
          onClick={goToSettings}
          sx={{ fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 0.5 }}
        >
          <TuneOutlinedIcon sx={{ fontSize: 16 }} />
          Configurar notificaciones
        </Link>
      </Box>
    </Drawer>
  );
}

export default NotificationDrawer;
