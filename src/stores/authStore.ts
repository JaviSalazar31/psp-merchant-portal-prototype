import { create } from 'zustand';

export type OnboardingStatus = 'not_started' | 'in_progress' | 'pending_review' | 'approved' | 'rejected';
export type UserRole = 'Admin' | 'Finance' | 'Operator' | 'Viewer';
export type Language = 'es' | 'en' | 'pt-BR';

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  companyName: string;
  country: string;
  onboardingStatus: OnboardingStatus;
  currentOnboardingStep: 1 | 2 | 3 | 4 | 5 | 6;
  role: UserRole;
  language: Language;
  createdAt: Date;
}

export interface RegistrationData {
  companyName: string;
  country: string;
  email: string;
  password: string;
  language: Language;
}

export type LoginError = 'invalid' | 'locked_now' | 'locked_persistent';

export interface LoginResult {
  success: boolean;
  error?: LoginError;
  user?: AuthUser;
  lockedUntil?: number;
}

interface MockUserSeed {
  user: AuthUser;
  password: string;
}

const LOCKOUT_DURATION_MS = 5 * 60 * 1000;
const MAX_FAILED_ATTEMPTS = 3;
const MOCK_PASSWORD = 'Test1234!';

// 4 usuarios mock para validar el flujo según §5.3 del doc maestro.
const MOCK_USERS: MockUserSeed[] = [
  {
    user: {
      id: 'u_nuevo',
      email: 'nuevo@test.com',
      firstName: 'Nicolás',
      lastName: 'Ramos',
      companyName: 'Empresa Nueva',
      country: 'MX',
      onboardingStatus: 'not_started',
      currentOnboardingStep: 1,
      role: 'Admin',
      language: 'es',
      createdAt: new Date('2026-05-14T10:00:00'),
    },
    password: MOCK_PASSWORD,
  },
  {
    user: {
      id: 'u_wizard',
      email: 'wizard@test.com',
      firstName: 'Mariana',
      lastName: 'Vega',
      companyName: 'Wizard Industries',
      country: 'BR',
      onboardingStatus: 'in_progress',
      currentOnboardingStep: 3,
      role: 'Admin',
      language: 'es',
      createdAt: new Date('2026-05-10T09:00:00'),
    },
    password: MOCK_PASSWORD,
  },
  {
    user: {
      id: 'u_pending',
      email: 'pending@test.com',
      firstName: 'Carla',
      lastName: 'Méndez',
      companyName: 'En Revisión SA',
      country: 'CO',
      onboardingStatus: 'pending_review',
      currentOnboardingStep: 6,
      role: 'Admin',
      language: 'es',
      createdAt: new Date('2026-05-08T15:30:00'),
    },
    password: MOCK_PASSWORD,
  },
  {
    user: {
      id: 'u_admin',
      email: 'admin@test.com',
      firstName: 'Bruno',
      lastName: 'Fernández',
      companyName: 'Tacos Pancho',
      country: 'MX',
      onboardingStatus: 'approved',
      currentOnboardingStep: 6,
      role: 'Admin',
      language: 'es',
      createdAt: new Date('2026-04-10T11:15:00'),
    },
    password: MOCK_PASSWORD,
  },
];

