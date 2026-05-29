import { Box, Stack, Tooltip, Typography } from '@mui/material';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import StatusBadge from '@/components/common/StatusBadge';
import EmptyState from '@/components/common/EmptyState';
import type { MockSettlement } from '@/mocks/settlements';
import { formatCurrency } from '@/constants/currencies';
import { toast } from '@/stores/toastStore';
import { colors } from '@/theme/tokens';

function fmtShortDate(d: Date): string {
  const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

function cycleLabel(salesDay: Date, payoutDate: Date): string {
  const dayMs = 24 * 60 * 60 * 1000;
  const diff = Math.round((payoutDate.getTime() - salesDay.getTime()) / dayMs);
  return `T+${Math.max(0, diff)}`;
}

function downloadReport(s: MockSettlement) {
  const lines = [
    `Reporte mock · ${s.id}`,
    `Día de ventas: ${s.salesDay.toISOString().slice(0, 10)}`,
    `Fecha de payout: ${s.payoutDate.toISOString().slice(0, 10)}`,
    `Moneda: ${s.currency}`,
    `Monto reportado: ${s.grossAmount}`,
    `Monto liquidado: ${s.netPayout}`,
    `Transacciones: ${s.transactionCount}`,
  ];
  const blob = new Blob([lines.join('\n')], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `psp-${s.id}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  toast.success(`Reporte de ${s.id} descargado.`);
}

interface HeaderWithTooltipProps {
  label: string;
  tooltip: string;
}

function HeaderWithTooltip({ label, tooltip }: HeaderWithTooltipProps) {
  return (
    <Stack direction="row" alignItems="center" spacing={0.5}>
      <span>{label}</span>
      <Tooltip title={tooltip} placement="top" arrow>
        <InfoOutlinedIcon sx={{ fontSize: 14, color: colors.textMuted }} />
      </Tooltip>
    </Stack>
  );
}

interface Props {
  rows: MockSettlement[];
  onRowClick: (row: MockSettlement) => void;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
}

export function SettlementsTable({ rows, onRowClick, hasActiveFilters, onClearFilters }: Props) {
  // Ocho columnas exactas según la definición productiva de Fase 1: Created On, From, To, Cycle,
  // Reporting Amount, Settlement Amount, Status, Actions. El ID del settlement queda accesible
  // como subtítulo bajo la fecha de creación.
  const columns: GridColDef<MockSettlement>[] = [
    {
      field: 'createdOn',
      headerName: 'CREATED ON',
      flex: 1.3,
      minWidth: 180,
      valueGetter: (_, row) => row.salesDay,
      renderCell: ({ row }) => (
        <Stack spacing={0.25} sx={{ paddingY: 0.5 }}>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {fmtShortDate(row.salesDay)}
          </Typography>
          <Typography
            variant="caption"
            sx={{ color: colors.textLink, fontFamily: 'monospace', fontSize: 11 }}
          >
            {row.id}
          </Typography>
        </Stack>
      ),
    },
    {
      field: 'from',
      headerName: 'FROM',
      flex: 0.9,
      minWidth: 120,
      valueGetter: (_, row) => row.salesDay,
      renderCell: ({ value }) => <Typography variant="caption">{fmtShortDate(value as Date)}</Typography>,
    },
    {
      field: 'to',
      headerName: 'TO',
      flex: 0.9,
      minWidth: 120,
      valueGetter: (_, row) => row.payoutDate,
      renderCell: ({ value }) => <Typography variant="caption">{fmtShortDate(value as Date)}</Typography>,
    },
    {
      field: 'cycle',
      headerName: 'CYCLE',
      width: 90,
      align: 'center',
      headerAlign: 'center',
      valueGetter: (_, row) => cycleLabel(row.salesDay, row.payoutDate),
      renderCell: ({ value }) => (
        <Typography variant="caption" sx={{ fontWeight: 600, fontFamily: 'monospace' }}>
          {String(value)}
        </Typography>
      ),
    },
    {
      field: 'reportingAmount',
      headerName: 'REPORTING AMOUNT',
      flex: 1,
      minWidth: 170,
      align: 'right',
      headerAlign: 'right',
      renderHeader: () => (
        <HeaderWithTooltip
          label="REPORTING AMOUNT"
          tooltip="Monto bruto reportado en el período (antes de comisiones, impuestos, reembolsos y contracargos)."
        />
      ),
      renderCell: ({ row }) => (
        <Typography variant="body2" sx={{ color: colors.textSecondary, fontWeight: 500 }}>
          {formatCurrency(row.grossAmount, row.currency)}
        </Typography>
      ),
    },
    {
      field: 'settlementAmount',
      headerName: 'SETTLEMENT AMOUNT',
      flex: 1,
      minWidth: 180,
      align: 'right',
      headerAlign: 'right',
      renderHeader: () => (
        <HeaderWithTooltip
          label="SETTLEMENT AMOUNT"
          tooltip="Monto neto liquidado a tu cuenta bancaria (bruto menos comisiones, impuestos, reembolsos y contracargos)."
        />
      ),
      renderCell: ({ row }) => (
        <Typography variant="body2" sx={{ fontWeight: 700 }}>
          {formatCurrency(row.netPayout, row.currency)}
        </Typography>
      ),
    },
    {
      field: 'status',
      headerName: 'STATUS',
      width: 130,
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
          sorting: { sortModel: [{ field: 'createdOn', sort: 'desc' }] },
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
