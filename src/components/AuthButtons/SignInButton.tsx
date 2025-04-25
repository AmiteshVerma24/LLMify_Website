'use client';

import { signIn } from 'next-auth/react';

export default function SignInButton() {
  return (
    <button onClick={() => signIn('google')} className="button">
      Sign In with Google
    </button>
  );
}