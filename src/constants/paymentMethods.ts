export interface PaymentMethod {
  key: string;
  label: string;
  countries: string[];
  category: 'card' | 'transfer' | 'cash' | 'wallet';
}

export const PAYMENT_METHODS: PaymentMethod[] = [
  { key: 'CARD_CREDIT', label: 'Tarjeta de crédito', countries: ['*'], category: 'card' },
  { key: 'CARD_DEBIT', label: 'Tarjeta de débito', countries: ['*'], category: 'card' },
  { key: 'SPEI', label: 'SPEI', countries: ['MX'], category: 'transfer' },
  { key: 'OXXO', label: 'OXXO', countries: ['MX'], category: 'cash' },
  { key: 'PIX', label: 'PIX', countries: ['BR'], category: 'transfer' },
  { key: 'BOLETO', label: 'Boleto Bancário', countries: ['BR'], category: 'cash' },
  { key: 'PSE', label: 'PSE', countries: ['CO'], category: 'transfer' },
  { key: 'CASH', label: 'Pago en Efectivo', countries: ['*'], category: 'cash' },
];

export const PAYMENT_METHOD_BY_KEY: Record<string, PaymentMethod> = PAYMENT_METHODS.reduce(
  (acc, m) => ({ ...acc, [m.key]: m }),
  {},
);

export function methodsForCountry(countryCode: string): PaymentMethod[] {
  return PAYMENT_METHODS.filter(m => m.countries.includes('*') || m.countries.includes(countryCode));
}
