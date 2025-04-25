'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';

export default function SignIn() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  
  // Automatically redirect to Google sign-in
  useEffect(() => {
    signIn('google', { callbackUrl });
  }, [callbackUrl]);
  
  return (
    <div className="container">
      <main>
        <h1>Sign In</h1>
        
        <div className="signin-card">
          <h2>Redirecting to sign in...</h2>
          <div className="loader"></div>
        </div>
      </main>
    </div>
  );
}
