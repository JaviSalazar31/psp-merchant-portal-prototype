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
  { code: 'AR', name: 'Argentina', flag: '🇦🇷', currency: 'ARS', phonePrefix: '+54' },
  { code: 'EC', name: 'Ecuador', flag: '🇪🇨', currency: 'USD', phonePrefix: '+593' },
  { code: 'PE', name: 'Perú', flag: '🇵🇪', currency: 'PEN', phonePrefix: '+51' },
  { code: 'CL', name: 'Chile', flag: '🇨🇱', currency: 'CLP', phonePrefix: '+56' },
  { code: 'GT', name: 'Guatemala', flag: '🇬🇹', currency: 'GTQ', phonePrefix: '+502' },
  { code: 'SV', name: 'El Salvador', flag: '🇸🇻', currency: 'USD', phonePrefix: '+503' },
  { code: 'HN', name: 'Honduras', flag: '🇭🇳', currency: 'HNL', phonePrefix: '+504' },
  { code: 'NI', name: 'Nicaragua', flag: '🇳🇮', currency: 'NIO', phonePrefix: '+505' },
  { code: 'CR', name: 'Costa Rica', flag: '🇨🇷', currency: 'CRC', phonePrefix: '+506' },
  { code: 'PA', name: 'Panamá', flag: '🇵🇦', currency: 'USD', phonePrefix: '+507' },
  { code: 'DO', name: 'República Dominicana', flag: '🇩🇴', currency: 'DOP', phonePrefix: '+1' },
];

export const COUNTRY_BY_CODE: Record<string, Country> = COUNTRIES.reduce(
  (acc, c) => ({ ...acc, [c.code]: c }),
  {},
);

// Hints fiscales (label + placeholder) por país para el banner contextual "Flujo Local" del Step 1.
export const FISCAL_ID_HINTS: Record<string, { label: string; placeholder: string; flowName: string }> = {
  MX: { label: 'RFC', placeholder: 'ABC123456XYZ', flowName: 'Flujo Local - México' },
  BR: { label: 'CNPJ', placeholder: '00.000.000/0000-00', flowName: 'Flujo Local - Brasil' },
  CO: { label: 'NIT', placeholder: '900.123.456-7', flowName: 'Flujo Local - Colombia' },
  AR: { label: 'CUIT', placeholder: '30-12345678-9', flowName: 'Flujo Local - Argentina' },
  EC: { label: 'RUC', placeholder: '1790012345001', flowName: 'Flujo Local - Ecuador' },
  PE: { label: 'RUC', placeholder: '20123456789', flowName: 'Flujo Local - Perú' },
  CL: { label: 'RUT', placeholder: '76.123.456-7', flowName: 'Flujo Local - Chile' },
  GT: { label: 'NIT', placeholder: '12345678-9', flowName: 'Flujo Local - Guatemala' },
  SV: { label: 'NIT', placeholder: '0614-281297-101-0', flowName: 'Flujo Local - El Salvador' },
  HN: { label: 'RTN', placeholder: '08019999123456', flowName: 'Flujo Local - Honduras' },
  NI: { label: 'RUC', placeholder: 'J0310000001234', flowName: 'Flujo Local - Nicaragua' },
  CR: { label: 'Cédula Jurídica', placeholder: '3-101-123456', flowName: 'Flujo Local - Costa Rica' },
  PA: { label: 'RUC', placeholder: '155678-1-2018', flowName: 'Flujo Local - Panamá' },
  DO: { label: 'RNC', placeholder: '1-01-12345-6', flowName: 'Flujo Local - República Dominicana' },
};
