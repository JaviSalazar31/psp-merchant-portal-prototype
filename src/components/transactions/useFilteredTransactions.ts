import { useMemo } from 'react';
import type { MockTransaction } from '@/mocks/transactions';
import type { TransactionFilters } from './filterTypes';

export function applyFilters(rows: MockTransaction[], f: TransactionFilters): MockTransaction[] {
  return rows.filter(r => {
    if (f.search) {
      const q = f.search.toLowerCase();
      if (!r.id.toLowerCase().includes(q) && !r.reference.toLowerCase().includes(q)) return false;
    }
    if (f.country.length > 0 && !f.country.includes(r.country)) return false;
    if (f.currency.length > 0 && !f.currency.includes(r.currency)) return false;
    if (f.paymentMethod.length > 0 && !f.paymentMethod.includes(r.paymentMethod)) return false;
    if (f.status.length > 0 && !f.status.includes(r.status)) return false;
    if (f.dateFrom) {
      const fromMs = new Date(`${f.dateFrom}T00:00:00`).getTime();
      if (r.createdAt.getTime() < fromMs) return false;
    }
    if (f.dateTo) {
      const toMs = new Date(`${f.dateTo}T23:59:59`).getTime();
      if (r.createdAt.getTime() > toMs) return false;
    }
    if (f.amountMin != null && r.amount < f.amountMin) return false;
    if (f.amountMax != null && r.amount > f.amountMax) return false;
    if (f.customerEmail) {
      if (!r.customerEmail.toLowerCase().includes(f.customerEmail.toLowerCase())) return false;
    }
    if (f.customerName) {
      if (!r.customerName.toLowerCase().includes(f.customerName.toLowerCase())) return false;
    }
    return true;
  });
}

export function useFilteredTransactions(
  source: MockTransaction[],
  filters: TransactionFilters,
): MockTransaction[] {
  return useMemo(() => applyFilters(source, filters), [source, filters]);
}
