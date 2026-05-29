/**
 * Validadores de identificación fiscal por país.
 *
 * Cada validador chequea:
 *   1. Formato (regex de longitud y caracteres permitidos)
 *   2. Dígito verificador (cuando aplica)
 *
 * El objetivo es bloquear inputs basura tipo "12345678901234" como CNPJ válido.
 * En producción la verificación final se hace server-side contra registros
 * fiscales, pero la validación client-side reduce dramáticamente los errores
 * de tipeo y solicitudes de onboarding rechazadas downstream.
 */

/** Quita máscara (puntos, guiones, barras, espacios) y deja solo alfanuméricos. */
function strip(value: string): string {
  return value.replace(/[^A-Za-z0-9Ññ&]/g, '').toUpperCase();
}

/** MX — RFC Persona Moral (12 chars) o Física (13 chars).
 *  Formato: 3-4 letras + 6 dígitos de fecha (AAMMDD) + 3 chars de homoclave.
 *  La homoclave no se valida algorítmicamente acá (la fórmula del SAT requiere
 *  el nombre completo); validamos formato y que la fecha sea verosímil. */
export function isValidRFC(raw: string): boolean {
  const v = strip(raw);
  if (v.length !== 12 && v.length !== 13) return false;
  const re = v.length === 12
    ? /^[A-ZÑ&]{3}[0-9]{6}[A-Z0-9]{3}$/
    : /^[A-ZÑ&]{4}[0-9]{6}[A-Z0-9]{3}$/;
  if (!re.test(v)) return false;
  // Validar fecha verosímil (AAMMDD).
  const dateStart = v.length === 12 ? 3 : 4;
  const yy = parseInt(v.slice(dateStart, dateStart + 2), 10);
  const mm = parseInt(v.slice(dateStart + 2, dateStart + 4), 10);
  const dd = parseInt(v.slice(dateStart + 4, dateStart + 6), 10);
  if (mm < 1 || mm > 12) return false;
  if (dd < 1 || dd > 31) return false;
  if (yy < 0 || yy > 99) return false;
  return true;
}

/** BR — CNPJ (14 dígitos) con validación de dígito verificador módulo 11.
 *  Algoritmo oficial de la Receita Federal. */
export function isValidCNPJ(raw: string): boolean {
  const v = strip(raw);
  if (v.length !== 14) return false;
  if (!/^[0-9]{14}$/.test(v)) return false;
  // Rechazar CNPJs con todos los dígitos iguales (00000000000000, 11111111111111, etc).
  if (/^(\d)\1{13}$/.test(v)) return false;

  const calc = (digits: string, weights: number[]): number => {
    let sum = 0;
    for (let i = 0; i < weights.length; i++) {
      sum += parseInt(digits[i], 10) * weights[i];
    }
    const mod = sum % 11;
    return mod < 2 ? 0 : 11 - mod;
  };

  const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

  const d1 = calc(v.slice(0, 12), weights1);
  if (d1 !== parseInt(v[12], 10)) return false;
  const d2 = calc(v.slice(0, 13), weights2);
  if (d2 !== parseInt(v[13], 10)) return false;

  return true;
}

/** CO — NIT (9 a 10 dígitos, último es dígito verificador módulo 11
 *  según resolución DIAN). Aceptamos también el guión opcional. */
export function isValidNIT(raw: string): boolean {
  const v = strip(raw);
  if (!/^[0-9]{9,10}$/.test(v)) return false;
  if (/^(\d)\1+$/.test(v)) return false;

  const weights = [3, 7, 13, 17, 19, 23, 29, 37, 41, 43];
  const digits = v.split('').map(d => parseInt(d, 10));
  const dv = digits.pop()!;
  const reversed = digits.reverse();

  let sum = 0;
  for (let i = 0; i < reversed.length; i++) {
    sum += reversed[i] * weights[i];
  }
  const mod = sum % 11;
  const expected = mod < 2 ? mod : 11 - mod;
  return expected === dv;
}

/** Dispatcher por código de país (MX | BR | CO). Si el país no tiene
 *  validador específico, exige mínimo 6 caracteres como fallback. */
