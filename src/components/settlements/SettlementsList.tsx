import { useMemo, useState } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import SettlementsKpiCards from './SettlementsKpiCards';
import SettlementsFilterBar, {
  EMPTY_SETTLEMENT_FILTERS,
  hasActiveSettlementFilters,
  type SettlementFilters,
} from './SettlementsFilterBar';
import SettlementsTable from './SettlementsTable';
import SettlementDetailModal from './SettlementDetailModal';
import ExportButton from '@/components/transactions/ExportButton';
import { MOCK_SETTLEMENTS, type MockSettlement } from '@/mocks/settlements';
import { colors } from '@/theme/tokens';

function filter(rows: MockSettlement[], f: SettlementFilters): MockSettlement[] {
  return rows.filter(r => {
    if (f.search) {
      const q = f.search.toLowerCase();
      if (!r.id.toLowerCase().includes(q) && !(r.bankReference ?? '').toLowerCase().includes(q)) {
        return false;
      }
    }
    if (f.status && r.status !== f.status) return false;
    if (f.currency && r.currency !== f.currency) return false;
    if (f.dateFrom) {
      const fromMs = new Date(`${f.dateFrom}T00:00:00`).getTime();
      if (r.salesDay.getTime() < fromMs) return false;
    }
    if (f.dateTo) {
      const toMs = new Date(`${f.dateTo}T23:59:59`).getTime();
      if (r.salesDay.getTime() > toMs) return false;
    }
    return true;
  });
}

export function SettlementsList() {
  const [filters, setFilters] = useState<SettlementFilters>(EMPTY_SETTLEMENT_FILTERS);
  const [selected, setSelected] = useState<MockSettlement | null>(null);

  const filtered = useMemo(() => filter(MOCK_SETTLEMENTS, filters), [filters]);
  const active = hasActiveSettlementFilters(filters);

  return (
    <Stack spacing={3}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={1.5}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', sm: 'center' }}
      >
        <Stack spacing={0.5}>
          <Typography variant="h1">Settlements</Typography>
          <Typography variant="body1" color="text.secondary">
            Liquidaciones procesadas y pendientes hacia tu cuenta bancaria.
          </Typography>
        </Stack>
        <ExportButton scope="settlements" />
      </Stack>

      <SettlementsKpiCards rows={MOCK_SETTLEMENTS} />
      <SettlementsFilterBar filters={filters} onChange={setFilters} />

      <Typography variant="body2" color="text.secondary">
        <Box component="span" sx={{ color: colors.textPrimary, fontWeight: 600 }}>
          {filtered.length}
        </Box>{' '}
        {filtered.length === 1 ? 'settlement' : 'settlements'} {active ? 'con los filtros aplicados' : 'totales'}
      </Typography>

      <SettlementsTable
        rows={filtered}
        onRowClick={s => setSelected(s)}
        hasActiveFilters={active}
        onClearFilters={() => setFilters(EMPTY_SETTLEMENT_FILTERS)}
      />

      <SettlementDetailModal
        settlement={selected}
        open={!!selected}
        onClose={() => setSelected(null)}
      />
    </Stack>
  );
}

export default SettlementsList;
