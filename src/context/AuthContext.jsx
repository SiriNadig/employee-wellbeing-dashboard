import { createContext, useContext, useEffect, useState } from 'react';
// import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState({ id: 'demo-user', email: 'demo@example.com' }); // Temporary demo user
  const [loading, setLoading] = useState(false); // Set to false to skip loading

  useEffect(() => {
    // Temporarily skip Supabase authentication for demo purposes
    // const getInitialSession = async () => {
    //   try {
    //     const { data: { session } } = await supabase.auth.getSession();
    //     setUser(session?.user ?? null);
    //   } catch (error) {
    //     console.error('Error getting session:', error);
    //   } finally {
    //     setLoading(false);
    //   }
    // };

    // getInitialSession();

    // Listen for auth changes
    // const { data: { subscription } } = supabase.auth.onAuthStateChange(
    //   async (event, session) => {
    //     setUser(session?.user ?? null);
    //     setLoading(false);
    //   }
    // );

    // return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    try {
      // await supabase.auth.signOut();
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const value = {
    user,
    loading,
    signOut,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}