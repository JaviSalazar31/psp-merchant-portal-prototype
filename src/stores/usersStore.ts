import { create } from 'zustand';
import { MOCK_MERCHANT_USERS, type MockMerchantUser } from '@/mocks/users';

interface UsersState {
  users: MockMerchantUser[];
  addUser: (u: Omit<MockMerchantUser, 'id' | 'createdAt' | 'lastLogin' | 'status'>) => MockMerchantUser;
  updateUser: (id: string, patch: Partial<MockMerchantUser>) => void;
  removeUser: (id: string) => void;
  countAdmins: () => number;
}

let nextId = 1000;

export const useUsersStore = create<UsersState>((set, get) => ({
  users: MOCK_MERCHANT_USERS,

  addUser: data => {
    nextId += 1;
    const user: MockMerchantUser = {
      id: `mu_${nextId}`,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      role: data.role,
      status: 'Pendiente',
      createdAt: new Date(),
      lastLogin: null,
    };
    set(state => ({ users: [...state.users, user] }));
    return user;
  },

  updateUser: (id, patch) => {
    set(state => ({
      users: state.users.map(u => (u.id === id ? { ...u, ...patch } : u)),
    }));
  },

  removeUser: id => {
    set(state => ({ users: state.users.filter(u => u.id !== id) }));
  },

  countAdmins: () => get().users.filter(u => u.role === 'Admin' && u.status === 'Activo').length,
}));
