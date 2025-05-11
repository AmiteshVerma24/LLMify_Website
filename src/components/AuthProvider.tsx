import { createContext, useContext, useEffect, useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import type { Session } from 'next-auth';

type AuthContextType = {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    id?: string | null;
  } | null;
  status: 'authenticated' | 'loading' | 'unauthenticated';
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (provider?: string) => Promise<any>;
  signOut: () => Promise<any>;
};

// Create the context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  status: 'loading',
  isAuthenticated: false,
  isLoading: true,
  signIn: () => Promise.resolve(),
  signOut: () => Promise.resolve()
});

// Provider component that wraps your app and makes auth available
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<AuthContextType['user']>(null);

  useEffect(() => {
    if (session?.user) {
      setUser({
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
        id: session.user.id || null
      });
    } else {
      setUser(null);
    }
  }, [session]);

  const value = {
    user,
    status,
    isAuthenticated: status === 'authenticated',
    isLoading: status === 'loading',
    signIn,
    signOut
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook that simplifies accessing the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}