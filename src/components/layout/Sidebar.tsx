import { NavLink } from 'react-router-dom';
import { Box, Chip, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
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
  matchPrefix?: string;
  demo?: boolean;
}

const ITEMS: SidebarItem[] = [
  { to: '/home', label: 'Home', icon: <HomeOutlinedIcon /> },
  { to: '/transactions/pay-in', label: 'Transactions', icon: <SwapHorizIcon />, matchPrefix: '/transactions' },
  { to: '/settlements', label: 'Settlements', icon: <AccountBalanceWalletOutlinedIcon /> },
  { to: '/_demo-404', label: 'Página 404', icon: <LinkOffIcon />, demo: true },
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
        height: '100%',
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
          <Logo width={96} />
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

      {/* Footer: Configuración separada de la parte operativa (Home/Transactions/
          Settlements), tal como se acordó. Cerrar sesión NO está acá: vive en el
          menú del avatar (header). El chevron de colapso queda alineado a la derecha. */}
      <Box
        sx={{
          borderTop: `1px solid ${colors.borderDefault}`,
          paddingY: 1,
          paddingX: 1,
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          spacing={0.5}
          sx={{
            justifyContent: collapsed ? 'center' : 'space-between',
          }}
        >
          {!collapsed && (
            <Box sx={{ flex: 1 }}>
              <SidebarRow
                item={{ to: '/configuracion', label: 'Configuración', icon: <SettingsOutlinedIcon /> }}
                collapsed={false}
                onNavigate={onNavigate}
              />
            </Box>
          )}
          {collapsed && (
            <NavLink
              to="/configuracion"
              onClick={() => onNavigate?.()}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <Tooltip title="Configuración" placement="right">
                <IconButton size="small">
                  <SettingsOutlinedIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </NavLink>
          )}
          {variant === 'permanent' && (
            <Tooltip title={collapsed ? 'Expandir' : 'Contraer'} placement="right">
              <IconButton size="small" onClick={() => toggle()}>
                {collapsed ? <ChevronRightIcon fontSize="small" /> : <ChevronLeftIcon fontSize="small" />}
              </IconButton>
            </Tooltip>
          )}
        </Stack>
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
  const { icon, label, to, matchPrefix, demo } = item;

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
