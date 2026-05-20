import { NavLink } from 'react-router-dom';
import { Box, Chip, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import WebhookOutlinedIcon from '@mui/icons-material/WebhookOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import LinkOffIcon from '@mui/icons-material/LinkOff';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Logo from '@/components/common/Logo';
import { useUIStore } from '@/stores/uiStore';
import { colors } from '@/theme/tokens';

export const SIDEBAR_WIDTH_EXPANDED = 240;
export const SIDEBAR_WIDTH_COLLAPSED = 72;

interface SidebarItem {
  to?: string;
  label: string;
  icon: React.ReactNode;
  /** Otras rutas que deben marcar este item como activo (ej: /transactions/pay-in → /transactions/...). */
  matchPrefix?: string;
  /** Entrada visible pero sin funcionalidad (señal de roadmap). */
  disabled?: boolean;
  /** Texto del tooltip al hover (usado por las entradas disabled). */
  tooltip?: string;
  /** Sangría extra para entradas que cuelgan de un grupo. */
  indent?: boolean;
  /** Entrada de ayuda para revisión de UX/UI del prototipo, no es parte del producto. */
  demo?: boolean;
}

const ITEMS: SidebarItem[] = [
  { to: '/home', label: 'Home', icon: <HomeOutlinedIcon /> },
  { to: '/transactions/pay-in', label: 'Transactions', icon: <SwapHorizIcon />, matchPrefix: '/transactions' },
  {
    label: 'Pay-Out',
    icon: <PaymentsOutlinedIcon />,
    disabled: true,
    indent: true,
    tooltip: 'Próximamente disponible',
  },
  { to: '/settlements', label: 'Settlements', icon: <AccountBalanceWalletOutlinedIcon /> },
  { to: '/users', label: 'Users', icon: <GroupOutlinedIcon /> },
  { to: '/notifications', label: 'Canales de notificación', icon: <WebhookOutlinedIcon /> },
  { to: '/_demo-404', label: 'Página 404', icon: <LinkOffIcon />, demo: true },
];

const FOOTER_ITEMS: SidebarItem[] = [
  { to: '/profile/wizard', label: 'Perfil', icon: <AccountCircleOutlinedIcon /> },
];

interface SidebarProps {
  variant: 'permanent' | 'temporary';
  onNavigate?: () => void;
}

export function Sidebar({ variant, onNavigate }: SidebarProps) {
  const collapsed = useUIStore(s => s.sidebarCollapsed) && variant === 'permanent';
  const toggle = useUIStore(s => s.toggleSidebar);

  const width = collapsed ? SIDEBAR_WIDTH_COLLAPSED : SIDEBAR_WIDTH_EXPANDED;

  return (
    <Box
      sx={{
        width,
        height: '100vh',
        backgroundColor: colors.bgCard,
        borderRight: `1px solid ${colors.borderDefault}`,
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 180ms ease',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          height: 64,
          paddingX: collapsed ? 1 : 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'flex-start',
          borderBottom: `1px solid ${colors.borderDefault}`,
        }}
      >
        {collapsed ? (
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: 1,
              backgroundColor: colors.brandDarkest,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: colors.textInverse,
              fontWeight: 800,
              fontSize: 18,
              position: 'relative',
            }}
          >
            P
            <Box
              sx={{
                position: 'absolute',
                // Dot anclado a la esquina superior del trazo vertical de la P,
                // como acento tipografico (no flotando suelto a la derecha).
                top: 5,
                right: 12,
                width: 6,
                height: 6,
                borderRadius: '50%',
                backgroundColor: colors.brandPrimary,
              }}
            />
          </Box>
        ) : (
          <Logo width={68} />
        )}
      </Box>

      <Stack sx={{ flex: 1, paddingY: 1.5, paddingX: 1, gap: 0.25, overflowY: 'auto' }}>
        {ITEMS.map(item => (
          <SidebarRow
            key={item.to ?? item.label}
            item={item}
            collapsed={collapsed}
            onNavigate={onNavigate}
          />
        ))}
      </Stack>

      <Box
        sx={{
          borderTop: `1px solid ${colors.borderDefault}`,
          paddingY: 1,
          paddingX: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 0.25,
        }}
      >
        {FOOTER_ITEMS.map(item => (
          <SidebarRow
            key={item.to ?? item.label}
            item={item}
            collapsed={collapsed}
            onNavigate={onNavigate}
          />
        ))}
        {variant === 'permanent' && (
          <Box sx={{ display: 'flex', justifyContent: collapsed ? 'center' : 'flex-end', mt: 0.25 }}>
            <Tooltip title={collapsed ? 'Expandir' : 'Contraer'} placement="right">
              <IconButton size="small" onClick={() => toggle()}>
                {collapsed ? <ChevronRightIcon fontSize="small" /> : <ChevronLeftIcon fontSize="small" />}
              </IconButton>
            </Tooltip>
          </Box>
        )}
      </Box>
    </Box>
  );
}

