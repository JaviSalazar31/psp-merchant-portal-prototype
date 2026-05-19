import { create } from 'zustand';
import { MOCK_SECURITY } from '@/mocks/security';

interface SecurityState {
  passwordLastChangedAt: Date;
  twoFactorEnabled: boolean;
  saving: boolean;
  changePassword: () => Promise<void>;
}

const FAKE_LATENCY_MS = 600;
const fakeDelay = () => new Promise<void>(resolve => setTimeout(resolve, FAKE_LATENCY_MS));

export const useSecurityStore = create<SecurityState>(set => ({
  passwordLastChangedAt: MOCK_SECURITY.passwordLastChangedAt,
  twoFactorEnabled: MOCK_SECURITY.twoFactorEnabled,
  saving: false,

  changePassword: async () => {
    set({ saving: true });
    await fakeDelay();
    set({ passwordLastChangedAt: new Date(), saving: false });
  },
}));
