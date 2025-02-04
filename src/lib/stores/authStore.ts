import { create } from 'zustand';
import { User } from '@supabase/supabase-js';

type AuthStore = {
  user: User | null;
  username: string | null;
  setUser: (user: User | null) => void;
  setUsername: (username: string | null) => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  username: null,
  setUser: (user) => set({ user }),
  setUsername: (username) => set({ username }),
})); 