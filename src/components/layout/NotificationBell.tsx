import { Badge, IconButton, Tooltip } from '@mui/material';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import { useNotificationStore } from '@/stores/notificationStore';
import { colors } from '@/theme/tokens';

export function NotificationBell() {
  const toggle = useNotificationStore(s => s.toggleDrawer);
  const unreadCount = useNotificationStore(s => s.notifications.filter(n => n.unread).length);

  return (
    <Tooltip title="Notificaciones">
      <IconButton onClick={toggle} sx={{ color: colors.textPrimary }}>
        <Badge
          badgeContent={unreadCount > 9 ? '9+' : unreadCount}
          color="error"
          invisible={unreadCount === 0}
          sx={{
            '& .MuiBadge-badge': {
              fontSize: 10,
              fontWeight: 700,
              minWidth: 18,
              height: 18,
            },
          }}
        >
          <NotificationsOutlinedIcon />
        </Badge>
      </IconButton>
    </Tooltip>
  );
}

export default NotificationBell;
