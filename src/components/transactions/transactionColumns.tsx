import { Box, Stack, Typography } from '@mui/material';
import type { GridColDef } from '@mui/x-data-grid';
import StatusBadge from '@/components/common/StatusBadge';
import type { MockTransaction } from '@/mocks/transactions';
import { COUNTRY_BY_CODE } from '@/constants/countries';
import { PAYMENT_METHOD_BY_KEY } from '@/constants/paymentMethods';
import { formatCurrency } from '@/constants/currencies';
import { colors } from '@/theme/tokens';

function fmtDateTime(d: Date): string {
  const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  const day = String(d.getDate()).padStart(2, '0');
  const mon = months[d.getMonth()];
  const yyyy = d.getFullYear();
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `${day} ${mon} ${yyyy} · ${hh}:${mm}`;
}

export const TRANSACTION_COLUMN_DEFS: GridColDef<MockTransaction>[] = [
  {
    field: 'id',
    headerName: 'ID TRANSACCIÓN',
    flex: 1.5,
    minWidth: 220,
    sortable: true,
    renderCell: ({ value }) => (
      <Box
        sx={{
          color: colors.textLink,
          fontFamily: 'monospace',
          fontSize: 12,
          fontWeight: 600,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {String(value)}
      </Box>
    ),
  },
  {
    field: 'reference',
    headerName: 'REFERENCIA',
    flex: 1.2,
    minWidth: 180,
    sortable: true,
    renderCell: ({ value }) => (
      <Box sx={{ fontFamily: 'monospace', fontSize: 12, color: colors.textSecondary }}>
        {String(value)}
      </Box>
    ),
  },
  {
    field: 'createdAt',
    headerName: 'FECHA',
    flex: 1,
    minWidth: 170,
    sortable: true,
    valueGetter: (_, row) => row.createdAt,
    renderCell: ({ value }) => (
      <Typography variant="caption">{fmtDateTime(value as Date)}</Typography>
    ),
  },
  {
    field: 'country',
    headerName: 'PAÍS',
    width: 90,
    sortable: false,
    renderCell: ({ value }) => {
      const c = COUNTRY_BY_CODE[String(value)];
      return (
        <Stack direction="row" alignItems="center" spacing={0.5}>
          <Box component="span" sx={{ fontSize: 14 }}>
            {c?.flag}
          </Box>
          <Typography variant="caption" sx={{ fontWeight: 600 }}>
            {value as string}
          </Typography>
        </Stack>
      );
    },
  },
  {
    field: 'paymentMethod',
    headerName: 'MÉTODO DE PAGO',
    flex: 1,
    minWidth: 140,
    sortable: true,
    renderCell: ({ value }) => (
      <Typography variant="caption">
        {PAYMENT_METHOD_BY_KEY[String(value)]?.label ?? String(value)}
      </Typography>
    ),
  },
  {
    field: 'amount',
    headerName: 'MONTO',
    width: 130,
    sortable: true,
    align: 'right',
    headerAlign: 'right',
    renderCell: ({ row }) => (
      <Typography variant="body2" sx={{ fontWeight: 600 }}>
        {formatCurrency(row.amount, row.currency)}
      </Typography>
    ),
  },
  {
    field: 'fees',
    headerName: 'COMISIONES',
    width: 120,
    sortable: true,
    align: 'right',
    headerAlign: 'right',
    renderCell: ({ row }) => (
      <Typography variant="caption">{formatCurrency(row.fees, row.currency)}</Typography>
    ),
  },
  {
    field: 'taxes',
    headerName: 'IMPUESTOS',
    width: 120,
    sortable: true,
    align: 'right',
    headerAlign: 'right',
    renderCell: ({ row }) => (
      <Typography variant="caption">{formatCurrency(row.taxes, row.currency)}</Typography>
    ),
  },
  {
    field: 'netAmount',
    headerName: 'MONTO NETO',
    width: 130,
    sortable: true,
    align: 'right',
    headerAlign: 'right',
    renderCell: ({ row }) => (
      <Typography variant="body2" sx={{ fontWeight: 600 }}>
        {formatCurrency(row.netAmount, row.currency)}
      </Typography>
    ),
  },
  {
    field: 'currency',
    headerName: 'MONEDA',
    width: 90,
    sortable: true,
  },
  {
    field: 'approvedAt',
    headerName: 'APROBADO EL',
    width: 170,
    sortable: true,
    valueGetter: (_, row) => row.approvedAt,
    renderCell: ({ value }) =>
      value ? (
        <Typography variant="caption">{fmtDateTime(value as Date)}</Typography>
      ) : (
        <Typography variant="caption" color="text.secondary">—</Typography>
      ),
  },
  {
    field: 'customerName',
    headerName: 'CLIENTE',
    flex: 1,
    minWidth: 160,
    sortable: true,
    renderCell: ({ row }) => (
      <Stack sx={{ minWidth: 0 }}>
        <Typography variant="caption" sx={{ fontWeight: 600 }}>
          {row.type === 'pay-out' && row.beneficiaryName ? row.beneficiaryName : row.customerName}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {row.customerEmail}
        </Typography>
      </Stack>
    ),
  },
  {
    field: 'status',
    headerName: 'ESTADO',
    width: 140,
    sortable: true,
    renderCell: ({ value }) => <StatusBadge status={String(value)} />,
  },
];

// Columnas visibles por default (las otras quedan ocultas en el modelo de visibilidad).
export const DEFAULT_VISIBLE_COLUMNS: Record<string, boolean> = {
  id: true,
  reference: true,
  createdAt: true,
  country: true,
  paymentMethod: true,
  amount: true,
  fees: true,
  taxes: true,
  netAmount: false,
  currency: false,
  approvedAt: false,
  customerName: false,
  status: true,
};

export const COLUMN_LABELS: Record<string, string> = TRANSACTION_COLUMN_DEFS.reduce(
  (acc, col) => ({ ...acc, [col.field]: col.headerName ?? col.field }),
  {} as Record<string, string>,
);
