export interface Currency {
  code: string;
  symbol: string;
  name: string;
  decimals: number;
}

export const CURRENCIES: Currency[] = [
  { code: 'MXN', symbol: '$', name: 'Peso mexicano', decimals: 2 },
  { code: 'BRL', symbol: 'R$', name: 'Real brasileño', decimals: 2 },
  { code: 'COP', symbol: '$', name: 'Peso colombiano', decimals: 0 },
  { code: 'ARS', symbol: '$', name: 'Peso argentino', decimals: 2 },
  { code: 'USD', symbol: 'US$', name: 'Dólar estadounidense', decimals: 2 },
  { code: 'PEN', symbol: 'S/', name: 'Sol peruano', decimals: 2 },
  { code: 'CLP', symbol: '$', name: 'Peso chileno', decimals: 0 },
  { code: 'GTQ', symbol: 'Q', name: 'Quetzal guatemalteco', decimals: 2 },
  { code: 'HNL', symbol: 'L', name: 'Lempira hondureño', decimals: 2 },
  { code: 'NIO', symbol: 'C$', name: 'Córdoba nicaragüense', decimals: 2 },
  { code: 'CRC', symbol: '₡', name: 'Colón costarricense', decimals: 2 },
  { code: 'DOP', symbol: 'RD$', name: 'Peso dominicano', decimals: 2 },
  { code: 'EUR', symbol: '€', name: 'Euro', decimals: 2 },
];

export const CURRENCY_BY_CODE: Record<string, Currency> = CURRENCIES.reduce(
  (acc, c) => ({ ...acc, [c.code]: c }),
  {},
);

export function formatCurrency(amount: number, code: string): string {
  const ccy = CURRENCY_BY_CODE[code] ?? CURRENCIES[0];
  const formatted = amount.toLocaleString('es-AR', {
    minimumFractionDigits: ccy.decimals,
    maximumFractionDigits: ccy.decimals,
  });
  return `${ccy.symbol} ${formatted}`;
}
