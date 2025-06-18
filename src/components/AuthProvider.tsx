import { createContext, useContext, useEffect, useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import Cookies from 'js-cookie';

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

   const handleSignOut = async () => {
    try {
      // Add your custom logic here
      console.log('User signing out...');
      
      Cookies.remove('user');
      Cookies.remove('accessToken');
      Cookies.remove('refreshToken');
      await signOut();
      console.log('Sign out completed');
    } catch (error) {
      console.error('Error during sign out:', error);
    }
  };

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
    signOut: handleSignOut
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