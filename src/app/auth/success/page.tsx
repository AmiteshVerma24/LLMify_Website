'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import authService from '@/services/authService';
import Cookies from 'js-cookie';

export default function AuthSuccess() {
  const { data: session, status } = useSession();
  const [syncState, setSyncState] = useState('pending'); // pending, success, error

  useEffect(() => {
    // Only proceed if authenticated
    if (status === 'authenticated' && session?.user?.email) {
      // Call the extension sync endpoint
      authService.extensionSync({
        email: session.user.email || '',
        name: session.user.name || '',
        extensionId: process.env.NEXT_PUBLIC_EXTENSION_ID || 'your-extension-id',
        instanceId: process.env.NEXT_PUBLIC_INSTANCE_ID || 'your-instance-id'
      })
      .then((response) => {
        console.log("Extension sync successful", response);
        
        // Set cookies with the response data
        // Set expiration to 30 days (or adjust as needed)
        // const expiresIn = 30;
        const expiresInSeconds = 30;
        const expiresDate = new Date(new Date().getTime() + expiresInSeconds * 1000);
        // const accessTokenExpirySeconds = 60 * 60; // 1 hour
        const refreshTokenExpirySeconds = 7 * 24 * 60 * 60; // 7 days

        // const accessTokenExpiresAt = new Date(Date.now() + accessTokenExpirySeconds * 1000);
        const refreshTokenExpiresAt = new Date(Date.now() + refreshTokenExpirySeconds * 1000);

                
        // Save user data in cookie
        Cookies.set('user', JSON.stringify(response.user), { 
          expires: expiresDate,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict'
        });
        
        // Save access token in cookie
        Cookies.set('accessToken', response.accessToken, { 
          expires: expiresDate,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict'
        });
        console.log("Verifying cookie was set:", Cookies.get('accessToken') ? "Success" : "Failed");
        
        // Save refresh token in cookie
        Cookies.set('refreshToken', response.refreshToken, { 
          expires: refreshTokenExpiresAt,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict'
        });
        
        // Update state to show success
        setSyncState('success');
        
        // Send message to Chrome extension if needed
        if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.sendMessage) {
          const extensionId = process.env.NEXT_PUBLIC_EXTENSION_ID;
          if (extensionId) {
            chrome.runtime.sendMessage(extensionId, {
              type: 'AUTH_SUCCESS',
              data: {
                isAuthenticated: true,
                ...response.user,
                accessToken: response.accessToken,
                refreshToken: response.refreshToken
              }
            });
          }
        }
      })
      .catch((error) => {
        console.error("Extension sync failed:", error);
        setSyncState('error');
      });
    }
  }, [status, session]);

  // Simple UI based on sync state
  return (
    <div className="flex items-center justify-center min-h-screen text-white">
      <div className="text-center p-8 max-w-md">
        <h1 className="text-2xl font-bold mb-4">Authentication Successful</h1>
        
        {syncState === 'pending' && (
          <p>Syncing extension data...</p>
        )}
        
        {syncState === 'success' && (
          <p>Extension sync complete! This tab will close automatically in a moment...</p>
        )}
        
        {syncState === 'error' && (
          <p>Extension sync failed. You may need to re-authenticate or contact support.</p>
        )}
        
        <p className="text-sm mt-4">If the tab doesnt close, you can close it manually.</p>
      </div>
    </div>
  );
}