import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { AnyUser, UserRole } from '@shared/types';
interface AuthState {
  user: AnyUser | null;
  role: UserRole | null;
  login: (user: AnyUser) => void;
  logout: () => void;
}
export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      role: null,
      login: (user) => set({ user, role: user.role }),
      logout: () => set({ user: null, role: null }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);