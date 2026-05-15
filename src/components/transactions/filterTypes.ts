import type { TransactionStatusKey } from '@/constants/transactionStates';

export interface TransactionFilters {
  search: string; // ID o referencia
  country: string[];
  currency: string[];
  paymentMethod: string[];
  status: TransactionStatusKey[];
  dateFrom: string | null; // ISO date YYYY-MM-DD
  dateTo: string | null;
  amountMin: number | null;
  amountMax: number | null;
  customerEmail: string;
  customerName: string;
}

export const EMPTY_FILTERS: TransactionFilters = {
  search: '',
  country: [],
  currency: [],
  paymentMethod: [],
  status: [],
  dateFrom: null,
  dateTo: null,
  amountMin: null,
  amountMax: null,
  customerEmail: '',
  customerName: '',
};

export function hasActiveFilters(f: TransactionFilters): boolean {
  return (
    !!f.search ||
    f.country.length > 0 ||
    f.currency.length > 0 ||
    f.paymentMethod.length > 0 ||
    f.status.length > 0 ||
    !!f.dateFrom ||
    !!f.dateTo ||
    f.amountMin != null ||
    f.amountMax != null ||
    !!f.customerEmail ||
    !!f.customerName
  );
}