interface RowProps {
  item: SidebarItem;
  collapsed: boolean;
  onNavigate?: () => void;
}

function SidebarRow({ item, collapsed, onNavigate }: RowProps) {
  const { icon, label, to, matchPrefix, disabled, tooltip, indent, demo } = item;

  if (disabled) {
    return (
      <Tooltip title={collapsed ? `${label} · ${tooltip ?? ''}` : tooltip ?? ''} placement="right">
        <Stack
          direction="row"
          alignItems="center"
          spacing={1.5}
          sx={{
            paddingY: 1,
            paddingX: 1.25,
            paddingLeft: indent && !collapsed ? 3 : 1.25,
            borderRadius: 1.5,
            cursor: 'not-allowed',
            color: colors.textMuted,
            opacity: 0.7,
          }}
        >
          <Box sx={{ width: 24, display: 'flex', justifyContent: 'center' }}>{icon}</Box>
          {!collapsed && (
            <>
              <Typography variant="body2" sx={{ fontWeight: 500, flex: 1 }}>
                {label}
              </Typography>
              <Chip
                label="Próximamente"
                size="small"
                sx={{
                  height: 18,
                  fontSize: 10,
                  fontWeight: 600,
                  backgroundColor: colors.bgSubtle,
                  color: colors.textMuted,
                }}
              />
            </>
          )}
        </Stack>
      </Tooltip>
    );
  }

  return (
    <NavLink to={to ?? '#'} onClick={() => onNavigate?.()} style={{ textDecoration: 'none', color: 'inherit' }}>
      {({ isActive }) => {
        const active =
          isActive || (matchPrefix ? window.location.pathname.startsWith(matchPrefix) : false);
        return (
          <Stack
            direction="row"
            alignItems="center"
            spacing={1.5}
            sx={{
              paddingY: 1,
              paddingX: 1.25,
              borderRadius: 1.5,
              cursor: 'pointer',
              position: 'relative',
              color: demo ? colors.textMuted : colors.textPrimary,
              backgroundColor: active ? 'rgba(124, 255, 69, 0.12)' : 'transparent',
              '&::before': active
                ? {
                    content: '""',
                    position: 'absolute',
                    left: 0,
                    top: 6,
                    bottom: 6,
                    width: 3,
                    borderRadius: 999,
                    backgroundColor: colors.brandPrimary,
                  }
                : undefined,
              '&:hover': { backgroundColor: active ? 'rgba(124, 255, 69, 0.12)' : colors.bgSubtle },
            }}
          >
            <Tooltip title={collapsed ? (demo ? `${label} · Demo` : label) : ''} placement="right">
              <Box sx={{ width: 24, display: 'flex', justifyContent: 'center' }}>{icon}</Box>
            </Tooltip>
            {!collapsed && (
              <>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: active ? 600 : 500, flex: 1 }}
                >
                  {label}
                </Typography>
                {demo && (
                  <Chip
                    label="Demo"
                    size="small"
                    sx={{
                      height: 18,
                      fontSize: 10,
                      fontWeight: 600,
                      backgroundColor: colors.bannerWarning.bg,
                      color: colors.bannerWarning.fg,
                    }}
                  />
                )}
              </>
            )}
          </Stack>
        );
      }}
    </NavLink>
  );
}

export default Sidebar;
