import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let authListener = null

    const handleInitialSession = async () => {
      // If we have been redirected back from an OAuth provider we will have
      // a `code` (and possibly other) query param(s) in the URL. We need to
      // exchange this code for a real Supabase session **before** reading the
      // current session, otherwise `getSession()` will return `null` and we
      // will get bounced back to the /login page.
      let currentUrl
      let code = null
      
      try {
        currentUrl = new URL(window.location.href)
        code = currentUrl.searchParams.get('code')
      } catch (err) {
        console.error('Failed to parse URL:', err)
        // Continue without OAuth code exchange
      }

      if (code) {
        try {
          await supabase.auth.exchangeCodeForSession(code)
          // Remove auth-related query params from the URL so they don't stick
          // around in the address bar or pollute our routing.
          if (currentUrl) {
            currentUrl.searchParams.delete('code')
            currentUrl.searchParams.delete('state')
            window.history.replaceState({}, document.title, currentUrl.pathname)
          }
        } catch (err) {
          console.error('Failed to exchange OAuth code for session:', err)
        }
      }

      // Now that any pending OAuth flow has been resolved, retrieve the (possibly
      // new) session and set up the normal auth state listener.
      const {
        data: { session },
      } = await supabase.auth.getSession()
      setUser(session?.user || null)
      setLoading(false)

      const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user || null)
        setLoading(false)
      })

      authListener = listener
    }

    handleInitialSession()

    return () => {
      authListener?.subscription.unsubscribe()
    }
  }, [])

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
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