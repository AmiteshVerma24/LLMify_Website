'use client';

import { signOut } from 'next-auth/react';

export default function SignOutButton() {
  return (
    <button onClick={() => signOut()} className="button button-danger">
      Sign Out
    </button>
  );
}