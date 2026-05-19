import { Box, Button, Grid, MenuItem, Stack, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { CURRENCIES } from '@/constants/currencies';
import { SETTLEMENT_STATES, type SettlementStatusKey } from '@/constants/transactionStates';
import { colors } from '@/theme/tokens';

export interface SettlementFilters {
  search: string;
  status: SettlementStatusKey | '';
  currency: string;
  dateFrom: string | null;
  dateTo: string | null;
}

export const EMPTY_SETTLEMENT_FILTERS: SettlementFilters = {
  search: '',
  status: '',
  currency: '',
  dateFrom: null,
  dateTo: null,
};

export function hasActiveSettlementFilters(f: SettlementFilters): boolean {
  return !!f.search || !!f.status || !!f.currency || !!f.dateFrom || !!f.dateTo;
}

interface Props {
  filters: SettlementFilters;
  onChange: (f: SettlementFilters) => void;
}

export function SettlementsFilterBar({ filters, onChange }: Props) {
  const set = <K extends keyof SettlementFilters>(key: K, value: SettlementFilters[K]) =>
    onChange({ ...filters, [key]: value });

  return (
    <Box
      sx={{
        padding: 2,
        borderRadius: 2,
        border: `1px solid ${colors.borderDefault}`,
        backgroundColor: colors.bgCard,
      }}
    >
      <Grid container spacing={1.5}>
        <Grid item xs={12} md={4}>
          <TextField
            size="small"
            value={filters.search}
            onChange={e => set('search', e.target.value)}
            placeholder="ID o referencia bancaria"
            InputProps={{
              startAdornment: <SearchIcon sx={{ fontSize: 18, color: colors.textMuted, mr: 0.5 }} />,
            }}
          />
        </Grid>
        <Grid item xs={6} md={2}>
          <TextField
            select
            size="small"
            value={filters.status}
            onChange={e => set('status', e.target.value as SettlementStatusKey | '')}
            label="Estado"
            SelectProps={{ displayEmpty: true }}
            InputLabelProps={{ shrink: true }}
          >
            <MenuItem value="">
              <em>Todos</em>
            </MenuItem>
            {(Object.keys(SETTLEMENT_STATES) as SettlementStatusKey[]).map(s => (
              <MenuItem key={s} value={s}>
                {SETTLEMENT_STATES[s].label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={6} md={2}>
          <TextField
            select
            size="small"
            value={filters.currency}
            onChange={e => set('currency', e.target.value)}
            label="Moneda"
            SelectProps={{ displayEmpty: true }}
            InputLabelProps={{ shrink: true }}
          >
            <MenuItem value="">
              <em>Todas</em>
            </MenuItem>
            {CURRENCIES.map(c => (
              <MenuItem key={c.code} value={c.code}>
                {c.code}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={6} md={2}>
          <TextField
            size="small"
            type="date"
            label="Fecha desde"
            InputLabelProps={{ shrink: true }}
            value={filters.dateFrom ?? ''}
            onChange={e => set('dateFrom', e.target.value || null)}
          />
        </Grid>
        <Grid item xs={6} md={2}>
          <TextField
            size="small"
            type="date"
            label="Fecha hasta"
            InputLabelProps={{ shrink: true }}
            value={filters.dateTo ?? ''}
            onChange={e => set('dateTo', e.target.value || null)}
          />
        </Grid>
        <Grid item xs={12}>
          <Stack direction="row" spacing={1} justifyContent="flex-end">
            <Button
              variant="text"
              startIcon={<RestartAltIcon fontSize="small" />}
              onClick={() => onChange(EMPTY_SETTLEMENT_FILTERS)}
            >
              Limpiar
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}

export default SettlementsFilterBar;
