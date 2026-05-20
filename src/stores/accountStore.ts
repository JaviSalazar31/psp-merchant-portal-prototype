import { create } from 'zustand';
import { MOCK_ACCOUNT, type AccountData } from '@/mocks/account';

interface AccountState {
  account: AccountData;
}

/**
 * Datos del comercio. Sólo lectura desde el portal: una vez aprobada la cuenta,
 * las correcciones se gestionan con Backoffice.
 */
export const useAccountStore = create<AccountState>(() => ({
  account: MOCK_ACCOUNT,
}));
