import { useState } from 'react';
import {
  Button,
  Divider,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import AddIcon from '@mui/icons-material/Add';
import { EMPTY_FILTERS, type TransactionFilters } from './filterTypes';
import { colors } from '@/theme/tokens';

export interface SavedView {
  key: string;
  label: string;
  description: string;
  filters: TransactionFilters;
}

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

function isoNDaysAgo(n: number): string {
  return new Date(Date.now() - n * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

export const VIEWS: SavedView[] = [
  {
    key: 'all',
    label: 'Todas las transacciones',
    description: 'Sin filtros aplicados',
    filters: EMPTY_FILTERS,
  },
  {
    key: 'pending_today',
    label: 'Pendientes hoy',
    description: 'status=Pendiente · fecha=hoy',
    filters: { ...EMPTY_FILTERS, status: ['PENDIENTE'], dateFrom: todayISO(), dateTo: todayISO() },
  },
  {
    key: 'disputes_30d',
    label: 'En disputa últimos 30 días',
    description: 'status=En disputa · fecha=últimos 30 días',
    filters: { ...EMPTY_FILTERS, status: ['EN_DISPUTA'], dateFrom: isoNDaysAgo(30), dateTo: todayISO() },
  },
];

interface Props {
  activeKey: string;
  onSelect: (view: SavedView) => void;
}

export function ViewsDropdown({ activeKey, onSelect }: Props) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const active = VIEWS.find(v => v.key === activeKey) ?? VIEWS[0];

  return (
    <>
      <Button
        variant="outlined"
        endIcon={<KeyboardArrowDownIcon />}
        onClick={e => setAnchorEl(e.currentTarget as HTMLElement)}
      >
        Vista: {active.label}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={!!anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{ paper: { sx: { minWidth: 320, borderRadius: 1.5 } } }}
      >
        {VIEWS.map(v => (
          <MenuItem
            key={v.key}
            selected={v.key === activeKey}
            onClick={() => {
              onSelect(v);
              setAnchorEl(null);
            }}
          >
            <ListItemText
              primary={
                <Stack direction="row" alignItems="center" spacing={0.75}>
                  {v.key === activeKey && (
                    <Typography variant="caption" sx={{ color: colors.brandPrimaryDark, fontWeight: 700 }}>●</Typography>
                  )}
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {v.label}
                  </Typography>
                </Stack>
              }
              secondary={v.description}
              primaryTypographyProps={{ fontSize: 14 }}
              secondaryTypographyProps={{ fontSize: 11 }}
            />
          </MenuItem>
        ))}
        <Divider />
        <Tooltip title="Próximamente — V2" placement="left">
          <span>
            <MenuItem disabled>
              <Stack direction="row" alignItems="center" spacing={1}>
                <AddIcon fontSize="small" />
                <Typography variant="body2">Crear vista personalizada</Typography>
              </Stack>
            </MenuItem>
          </span>
        </Tooltip>
      </Menu>
    </>
  );
}

export default ViewsDropdown;
