import { create } from 'zustand';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration: number;
}

interface ToastState {
  toasts: Toast[];
  show: (toast: Omit<Toast, 'id' | 'duration'> & { duration?: number }) => string;
  dismiss: (id: string) => void;
  clear: () => void;
}

let counter = 0;

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  show: ({ type, message, duration = 4000 }) => {
    counter += 1;
    const id = `t_${Date.now()}_${counter}`;
    set(state => ({ toasts: [...state.toasts, { id, type, message, duration }] }));
    return id;
  },
  dismiss: (id) =>
    set(state => ({ toasts: state.toasts.filter(t => t.id !== id) })),
  clear: () => set({ toasts: [] }),
}));

// Helpers para llamar sin tener que importar el hook.
export const toast = {
  success: (message: string, duration?: number) =>
    useToastStore.getState().show({ type: 'success', message, duration }),
  error: (message: string, duration?: number) =>
    useToastStore.getState().show({ type: 'error', message, duration }),
  info: (message: string, duration?: number) =>
    useToastStore.getState().show({ type: 'info', message, duration }),
  warning: (message: string, duration?: number) =>
    useToastStore.getState().show({ type: 'warning', message, duration }),
};
