export interface Country {
  code: string;
  name: string;
  flag: string;
  currency: string;
  phonePrefix: string;
}

export const COUNTRIES: Country[] = [
  { code: 'MX', name: 'México', flag: '🇲🇽', currency: 'MXN', phonePrefix: '+52' },
  { code: 'BR', name: 'Brasil', flag: '🇧🇷', currency: 'BRL', phonePrefix: '+55' },
  { code: 'CO', name: 'Colombia', flag: '🇨🇴', currency: 'COP', phonePrefix: '+57' },
];

export const COUNTRY_BY_CODE: Record<string, Country> = COUNTRIES.reduce(
  (acc, c) => ({ ...acc, [c.code]: c }),
  {},
);

/**
 * Devuelve el código de moneda principal para un país (ej: MX → MXN, CO → COP).
 * Fallback a USD si el código de país no está mapeado.
 */
export function countryToCurrency(countryCode: string | undefined): string {
  if (!countryCode) return 'USD';
  return COUNTRY_BY_CODE[countryCode]?.currency ?? 'USD';
}

// Hints fiscales (label + placeholder) por país para el banner contextual "Flujo Local" del Step 1.
export const FISCAL_ID_HINTS: Record<string, { label: string; placeholder: string; flowName: string }> = {
  MX: { label: 'RFC', placeholder: 'ABC123456XYZ', flowName: 'Flujo Local - México' },
  BR: { label: 'CNPJ', placeholder: '00.000.000/0000-00', flowName: 'Flujo Local - Brasil' },
  CO: { label: 'NIT', placeholder: '900.123.456-7', flowName: 'Flujo Local - Colombia' },
};
