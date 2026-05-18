import { create } from 'zustand';
import {
  MOCK_PROFILE,
  type ProfileNotifications,
  type ProfilePreferences,
} from '@/mocks/profile';

interface ProfileState {
  preferences: ProfilePreferences;
  notifications: ProfileNotifications;
  saving: boolean;
  updatePreferences: (patch: Partial<ProfilePreferences>) => Promise<void>;
  updateNotifications: (patch: Partial<ProfileNotifications>) => Promise<void>;
}

const FAKE_LATENCY_MS = 500;
const fakeDelay = () => new Promise<void>(resolve => setTimeout(resolve, FAKE_LATENCY_MS));

export const useProfileStore = create<ProfileState>(set => ({
  preferences: MOCK_PROFILE.preferences,
  notifications: MOCK_PROFILE.notifications,
  saving: false,

  updatePreferences: async patch => {
    set({ saving: true });
    await fakeDelay();
    set(state => ({ preferences: { ...state.preferences, ...patch }, saving: false }));
  },

  updateNotifications: async patch => {
    set({ saving: true });
    await fakeDelay();
    set(state => ({ notifications: { ...state.notifications, ...patch }, saving: false }));
  },
}));
