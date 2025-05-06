'use client';

import { signOut } from 'next-auth/react';

export default function SignOutButton() {
  return (
    <>
    <p className='text-white'>We are signing out</p>
    <button onClick={() => signOut()} className="button button-danger text-white">
      Sign Out
    </button>
    </>
  );
}