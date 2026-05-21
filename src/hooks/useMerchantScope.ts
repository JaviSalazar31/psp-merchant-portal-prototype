import { useMemo } from 'react';
import { useAccountStore } from '@/stores/accountStore';
import { COUNTRY_BY_CODE, type Country } from '@/constants/countries';
import { CURRENCY_BY_CODE, type Currency } from '@/constants/currencies';
import { PAYMENT_METHODS, type PaymentMethod } from '@/constants/paymentMethods';

export interface MerchantScope {
  /** Países donde el comercio logueado opera realmente. */
  operationCountries: string[];
  countries: Country[];
  /** Monedas locales de esos países + USD (moneda de consolidación del portal). */
  currencyCodes: string[];
  currencies: Currency[];
  /** Métodos de pago disponibles en esos países. */
  paymentMethods: PaymentMethod[];
}

/**
 * Acota las opciones del portal a los países donde el comercio opera. El portal no debe
 * mostrar los 14 países de la red ni monedas/métodos que el comercio nunca va a usar.
 */
export function useMerchantScope(): MerchantScope {
  const operationCountries = useAccountStore(s => s.account.operationCountries);

  return useMemo(() => {
    const codes = operationCountries.length > 0 ? operationCountries : ['MX'];
    const countries = codes
      .map(code => COUNTRY_BY_CODE[code])
      .filter((c): c is Country => Boolean(c));
    // Fase 1: solo monedas locales — USD ya no aparece como filtro porque el
    // comercio opera en moneda local del país. La excepción es Volumen Mensual
    // del Step 1 del onboarding, que sigue en USD por convención de mercado.
    const currencyCodes = Array.from(new Set(countries.map(c => c.currency)));
    const currencies = currencyCodes
      .map(code => CURRENCY_BY_CODE[code])
      .filter((c): c is Currency => Boolean(c));
    const paymentMethods = PAYMENT_METHODS.filter(
      m => m.countries.includes('*') || m.countries.some(c => codes.includes(c)),
    );
    return { operationCountries: codes, countries, currencyCodes, currencies, paymentMethods };
  }, [operationCountries]);
}
