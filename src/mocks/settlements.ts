import type { SettlementStatusKey } from '@/constants/transactionStates';
import { MOCK_TRANSACTIONS } from './transactions';

export interface MockSettlement {
  id: string;
  batchNumber: number;
  salesDay: Date;
  payoutDate: Date;
  status: SettlementStatusKey;
  currency: string;
  grossAmount: number;
  fees: number;
  taxes: number;
  refunds: number;
  chargebacks: number;
  adjustments: number;
  netPayout: number;
  transactionCount: number;
  bankName: string;
  bankAccountLast4: string;
  bankReference: string | null;
  transactionIds: string[];
}

function days(n: number): number {
  return n * 24 * 60 * 60 * 1000;
}

const today = new Date('2026-05-15T00:00:00').getTime();

interface SettlementSeed {
  daysAgoSalesDay: number;
  payoutOffsetDays: number;
  status: SettlementStatusKey;
  currency: string;
  country: string;
  grossAmount: number;
  refunds: number;
  chargebacks: number;
  adjustments: number;
  bankName: string;
  bankLast4: string;
  bankReference: string | null;
}

const SEEDS: SettlementSeed[] = [
  // Próximos / pendientes
  { daysAgoSalesDay: 1, payoutOffsetDays: 2, status: 'PENDING', currency: 'MXN', country: 'MX', grossAmount: 48950, refunds: 1200, chargebacks: 850, adjustments: 158.5, bankName: 'BBVA México', bankLast4: '4321', bankReference: null },
  { daysAgoSalesDay: 2, payoutOffsetDays: 1, status: 'IN_TRANSIT', currency: 'MXN', country: 'MX', grossAmount: 41200, refunds: 800, chargebacks: 500, adjustments: 585.2, bankName: 'BBVA México', bankLast4: '4321', bankReference: 'WIRE-IN-PROGRESS' },
  { daysAgoSalesDay: 2, payoutOffsetDays: 2, status: 'PENDING', currency: 'BRL', country: 'BR', grossAmount: 28400, refunds: 450, chargebacks: 0, adjustments: 195, bankName: 'Itaú Brasil', bankLast4: '7788', bankReference: null },
  // Procesados recientes
  { daysAgoSalesDay: 3, payoutOffsetDays: 3, status: 'PAID', currency: 'BRL', country: 'BR', grossAmount: 25890, refunds: 320, chargebacks: 220, adjustments: 99.25, bankName: 'Itaú Brasil', bankLast4: '7788', bankReference: 'WIRE-20260515-3421' },
  { daysAgoSalesDay: 5, payoutOffsetDays: 3, status: 'PAID', currency: 'MXN', country: 'MX', grossAmount: 52340, refunds: 1100, chargebacks: 0, adjustments: 612.1, bankName: 'BBVA México', bankLast4: '4321', bankReference: 'WIRE-20260513-3322' },
  { daysAgoSalesDay: 7, payoutOffsetDays: 3, status: 'FAILED', currency: 'MXN', country: 'MX', grossAmount: 18750, refunds: 0, chargebacks: 0, adjustments: 0, bankName: 'BBVA México', bankLast4: '4321', bankReference: null },
  // Histórico
  { daysAgoSalesDay: 9, payoutOffsetDays: 3, status: 'PAID', currency: 'MXN', country: 'MX', grossAmount: 35420, refunds: 760, chargebacks: 320, adjustments: 240, bankName: 'BBVA México', bankLast4: '4321', bankReference: 'WIRE-20260509-2210' },
  { daysAgoSalesDay: 11, payoutOffsetDays: 3, status: 'PAID', currency: 'COP', country: 'CO', grossAmount: 9_800_000, refunds: 150_000, chargebacks: 80_000, adjustments: 25_000, bankName: 'Bancolombia', bankLast4: '5566', bankReference: 'WIRE-20260507-1180' },
  { daysAgoSalesDay: 14, payoutOffsetDays: 3, status: 'PAID', currency: 'MXN', country: 'MX', grossAmount: 47120, refunds: 940, chargebacks: 510, adjustments: 380, bankName: 'BBVA México', bankLast4: '4321', bankReference: 'WIRE-20260504-3344' },
  { daysAgoSalesDay: 16, payoutOffsetDays: 3, status: 'PAID', currency: 'BRL', country: 'BR', grossAmount: 22500, refunds: 280, chargebacks: 150, adjustments: 110, bankName: 'Itaú Brasil', bankLast4: '7788', bankReference: 'WIRE-20260502-7799' },
  { daysAgoSalesDay: 19, payoutOffsetDays: 3, status: 'PAID', currency: 'MXN', country: 'MX', grossAmount: 39870, refunds: 820, chargebacks: 0, adjustments: 290, bankName: 'BBVA México', bankLast4: '4321', bankReference: 'WIRE-20260429-3401' },
  { daysAgoSalesDay: 22, payoutOffsetDays: 3, status: 'PAID', currency: 'COP', country: 'CO', grossAmount: 9_700_000, refunds: 190_000, chargebacks: 80_000, adjustments: 44_000, bankName: 'Bancolombia', bankLast4: '5544', bankReference: 'WIRE-20260426-CO02' },
  { daysAgoSalesDay: 25, payoutOffsetDays: 3, status: 'PAID', currency: 'MXN', country: 'MX', grossAmount: 44550, refunds: 1050, chargebacks: 230, adjustments: 410, bankName: 'BBVA México', bankLast4: '4321', bankReference: 'WIRE-20260423-3370' },
  { daysAgoSalesDay: 28, payoutOffsetDays: 3, status: 'PAID', currency: 'BRL', country: 'BR', grossAmount: 19890, refunds: 220, chargebacks: 110, adjustments: 95, bankName: 'Itaú Brasil', bankLast4: '7788', bankReference: 'WIRE-20260420-7720' },
  { daysAgoSalesDay: 31, payoutOffsetDays: 3, status: 'PAID', currency: 'MXN', country: 'MX', grossAmount: 36780, refunds: 690, chargebacks: 180, adjustments: 245, bankName: 'BBVA México', bankLast4: '4321', bankReference: 'WIRE-20260417-3358' },
];

