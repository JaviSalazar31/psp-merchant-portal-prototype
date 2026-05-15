import { Box, Stack, Typography } from '@mui/material';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import StatusBadge from '@/components/common/StatusBadge';
import EmptyState from '@/components/common/EmptyState';
import type { MockSettlement } from '@/mocks/settlements';
import { formatCurrency } from '@/constants/currencies';
import { colors } from '@/theme/tokens';

function fmtShortDate(d: Date): string {
  const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

interface Props {
  rows: MockSettlement[];
  onRowClick: (row: MockSettlement) => void;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
}

export function SettlementsTable({ rows, onRowClick, hasActiveFilters, onClearFilters }: Props) {
  const columns: GridColDef<MockSettlement>[] = [
    {
      field: 'id',
      headerName: 'ID SETTLEMENT',
      flex: 1.4,
      minWidth: 220,
      renderCell: ({ value }) => (
        <Typography sx={{ color: colors.textLink, fontFamily: 'monospace', fontSize: 12, fontWeight: 600 }}>
          {String(value)}
        </Typography>
      ),
    },
    {
      field: 'salesDay',
      headerName: 'DÍA VENTAS',
      flex: 1,
      minWidth: 130,
      valueGetter: (_, row) => row.salesDay,
      renderCell: ({ value }) => <Typography variant="caption">{fmtShortDate(value as Date)}</Typography>,
    },
    {
      field: 'payoutDate',
      headerName: 'PAYOUT',
      flex: 1,
      minWidth: 130,
      valueGetter: (_, row) => row.payoutDate,
      renderCell: ({ value }) => <Typography variant="caption">{fmtShortDate(value as Date)}</Typography>,
    },
    {
      field: 'currency',
      headerName: 'MONEDA',
      width: 90,
    },
    {
      field: 'transactionCount',
      headerName: 'TX',
      width: 80,
      align: 'right',
      headerAlign: 'right',
      renderCell: ({ value }) => (
        <Typography variant="caption" sx={{ fontWeight: 600 }}>
          {value as number}
        </Typography>
      ),
    },
    {
      field: 'netPayout',
      headerName: 'MONTO NETO',
      flex: 1,
      minWidth: 160,
      align: 'right',
      headerAlign: 'right',
      renderCell: ({ row }) => (
        <Typography variant="body2" sx={{ fontWeight: 700 }}>
          {formatCurrency(row.netPayout, row.currency)}
        </Typography>
      ),
    },
    {
      field: 'status',
      headerName: 'ESTADO',
      width: 140,
      renderCell: ({ value }) => <StatusBadge status={String(value)} />,
    },
  ];

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
        autoHeight
        disableRowSelectionOnClick
        onRowClick={params => onRowClick(params.row)}
        initialState={{
          pagination: { paginationModel: { pageSize: 10, page: 0 } },
          sorting: { sortModel: [{ field: 'salesDay', sort: 'desc' }] },
        }}
        pageSizeOptions={[10, 25, 50]}
        slots={{
          noRowsOverlay: () => (
            <Stack alignItems="center" justifyContent="center" sx={{ height: '100%' }}>
              {hasActiveFilters ? (
                <EmptyState
                  variant="no-results"
                  title="No encontramos settlements"
                  description="Probá con otros filtros o limpialos para ver todos."
                  cta={<button onClick={onClearFilters} style={{ display: 'none' }}>x</button>}
                />
              ) : (
                <EmptyState
                  title="Todavía no tenés settlements"
                  description="Aparecerán acá cuando proceses tu primera transacción."
                />
              )}
            </Stack>
          ),
        }}
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
          '& .MuiDataGrid-row': { cursor: 'pointer' },
          '& .MuiDataGrid-cell': { borderBottom: `1px solid ${colors.borderDefault}` },
          '& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within': { outline: 'none' },
        }}
        style={{ minHeight: rows.length === 0 ? 400 : undefined }}
      />
    </Box>
  );
}

export default SettlementsTable;
