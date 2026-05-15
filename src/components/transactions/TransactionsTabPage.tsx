import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Stack, Typography } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import ViewColumnOutlinedIcon from '@mui/icons-material/ViewColumnOutlined';
import AddIcon from '@mui/icons-material/Add';
import type { GridColumnVisibilityModel } from '@mui/x-data-grid';
import TransactionFilterBar from './TransactionFilterBar';
import TransactionKpiCards from './TransactionKpiCards';
import TransactionsTable from './TransactionsTable';
import TransactionDetailModal from './TransactionDetailModal';
import ColumnsModal from './ColumnsModal';
import AdvancedFiltersModal from './AdvancedFiltersModal';
import ViewsDropdown from './ViewsDropdown';
import { EMPTY_FILTERS, type TransactionFilters, hasActiveFilters } from './filterTypes';
import { useFilteredTransactions } from './useFilteredTransactions';
import { DEFAULT_VISIBLE_COLUMNS } from './transactionColumns';
import { MOCK_TRANSACTIONS, type MockTransaction } from '@/mocks/transactions';
import { colors } from '@/theme/tokens';

interface Props {
  scope: 'pay-in' | 'pay-out';
}

export function TransactionsTabPage({ scope }: Props) {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<TransactionFilters>(EMPTY_FILTERS);
  const [activeViewKey, setActiveViewKey] = useState<string>('all');
  const [columnVisibility, setColumnVisibility] = useState<GridColumnVisibilityModel>(DEFAULT_VISIBLE_COLUMNS);
  const [selected, setSelected] = useState<MockTransaction | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [columnsOpen, setColumnsOpen] = useState(false);

  const sourceRows = useMemo(
    () => MOCK_TRANSACTIONS.filter(t => t.type === scope),
    [scope],
  );

  const filtered = useFilteredTransactions(sourceRows, filters);

  const activeFilters = hasActiveFilters(filters);

  return (
    <Stack spacing={3}>
      <TransactionFilterBar filters={filters} onChange={f => { setFilters(f); setActiveViewKey('all'); }} scope={scope} />
      <TransactionKpiCards scope={scope} rows={filtered} />

      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={1.5}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', md: 'center' }}
      >
        <Typography variant="body2" color="text.secondary">
          <Box component="span" sx={{ color: colors.textPrimary, fontWeight: 600 }}>
            {filtered.length.toLocaleString('es-AR')}
          </Box>{' '}
          {filtered.length === 1 ? 'resultado' : 'resultados'} {activeFilters ? 'con los filtros aplicados' : 'encontrados'}
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          {scope === 'pay-out' && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate('/transactions/pay-out/create')}
              sx={{
                backgroundColor: colors.brandPrimary,
                color: colors.brandDarkest,
                '&:hover': { backgroundColor: '#5DE82A' },
              }}
            >
              Crear Pay-Out
            </Button>
          )}
          <Button
            variant="outlined"
            startIcon={<FilterListIcon fontSize="small" />}
            onClick={() => setFiltersOpen(true)}
          >
            Filtros
          </Button>
          <Button
            variant="outlined"
            startIcon={<ViewColumnOutlinedIcon fontSize="small" />}
            onClick={() => setColumnsOpen(true)}
          >
            Columnas
          </Button>
          <ViewsDropdown
            activeKey={activeViewKey}
            onSelect={v => {
              setActiveViewKey(v.key);
              setFilters(v.filters);
            }}
          />
        </Stack>
      </Stack>

      <TransactionsTable
        rows={filtered}
        onRowClick={row => setSelected(row)}
        columnVisibility={columnVisibility}
        onColumnVisibilityChange={setColumnVisibility}
        hasActiveFilters={activeFilters}
        onClearFilters={() => setFilters(EMPTY_FILTERS)}
      />

      <TransactionDetailModal
        transaction={selected}
        open={!!selected}
        onClose={() => setSelected(null)}
      />

      <AdvancedFiltersModal
        open={filtersOpen}
        filters={filters}
        onClose={() => setFiltersOpen(false)}
        onApply={f => {
          setFilters(f);
          setActiveViewKey('all');
        }}
      />

      <ColumnsModal
        open={columnsOpen}
        visibility={columnVisibility}
        onClose={() => setColumnsOpen(false)}
        onApply={setColumnVisibility}
      />
    </Stack>
  );
}

export default TransactionsTabPage;