const seedByEmail = MOCK_USERS.reduce<Record<string, MockUserSeed>>(
  (acc, s) => ({ ...acc, [s.user.email.toLowerCase()]: s }),
  {},
);

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  /** Usuario registrado pero aún sin confirmar el correo (no autenticado). */
  pendingUser: AuthUser | null;
  failedAttempts: Record<string, number>;
  lockedUntil: Record<string, number>;

  login: (email: string, password: string) => LoginResult;
  logout: () => void;
  registerNewUser: (data: RegistrationData) => AuthUser;
  confirmEmail: () => AuthUser | null;
  updateUser: (patch: Partial<AuthUser>) => void;
  resetFailedAttempts: (email: string) => void;
  isLockedFor: (email: string) => { locked: boolean; lockedUntil?: number };
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  pendingUser: null,
  failedAttempts: {},
  lockedUntil: {},

  isLockedFor: (email: string) => {
    const key = email.toLowerCase();
    const until = get().lockedUntil[key];
    if (until && until > Date.now()) {
      return { locked: true, lockedUntil: until };
    }
    return { locked: false };
  },

  login: (email, password) => {
    const key = email.toLowerCase();
    const state = get();

    // Si la cuenta sigue bloqueada de un intento previo, Dialog persistente (adenda Cambio 4).
    const lock = state.isLockedFor(key);
    if (lock.locked) {
      return { success: false, error: 'locked_persistent', lockedUntil: lock.lockedUntil };
    }

    // Si pasó el tiempo de bloqueo, reseteamos los intentos previos antes de validar.
    if (state.lockedUntil[key] && state.lockedUntil[key] <= Date.now()) {
      set({
        failedAttempts: { ...state.failedAttempts, [key]: 0 },
        lockedUntil: { ...state.lockedUntil, [key]: 0 },
      });
    }

    const seed = seedByEmail[key];
    if (seed && seed.password === password) {
      set({
        user: seed.user,
        isAuthenticated: true,
        failedAttempts: { ...get().failedAttempts, [key]: 0 },
        lockedUntil: { ...get().lockedUntil, [key]: 0 },
      });
      return { success: true, user: seed.user };
    }

    // Credenciales inválidas: incrementamos contador.
    const currentAttempts = get().failedAttempts[key] ?? 0;
    const nextAttempts = currentAttempts + 1;

    if (nextAttempts >= MAX_FAILED_ATTEMPTS) {
      const newLockedUntil = Date.now() + LOCKOUT_DURATION_MS;
      set({
        failedAttempts: { ...get().failedAttempts, [key]: nextAttempts },
        lockedUntil: { ...get().lockedUntil, [key]: newLockedUntil },
      });
      return { success: false, error: 'locked_now', lockedUntil: newLockedUntil };
    }

    set({ failedAttempts: { ...get().failedAttempts, [key]: nextAttempts } });
    return { success: false, error: 'invalid' };
  },

  logout: () => set({ user: null, isAuthenticated: false, pendingUser: null }),

  registerNewUser: (data) => {
    const newUser: AuthUser = {
      id: `u_${Date.now()}`,
      email: data.email,
      firstName: data.companyName.split(' ')[0] ?? 'Usuario',
      lastName: '',
      companyName: data.companyName,
      country: data.country,
      onboardingStatus: 'not_started',
      currentOnboardingStep: 1,
      role: 'Admin',
      language: data.language,
      createdAt: new Date(),
    };
    // NO autenticamos en el registro: el usuario queda "pendiente de
    // confirmación de correo". Se guarda como pendingUser y recién se
    // autentica cuando confirma el email (confirmEmail), replicando el
    // flujo real de verificación previa de un onboarding fintech.
    set({ pendingUser: newUser });
    return newUser;
  },

  // Confirma el correo del usuario pendiente y recién ahí lo autentica.
  confirmEmail: () => {
    const pending = get().pendingUser;
    if (!pending) return null;
    set({ user: pending, isAuthenticated: true, pendingUser: null });
    return pending;
  },

  updateUser: (patch) => {
    const state = get();
    if (!state.user) return;
    set({ user: { ...state.user, ...patch } });
  },

  resetFailedAttempts: (email) => {
    const key = email.toLowerCase();
    set({
      failedAttempts: { ...get().failedAttempts, [key]: 0 },
      lockedUntil: { ...get().lockedUntil, [key]: 0 },
    });
  },
}));

export const MOCK_TEST_USERS_HINT = MOCK_USERS.map(s => ({
  email: s.user.email,
  password: s.password,
  status: s.user.onboardingStatus,
}));