export function isValidFiscalId(country: string, raw: string): boolean {
  if (!raw || raw.trim().length === 0) return false;
  switch (country) {
    case 'MX':
      return isValidRFC(raw);
    case 'BR':
      return isValidCNPJ(raw);
    case 'CO':
      return isValidNIT(raw);
    default:
      return strip(raw).length >= 6;
  }
}

/** CLABE — MX. 18 dígitos con dígito verificador módulo 10 ponderado. */
export function isValidCLABE(raw: string): boolean {
  const v = raw.replace(/\D/g, '');
  if (v.length !== 18) return false;
  const weights = [3, 7, 1];
  let sum = 0;
  for (let i = 0; i < 17; i++) {
    sum += (parseInt(v[i], 10) * weights[i % 3]) % 10;
  }
  const dv = (10 - (sum % 10)) % 10;
  return dv === parseInt(v[17], 10);
}

/** Cédula colombiana — 6 a 10 dígitos numéricos. */
export function isValidCedulaCO(raw: string): boolean {
  const v = strip(raw);
  return /^[0-9]{6,10}$/.test(v);
}

/** CPF brasileño — 11 dígitos con dígito verificador módulo 11. */
export function isValidCPF(raw: string): boolean {
  const v = strip(raw);
  if (v.length !== 11) return false;
  if (!/^[0-9]{11}$/.test(v)) return false;
  if (/^(\d)\1{10}$/.test(v)) return false;

  const calc = (digits: string, factor: number): number => {
    let sum = 0;
    for (let i = 0; i < digits.length; i++) {
      sum += parseInt(digits[i], 10) * (factor - i);
    }
    const mod = (sum * 10) % 11;
    return mod === 10 ? 0 : mod;
  };

  const d1 = calc(v.slice(0, 9), 10);
  if (d1 !== parseInt(v[9], 10)) return false;
  const d2 = calc(v.slice(0, 10), 11);
  if (d2 !== parseInt(v[10], 10)) return false;

  return true;
}

/** Códigos postales por país. */
export function isValidZipCode(country: string, raw: string): boolean {
  const v = (raw ?? '').trim();
  switch (country) {
    case 'MX':
      return /^[0-9]{5}$/.test(v);
    case 'BR':
      return /^[0-9]{5}-?[0-9]{3}$/.test(v);
    case 'CO':
      return /^[0-9]{6}$/.test(v);
    default:
      return v.length >= 3;
  }
}

/** Teléfono local (sin prefijo internacional) por país. */
export function isValidLocalPhone(country: string, raw: string): boolean {
  const v = (raw ?? '').replace(/\D/g, '');
  switch (country) {
    case 'MX':
      return /^[0-9]{10}$/.test(v);
    case 'BR':
      return /^[0-9]{10,11}$/.test(v);
    case 'CO':
      return /^[0-9]{10}$/.test(v);
    default:
      return v.length >= 6;
  }
}

/** URL con TLD válido (no acepta "http://x" sin punto). */
export function isValidWebsite(raw: string): boolean {
  const v = (raw ?? '').trim();
  if (!v) return false;
  try {
    const url = new URL(v.match(/^https?:\/\//i) ? v : `https://${v}`);
    return /\.[a-zA-Z]{2,}$/.test(url.hostname);
  } catch {
    return false;
  }
}

/** Dominios genéricos personales bloqueados para email "corporativo". */
const GENERIC_EMAIL_DOMAINS = new Set([
  'gmail.com',
  'googlemail.com',
  'hotmail.com',
  'outlook.com',
  'live.com',
  'yahoo.com',
  'yahoo.com.ar',
  'yahoo.com.mx',
  'icloud.com',
  'me.com',
  'aol.com',
  'protonmail.com',
  'proton.me',
  'mail.com',
  'gmx.com',
  'zoho.com',
]);

/**
 * NOTA: NO se usa en el onboarding. Bloquear dominios genéricos (gmail/hotmail/
 * etc.) excluiría PYMES legítimas de LATAM que operan con esos correos. Se deja
 * disponible por si alguna validación interna futura lo necesita, pero el email
 * del comercio y de los contactos solo valida formato estándar.
 */
export function isCorporateEmail(raw: string): boolean {
  const v = (raw ?? '').trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return false;
  const domain = v.split('@')[1] ?? '';
  return !GENERIC_EMAIL_DOMAINS.has(domain);
}
