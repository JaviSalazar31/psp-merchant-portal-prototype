import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Box, Collapse, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
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
  children?: { to: string; label: string }[];
}

const ITEMS: SidebarItem[] = [
  { to: '/home', label: 'Home', icon: <HomeOutlinedIcon /> },
  {
    label: 'Transactions',
    icon: <SwapHorizIcon />,
    children: [
      { to: '/transactions/pay-in', label: 'Pay-In' },
      { to: '/transactions/pay-out', label: 'Pay-Out' },
    ],
  },
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
  const location = useLocation();

  const [txOpen, setTxOpen] = useState(() => location.pathname.startsWith('/transactions'));

  useEffect(() => {
    if (location.pathname.startsWith('/transactions')) setTxOpen(true);
  }, [location.pathname]);

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
              fontSize: 18,
              position: 'relative',
            }}
          >
            p
            <Box
              sx={{
                position: 'absolute',
                top: 6,
                right: 6,
                width: 6,
                height: 6,
                borderRadius: '50%',
                backgroundColor: colors.brandPrimary,
              }}
            />
          </Box>
        ) : (
          <Logo width={108} />
        )}
      </Box>

      <Stack sx={{ flex: 1, paddingY: 1.5, paddingX: 1, gap: 0.25, overflowY: 'auto' }}>
        {ITEMS.map(item => {
          if (item.children) {
            const isActive = location.pathname.startsWith('/transactions');
            return (
              <Box key={item.label}>
                <SidebarRow
                  icon={item.icon}
                  label={item.label}
                  active={isActive}
                  collapsed={collapsed}
                  rightSlot={!collapsed && (txOpen ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />)}
                  onClick={() => setTxOpen(o => !o)}
                />
                <Collapse in={txOpen && !collapsed} timeout="auto" unmountOnExit>
                  <Stack sx={{ pl: 4.5, pt: 0.25, gap: 0.25 }}>
                    {item.children.map(child => (
                      <SidebarSubItem
                        key={child.to}
                        to={child.to}
                        label={child.label}
                        onNavigate={onNavigate}
                      />
                    ))}
                  </Stack>
                </Collapse>
              </Box>
            );
          }
          return (
            <SidebarRow
              key={item.to}
              icon={item.icon}
              label={item.label}
              to={item.to}
              collapsed={collapsed}
              onNavigate={onNavigate}
            />
          );
        })}
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
  to?: string;
  active?: boolean;
  collapsed: boolean;
  rightSlot?: React.ReactNode;
  onClick?: () => void;
  onNavigate?: () => void;
}

function SidebarRow({ icon, label, to, active, collapsed, rightSlot, onClick, onNavigate }: RowProps) {
  const content = (
    <Stack
      direction="row"
      alignItems="center"
      spacing={1.5}
      sx={({ palette }) => ({
        paddingY: 1,
        paddingX: 1.25,
        borderRadius: 1.5,
        cursor: 'pointer',
        position: 'relative',
        color: palette.text.primary,
        backgroundColor: 'transparent',
        '&.is-active': {
          backgroundColor: 'rgba(124, 255, 69, 0.12)',
          '&::before': {
            content: '""',
            position: 'absolute',
            left: 0,
            top: 6,
            bottom: 6,
            width: 3,
            borderRadius: 999,
            backgroundColor: colors.brandPrimary,
          },
        },
        '&:hover': { backgroundColor: colors.bgSubtle },
      })}
      className={active ? 'is-active' : undefined}
    >
      <Box sx={{ width: 24, display: 'flex', justifyContent: 'center' }}>{icon}</Box>
      {!collapsed && (
        <>
          <Typography variant="body2" sx={{ fontWeight: active ? 600 : 500, flex: 1 }}>
            {label}
          </Typography>
          {rightSlot}
        </>
      )}
    </Stack>
  );

  if (to) {
    return (
      <NavLink
        to={to}
        onClick={() => onNavigate?.()}
        style={{ textDecoration: 'none', color: 'inherit' }}
      >
        {({ isActive }) => (
          <Box className={isActive ? 'wrapper-active' : ''}>
            {/* Reuse same structure via SidebarRow inner; here we re-render with isActive */}
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
                backgroundColor: isActive ? 'rgba(124, 255, 69, 0.12)' : 'transparent',
                '&::before': isActive
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
                '&:hover': { backgroundColor: isActive ? 'rgba(124, 255, 69, 0.12)' : colors.bgSubtle },
              }}
            >
              <Tooltip title={collapsed ? label : ''} placement="right">
                <Box sx={{ width: 24, display: 'flex', justifyContent: 'center' }}>{icon}</Box>
              </Tooltip>
              {!collapsed && (
                <Typography variant="body2" sx={{ fontWeight: isActive ? 600 : 500, flex: 1 }}>
                  {label}
                </Typography>
              )}
            </Stack>
          </Box>
        )}
      </NavLink>
    );
  }

  return (
    <Box onClick={onClick}>
      <Tooltip title={collapsed ? label : ''} placement="right">
        {content}
      </Tooltip>
    </Box>
  );
}

function SidebarSubItem({
  to,
  label,
  onNavigate,
}: {
  to: string;
  label: string;
  onNavigate?: () => void;
}) {
  return (
    <NavLink
      to={to}
      onClick={() => onNavigate?.()}
      style={{ textDecoration: 'none', color: 'inherit' }}
    >
      {({ isActive }) => (
        <Box
          sx={{
            paddingY: 0.75,
            paddingX: 1.25,
            borderRadius: 1.5,
            color: isActive ? colors.brandPrimaryDark : colors.textSecondary,
            fontSize: 13,
            fontWeight: isActive ? 600 : 500,
            cursor: 'pointer',
            '&:hover': { backgroundColor: colors.bgSubtle },
          }}
        >
          {label}
        </Box>
      )}
    </NavLink>
  );
}

export default Sidebar;
