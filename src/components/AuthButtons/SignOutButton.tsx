'use client';

import { signOut } from 'next-auth/react';
import Cookies from 'js-cookie';

export default function SignOutButton() {
  const handleSignOut = async () => {
    Cookies.remove('user');
    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');
    console.log("Cookies removed successfully");
    await signOut({ redirect: false });
    window.location.href = '/'; 
  }
  return (
    <>
    <p className='text-white'>We are signing out</p>
    <button onClick={handleSignOut} className="button button-danger text-white">
      Sign Out
    </button>
    </>
  );
}