function pickTransactionIds(country: string, currency: string, batchNumber: number): string[] {
  // Toma tx pay-in autorizadas/reembolsadas del mock que coincidan country+currency.
  // Usa modular slicing por batchNumber para distribuir entre settlements sin duplicar mucho.
  const candidates = MOCK_TRANSACTIONS
    .filter(t => t.type === 'pay-in' && t.country === country && t.currency === currency)
    .filter(t => t.status === 'AUTORIZADO' || t.status === 'REEMBOLSADO');
  if (candidates.length === 0) return [];
  const start = (batchNumber * 3) % candidates.length;
  const count = 3 + (batchNumber % 8); // 3 a 10 tx
  const ids: string[] = [];
  for (let i = 0; i < count; i++) {
    ids.push(candidates[(start + i) % candidates.length].id);
  }
  return Array.from(new Set(ids));
}

export const MOCK_SETTLEMENTS: MockSettlement[] = SEEDS.map((seed, i) => {
  const batchNumber = i + 1;
  const salesDay = new Date(today - days(seed.daysAgoSalesDay));
  const payoutDate = new Date(salesDay.getTime() + days(seed.payoutOffsetDays));
  const fees = Number((seed.grossAmount * 0.025).toFixed(2));
  const taxes = Number((fees * 0.16).toFixed(2));
  const netPayout = Number((seed.grossAmount - fees - taxes - seed.refunds - seed.chargebacks - seed.adjustments).toFixed(2));
  const transactionIds = pickTransactionIds(seed.country, seed.currency, batchNumber);
  // ID con formato STL-YYYYMMDD-NNN basado en el día de ventas
  const yyyy = salesDay.getFullYear();
  const mm = String(salesDay.getMonth() + 1).padStart(2, '0');
  const dd = String(salesDay.getDate()).padStart(2, '0');
  const id = `STL-${yyyy}${mm}${dd}-${String(batchNumber).padStart(3, '0')}`;
  return {
    id,
    batchNumber,
    salesDay,
    payoutDate,
    status: seed.status,
    currency: seed.currency,
    grossAmount: seed.grossAmount,
    fees,
    taxes,
    refunds: seed.refunds,
    chargebacks: seed.chargebacks,
    adjustments: seed.adjustments,
    netPayout,
    transactionCount: transactionIds.length,
    bankName: seed.bankName,
    bankAccountLast4: seed.bankLast4,
    bankReference: seed.bankReference,
    transactionIds,
  };
});
