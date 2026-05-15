import { create } from 'zustand';
import type { Language } from './authStore';

interface UIState {
  sidebarCollapsed: boolean;
  language: Language;
  visibleColumns: string[] | null; // override de columnas visibles en TransactionsTable
  setLanguage: (lang: Language) => void;
  toggleSidebar: () => void;
  setSidebarCollapsed: (v: boolean) => void;
  setVisibleColumns: (cols: string[] | null) => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarCollapsed: false,
  language: 'es',
  visibleColumns: null,
  setLanguage: (language) => set({ language }),
  toggleSidebar: () => set(state => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setSidebarCollapsed: (v) => set({ sidebarCollapsed: v }),
  setVisibleColumns: (cols) => set({ visibleColumns: cols }),
}));
