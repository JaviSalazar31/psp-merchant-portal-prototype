import { create } from 'zustand';
import {
  MOCK_ACCOUNT,
  type AccountAddress,
  type AccountBank,
  type AccountCompany,
  type AccountContact,
  type AccountData,
} from '@/mocks/account';

interface AccountState {
  account: AccountData;
  saving: boolean;
  updateCompany: (patch: Partial<AccountCompany>) => Promise<void>;
  updateContact: (patch: Partial<AccountContact>) => Promise<void>;
  updateAddress: (country: string, patch: Partial<AccountAddress>) => Promise<void>;
  updateBank: (country: string, patch: Partial<AccountBank>) => Promise<void>;
}

const FAKE_LATENCY_MS = 600;
const fakeDelay = () => new Promise<void>(resolve => setTimeout(resolve, FAKE_LATENCY_MS));

export const useAccountStore = create<AccountState>((set, get) => ({
  account: MOCK_ACCOUNT,
  saving: false,

  updateCompany: async patch => {
    set({ saving: true });
    await fakeDelay();
    set(state => ({
      account: { ...state.account, company: { ...state.account.company, ...patch } },
      saving: false,
    }));
  },

  updateContact: async patch => {
    set({ saving: true });
    await fakeDelay();
    set(state => ({
      account: { ...state.account, contact: { ...state.account.contact, ...patch } },
      saving: false,
    }));
  },

  updateAddress: async (country, patch) => {
    set({ saving: true });
    await fakeDelay();
    const current = get().account.addresses[country];
    if (!current) {
      set({ saving: false });
      return;
    }
    set(state => ({
      account: {
        ...state.account,
        addresses: { ...state.account.addresses, [country]: { ...current, ...patch } },
      },
      saving: false,
    }));
  },

  updateBank: async (country, patch) => {
    set({ saving: true });
    await fakeDelay();
    const current = get().account.banks[country];
    if (!current) {
      set({ saving: false });
      return;
    }
    set(state => ({
      account: {
        ...state.account,
        banks: { ...state.account.banks, [country]: { ...current, ...patch } },
      },
      saving: false,
    }));
  },
}));
