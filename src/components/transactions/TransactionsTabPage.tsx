import { useMemo, useState } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import TransactionFilterBar from './TransactionFilterBar';
import TransactionKpiCards from './TransactionKpiCards';
import TransactionsTable from './TransactionsTable';
import TransactionDetailModal from './TransactionDetailModal';
import { EMPTY_FILTERS, type TransactionFilters, hasActiveFilters } from './filterTypes';
import { useFilteredTransactions } from './useFilteredTransactions';
import { DEFAULT_VISIBLE_COLUMNS } from './transactionColumns';
import { MOCK_TRANSACTIONS, type MockTransaction } from '@/mocks/transactions';
import { colors } from '@/theme/tokens';

interface Props {
  scope: 'pay-in';
}

/**
 * Tab principal de Transactions — Fase 1 MVP.
 *
 * Cambios 21/05 con Producto:
 * - Se quitan los botones "Filtros / Columnas / Vista" (overhead que el
 *   comercio no necesita en V1). Los filtros básicos siguen disponibles
 *   en la barra superior. Los datos adicionales se acceden vía el ícono
 *   ojito en cada fila (drill-down).
 * - Las columnas visibles quedan fijas en el set default. Para campos
 *   extra (cliente, monto neto, fecha de aprobación, moneda) el comercio
 *   abre el modal de detalle.
 */
export function TransactionsTabPage({ scope }: Props) {
  const [filters, setFilters] = useState<TransactionFilters>(EMPTY_FILTERS);
  const [selected, setSelected] = useState<MockTransaction | null>(null);

  const sourceRows = useMemo(
    () => MOCK_TRANSACTIONS.filter(t => t.type === scope),
    [scope],
  );

  const filtered = useFilteredTransactions(sourceRows, filters);
  const activeFilters = hasActiveFilters(filters);

  return (
    <Stack spacing={3}>
      <TransactionFilterBar filters={filters} onChange={setFilters} scope={scope} />
      <TransactionKpiCards scope={scope} rows={filtered} />

      <Typography variant="body2" color="text.secondary">
        <Box component="span" sx={{ color: colors.textPrimary, fontWeight: 600 }}>
          {filtered.length.toLocaleString('es-AR')}
        </Box>{' '}
        {filtered.length === 1 ? 'resultado' : 'resultados'}{' '}
        {activeFilters ? 'con los filtros aplicados' : 'encontrados'}
      </Typography>

      <TransactionsTable
        rows={filtered}
        onRowClick={row => setSelected(row)}
        columnVisibility={DEFAULT_VISIBLE_COLUMNS}
        hasActiveFilters={activeFilters}
        onClearFilters={() => setFilters(EMPTY_FILTERS)}
      />

      <TransactionDetailModal
        transaction={selected}
        open={!!selected}
        onClose={() => setSelected(null)}
      />
    </Stack>
  );
}

export default TransactionsTabPage;
