import {
  Box,
  Button,
  Grid,
  MenuItem,
  Stack,
  TextField,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { COUNTRIES } from '@/constants/countries';
import { CURRENCIES } from '@/constants/currencies';
import { PAYMENT_METHODS } from '@/constants/paymentMethods';
import { TRANSACTION_STATES, type TransactionStatusKey, PAYOUT_STATES } from '@/constants/transactionStates';
import type { TransactionFilters } from './filterTypes';
import { EMPTY_FILTERS } from './filterTypes';
import { colors } from '@/theme/tokens';

interface Props {
  filters: TransactionFilters;
  onChange: (f: TransactionFilters) => void;
  /** Si es pay-out, oculta el estado EN_DISPUTA. */
  scope: 'pay-in' | 'pay-out';
}

export function TransactionFilterBar({ filters, onChange, scope }: Props) {
  const set = <K extends keyof TransactionFilters>(key: K, value: TransactionFilters[K]) =>
    onChange({ ...filters, [key]: value });

  const statusOptions: TransactionStatusKey[] =
    scope === 'pay-out' ? PAYOUT_STATES : (Object.keys(TRANSACTION_STATES) as TransactionStatusKey[]);

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
            placeholder="ID o referencia"
            InputProps={{
              startAdornment: <SearchIcon sx={{ fontSize: 18, color: colors.textMuted, mr: 0.5 }} />,
            }}
          />
        </Grid>
        <Grid item xs={6} md={2}>
          <TextField
            select
            size="small"
            value={filters.country[0] ?? ''}
            onChange={e => set('country', e.target.value ? [e.target.value] : [])}
            label="País"
            SelectProps={{ displayEmpty: true }}
            InputLabelProps={{ shrink: true }}
          >
            <MenuItem value="">
              <em>Todos</em>
            </MenuItem>
            {COUNTRIES.map(c => (
              <MenuItem key={c.code} value={c.code}>
                {c.flag} {c.code}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={6} md={2}>
          <TextField
            select
            size="small"
            value={filters.currency[0] ?? ''}
            onChange={e => set('currency', e.target.value ? [e.target.value] : [])}
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
            select
            size="small"
            value={filters.paymentMethod[0] ?? ''}
            onChange={e => set('paymentMethod', e.target.value ? [e.target.value] : [])}
            label="Método"
            SelectProps={{ displayEmpty: true }}
            InputLabelProps={{ shrink: true }}
          >
            <MenuItem value="">
              <em>Todos</em>
            </MenuItem>
            {PAYMENT_METHODS.map(m => (
              <MenuItem key={m.key} value={m.key}>
                {m.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={6} md={2}>
          <TextField
            select
            size="small"
            value={filters.status[0] ?? ''}
            onChange={e => set('status', e.target.value ? [e.target.value as TransactionStatusKey] : [])}
            label="Estado"
            SelectProps={{ displayEmpty: true }}
            InputLabelProps={{ shrink: true }}
          >
            <MenuItem value="">
              <em>Todos</em>
            </MenuItem>
            {statusOptions.map(key => (
              <MenuItem key={key} value={key}>
                {TRANSACTION_STATES[key].label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={6} md={2}>
          <TextField
            size="small"
            type="date"
            value={filters.dateFrom ?? ''}
            onChange={e => set('dateFrom', e.target.value || null)}
            label="Fecha desde"
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={6} md={2}>
          <TextField
            size="small"
            type="date"
            value={filters.dateTo ?? ''}
            onChange={e => set('dateTo', e.target.value || null)}
            label="Fecha hasta"
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} md={8}>
          <Stack direction="row" spacing={1} justifyContent="flex-end" sx={{ height: '100%' }}>
            <Button
              variant="text"
              startIcon={<RestartAltIcon fontSize="small" />}
              onClick={() => onChange(EMPTY_FILTERS)}
            >
              Limpiar
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}

export default TransactionFilterBar;
