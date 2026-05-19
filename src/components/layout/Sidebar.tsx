import { NavLink } from 'react-router-dom';
import { Box, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Logo from '@/components/common/Logo';
import { useUIStore } from '@/stores/uiStore';
import { colors } from '@/theme/tokens';

export const SIDEBAR_WIDTH_EXPANDED = 240;
export const SIDEBAR_WIDTH_COLLAPSED = 72;

interface SidebarItem {
  to: string;
  label: string;
  icon: React.ReactNode;
  /** Otras rutas que deben marcar este item como activo (ej: /transactions/pay-in → /transactions/...). */
  matchPrefix?: string;
}

const ITEMS: SidebarItem[] = [
  { to: '/home', label: 'Home', icon: <HomeOutlinedIcon /> },
  { to: '/transactions/pay-in', label: 'Transactions', icon: <SwapHorizIcon />, matchPrefix: '/transactions' },
  { to: '/settlements', label: 'Settlements', icon: <AccountBalanceWalletOutlinedIcon /> },
  { to: '/users', label: 'Users', icon: <GroupOutlinedIcon /> },
  { to: '/roles', label: 'Roles', icon: <ShieldOutlinedIcon /> },
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
              fontWeight: 700,
              fontSize: 13,
              letterSpacing: 0.5,
              position: 'relative',
            }}
          >
            PSP
            <Box
              sx={{
                position: 'absolute',
                top: 5,
                right: 5,
                width: 5,
                height: 5,
                borderRadius: '50%',
                backgroundColor: colors.brandPrimary,
              }}
            />
          </Box>
        ) : (
          <Logo width={96} />
        )}
      </Box>

      <Stack sx={{ flex: 1, paddingY: 1.5, paddingX: 1, gap: 0.25, overflowY: 'auto' }}>
        {ITEMS.map(item => (
          <SidebarRow
            key={item.to}
            icon={item.icon}
            label={item.label}
            to={item.to}
            matchPrefix={item.matchPrefix}
            collapsed={collapsed}
            onNavigate={onNavigate}
          />
        ))}
      </Stack>

      {variant === 'permanent' && (
        <Box
          sx={{
            borderTop: `1px solid ${colors.borderDefault}`,
            paddingY: 1,
            paddingX: collapsed ? 1 : 2,
            display: 'flex',
            justifyContent: collapsed ? 'center' : 'flex-end',
          }}
        >
          <Tooltip title={collapsed ? 'Expandir' : 'Contraer'} placement="right">
            <IconButton size="small" onClick={() => toggle()}>
              {collapsed ? <ChevronRightIcon fontSize="small" /> : <ChevronLeftIcon fontSize="small" />}
            </IconButton>
          </Tooltip>
        </Box>
      )}
    </Box>
  );
}

interface RowProps {
  icon: React.ReactNode;
  label: string;
  to: string;
  matchPrefix?: string;
  collapsed: boolean;
  onNavigate?: () => void;
}

function SidebarRow({ icon, label, to, matchPrefix, collapsed, onNavigate }: RowProps) {
  return (
    <NavLink
      to={to}
      onClick={() => onNavigate?.()}
      style={{ textDecoration: 'none', color: 'inherit' }}
    >
      {({ isActive }) => {
        const active =
          isActive ||
          (matchPrefix
            ? window.location.pathname.startsWith(matchPrefix)
            : false);
        return (
          <Box>
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
                color: colors.textPrimary,
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
              <Tooltip title={collapsed ? label : ''} placement="right">
                <Box sx={{ width: 24, display: 'flex', justifyContent: 'center' }}>{icon}</Box>
              </Tooltip>
              {!collapsed && (
                <Typography variant="body2" sx={{ fontWeight: active ? 600 : 500, flex: 1 }}>
                  {label}
                </Typography>
              )}
            </Stack>
          </Box>
        );
      }}
    </NavLink>
  );
}

export default Sidebar;
