import { Chip } from '@mui/material';
import {
  TRANSACTION_STATES,
  SETTLEMENT_STATES,
  type TransactionStatusKey,
  type SettlementStatusKey,
} from '@/constants/transactionStates';

interface StatusBadgeProps {
  status: TransactionStatusKey | SettlementStatusKey | string;
  size?: 'small' | 'medium';
}

function resolve(status: string): { label: string; bg: string; fg: string } {
  if (status in TRANSACTION_STATES) {
    const meta = TRANSACTION_STATES[status as TransactionStatusKey];
    return { label: meta.label, bg: meta.bg, fg: meta.fg };
  }
  if (status in SETTLEMENT_STATES) {
    const meta = SETTLEMENT_STATES[status as SettlementStatusKey];
    return meta;
  }
  return { label: status, bg: '#F3F4F6', fg: '#4B5563' };
}

export function StatusBadge({ status, size = 'small' }: StatusBadgeProps) {
  const { label, bg, fg } = resolve(status);
  return (
    <Chip
      label={label}
      size={size}
      sx={{
        backgroundColor: bg,
        color: fg,
        fontWeight: 600,
        fontSize: 11,
        height: size === 'small' ? 22 : 28,
      }}
    />
  );
}

export default StatusBadge;
