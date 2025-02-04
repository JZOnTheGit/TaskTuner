import { supabase } from './supabase';
import { useAuthStore } from './stores/authStore';

export const initSupabaseAuthListener = () => {
  supabase.auth.onAuthStateChange((event, session) => {
    console.log('Auth state changed:', event, session);
    const setUser = useAuthStore.getState().setUser;
    
    if (session) {
      setUser(session.user);
    } else {
      setUser(null);
    }
  });
}; 