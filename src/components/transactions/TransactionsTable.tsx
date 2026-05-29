import { useMemo, useState } from 'react';
import { Box, Button } from '@mui/material';
import { DataGrid, type GridColumnVisibilityModel } from '@mui/x-data-grid';
import EmptyState from '@/components/common/EmptyState';
import ErrorState from '@/components/common/ErrorState';
import { buildTransactionColumns, DEFAULT_VISIBLE_COLUMNS } from './transactionColumns';
import type { MockTransaction } from '@/mocks/transactions';
import { colors } from '@/theme/tokens';

interface Props {
  rows: MockTransaction[];
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  onRowClick: (row: MockTransaction) => void;
  columnVisibility?: GridColumnVisibilityModel;
  onColumnVisibilityChange?: (m: GridColumnVisibilityModel) => void;
  /** True si los resultados están vacíos por filtros activos (no por ausencia total de data). */
  hasActiveFilters?: boolean;
  onClearFilters?: () => void;
}

export function TransactionsTable({
  rows,
  loading,
  error,
  onRetry,
  onRowClick,
  columnVisibility,
  onColumnVisibilityChange,
  hasActiveFilters,
  onClearFilters,
}: Props) {
  const [internalVisibility, setInternalVisibility] = useState<GridColumnVisibilityModel>(
    DEFAULT_VISIBLE_COLUMNS,
  );
  const visibility = columnVisibility ?? internalVisibility;

  // Columnas con handler dinámico para el ícono ojito de la última columna.
  const columns = useMemo(() => buildTransactionColumns(onRowClick), [onRowClick]);

  const isEmpty = !loading && !error && rows.length === 0;

  const NoRowsOverlay = useMemo(
    () => () =>
      hasActiveFilters ? (
        <EmptyState
          variant="no-results"
          title="No encontramos resultados"
          description="Probá con otros filtros o limpialos para ver todas las transacciones."
          cta={
            onClearFilters && (
              <Button variant="outlined" onClick={onClearFilters}>
                Limpiar filtros
              </Button>
            )
          }
        />
      ) : (
        <EmptyState
          title="No hay transacciones todavía"
          description="Apenas proceses tu primer pago, aparecerá acá."
        />
      ),
    [hasActiveFilters, onClearFilters],
  );

  if (error) {
    return (
      <ErrorState
        message="No pudimos cargar las transacciones."
        description="Verificá tu conexión e intentá de nuevo."
        onRetry={onRetry}
      />
    );
  }

  return (
    <Box
      sx={{
        backgroundColor: colors.bgCard,
        borderRadius: 2,
        border: `1px solid ${colors.borderDefault}`,
        overflow: 'hidden',
      }}
    >
      <DataGrid
        rows={rows}
        columns={columns}
        loading={loading}
        autoHeight
        disableRowSelectionOnClick
        onRowClick={params => onRowClick(params.row)}
        columnVisibilityModel={visibility}
        onColumnVisibilityModelChange={m => {
          if (onColumnVisibilityChange) onColumnVisibilityChange(m);
          else setInternalVisibility(m);
        }}
        initialState={{
          pagination: { paginationModel: { pageSize: 10, page: 0 } },
          sorting: { sortModel: [{ field: 'createdAt', sort: 'desc' }] },
        }}
        pageSizeOptions={[10, 25, 50]}
        slots={{ noRowsOverlay: NoRowsOverlay }}
        sx={{
          border: 'none',
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: colors.bgSubtle,
            borderBottom: `1px solid ${colors.borderDefault}`,
          },
          '& .MuiDataGrid-columnHeaderTitle': {
            fontSize: 11,
            letterSpacing: 0.5,
            fontWeight: 700,
            color: colors.textSecondary,
            textTransform: 'uppercase',
          },
          '& .MuiDataGrid-row': {
            cursor: 'pointer',
          },
          '& .MuiDataGrid-cell': {
            borderBottom: `1px solid ${colors.borderDefault}`,
          },
          '& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within': {
            outline: 'none',
          },
          // Skeleton overlay durante loading
          '& .MuiDataGrid-overlay': {
            backgroundColor: 'transparent',
          },
        }}
        slotProps={{
          loadingOverlay: { variant: 'linear-progress', noRowsVariant: 'skeleton' },
        }}
        style={{ minHeight: isEmpty ? 400 : undefined }}
      />
    </Box>
  );
}

export default TransactionsTable;
