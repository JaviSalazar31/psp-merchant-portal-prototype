import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Language } from './authStore';

interface UIState {
  sidebarCollapsed: boolean;
  language: Language;
  visibleColumns: string[] | null; // override de columnas visibles en TransactionsTable
  darkMode: boolean;
  setLanguage: (lang: Language) => void;
  toggleSidebar: () => void;
  setSidebarCollapsed: (v: boolean) => void;
  setVisibleColumns: (cols: string[] | null) => void;
  toggleDarkMode: () => void;
  setDarkMode: (v: boolean) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    set => ({
      sidebarCollapsed: false,
      language: 'es',
      visibleColumns: null,
      darkMode: false,
      setLanguage: (language) => set({ language }),
      toggleSidebar: () => set(state => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setSidebarCollapsed: (v) => set({ sidebarCollapsed: v }),
      setVisibleColumns: (cols) => set({ visibleColumns: cols }),
      toggleDarkMode: () => set(state => ({ darkMode: !state.darkMode })),
      setDarkMode: (v) => set({ darkMode: v }),
    }),
    {
      name: 'psp-ui-preferences',
      storage: createJSONStorage(() => localStorage),
      partialize: state => ({
        language: state.language,
        darkMode: state.darkMode,
        sidebarCollapsed: state.sidebarCollapsed,
      }),
    },
  ),
);
