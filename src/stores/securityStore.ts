import { create } from 'zustand';
import { MOCK_SECURITY, type ActiveSession, type LoginActivityEntry } from '@/mocks/security';

interface SecurityState {
  passwordLastChangedAt: Date;
  twoFactorEnabled: boolean;
  activeSessions: ActiveSession[];
  loginActivity: LoginActivityEntry[];
  saving: boolean;

  changePassword: () => Promise<void>;
  revokeSession: (sessionId: string) => Promise<void>;
  revokeAllOtherSessions: () => Promise<number>;
}

const FAKE_LATENCY_MS = 600;
const fakeDelay = () => new Promise<void>(resolve => setTimeout(resolve, FAKE_LATENCY_MS));

export const useSecurityStore = create<SecurityState>((set, get) => ({
  passwordLastChangedAt: MOCK_SECURITY.passwordLastChangedAt,
  twoFactorEnabled: MOCK_SECURITY.twoFactorEnabled,
  activeSessions: MOCK_SECURITY.activeSessions,
  loginActivity: MOCK_SECURITY.loginActivity,
  saving: false,

  changePassword: async () => {
    set({ saving: true });
    await fakeDelay();
    set({ passwordLastChangedAt: new Date(), saving: false });
  },

  revokeSession: async sessionId => {
    set({ saving: true });
    await fakeDelay();
    set(state => ({
      activeSessions: state.activeSessions.filter(s => s.id !== sessionId),
      saving: false,
    }));
  },

  revokeAllOtherSessions: async () => {
    set({ saving: true });
    await fakeDelay();
    const remaining = get().activeSessions.filter(s => s.isCurrent);
    const removed = get().activeSessions.length - remaining.length;
    set({ activeSessions: remaining, saving: false });
    return removed;
  },
}));
