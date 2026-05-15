import { create } from 'zustand';

export type NotificationType = 'transaction' | 'settlement' | 'system' | 'security';

export interface InAppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  unread: boolean;
  createdAt: Date;
  link?: string;
}

interface NotificationState {
  notifications: InAppNotification[];
  drawerOpen: boolean;
  unreadCount: () => number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  toggleDrawer: () => void;
  setDrawerOpen: (v: boolean) => void;
  hydrate: (list: InAppNotification[]) => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  drawerOpen: false,
  unreadCount: () => get().notifications.filter(n => n.unread).length,
  markAsRead: (id) =>
    set(state => ({
      notifications: state.notifications.map(n => (n.id === id ? { ...n, unread: false } : n)),
    })),
  markAllAsRead: () =>
    set(state => ({
      notifications: state.notifications.map(n => ({ ...n, unread: false })),
    })),
  toggleDrawer: () => set(state => ({ drawerOpen: !state.drawerOpen })),
  setDrawerOpen: (v) => set({ drawerOpen: v }),
  hydrate: (list) => set({ notifications: list }),
}));
