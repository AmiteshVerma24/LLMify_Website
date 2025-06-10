'use client';

import React from 'react';
import { useSession, signIn } from 'next-auth/react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
// import authService from '@/services/authService'; 


export default function Auth() {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const extensionId = searchParams.get('extensionId') || 'ajmdlkeecbgnjooecofbcbfkigehipel';
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState('');
  
  // Redirect to sign in if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      signIn();
    }
  }, [status]);
  
  // Send message to extension when authenticated
  useEffect(() => {
    async function extensionAuth() {
      if (!session || !session.user) {
        setError("Authentication failed. Please try again.");
        return;
      }
      try {
        if (!session.user.email || !session.user.name) {
          setError("User email or name is not available. Please ensure you are logged in.");
          return;
        }
        const data = {
          type: "AUTH_SUCCESS",
          user: session.user,
          accessToken: session.accessToken,
          refreshToken: session.refreshToken,
          provider: session?.provider,
          providerId: session?.providerId,
          timestamp: Date.now()
        };

        setMessage("Sending authentication data to the extension...");
         try {
          // Method 1: Try direct communication with extension API
          if (window.chrome && chrome.runtime && chrome.runtime.sendMessage) {
            console.log("Attempting direct chrome.runtime.sendMessage");
            chrome.runtime.sendMessage(
              extensionId,
              data,
              (response) => {
                if (chrome.runtime.lastError) {
                  console.error("Extension messaging error:", chrome.runtime.lastError);
                  setMessage("Using alternative authentication method");
                  sendViaPostMessage(data);
                } else {
                  console.log("Direct extension response:", response);
                  setSuccess(true);
                  setMessage("Authentication successful! Redirecting...");
                  setTimeout(() => router.push("/"), 1500);
                }
              }
            );
          } else {
            console.log("chrome.runtime not available, using postMessage");
            setMessage("Using alternative authentication method");
            sendViaPostMessage(data);
          }
        } catch (error) {
          console.error("Error in authentication process:", error);
          setMessage("Using fallback authentication method");
          sendViaPostMessage(data);
        }
      } catch (error) {
        console.error("Error during authentication:", error);
        setError("An unexpected error occurred. Please try again.");
      }
    }
    
    function sendViaPostMessage(authData: any) {
      try {
        localStorage.setItem("extensionAuthData", JSON.stringify(authData));
        // Send via postMessage
        window.postMessage({
          target: "CHROME_EXTENSION",
          extensionId: extensionId,
          data: authData
        }, window.location.origin);
        
        console.log("Auth data sent via postMessage");
        setSuccess(true);
        setMessage("Authentication data sent. Redirecting...");
        
        setTimeout(() => router.push("/"), 1500);
      } catch (postError) {
        console.error("PostMessage error:", postError);
        setError("Authentication failed. Please try again.");
      }
    }

    if (session && session.user) {
      extensionAuth();
    }

  }, [session, router, extensionId]);
  
  if (status === 'loading') {
    return (
      <div className="container">
        <div className="loader-container">
          <div className="loader"></div>
          <p>Authenticating...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container text-white">
      <main>
        <h1>Authentication</h1>
        
        {error ? (
          <div className="error-card">
            <h2>Authentication Error</h2>
            <p>{error}</p>
            <button onClick={() => window.close()} className="button">
              Close Window
            </button>
          </div>
        ) : success ? (
          <div className="success-card">
            <h2>Authentication Successful</h2>
            <p>You have been successfully authenticated.</p>
            {message && <p>{message}</p>}
            <p>This window will close automatically.</p>
          </div>
        ) : session ? (
          <div className="card">
            <h2>Completing Authentication</h2>
            <p>Sending credentials to the extension...</p>
            {message && <p>{message}</p>}
            <div className="loader"></div>
          </div>
        ) : (
          <div className="card">
            <h2>Authenticating...</h2>
            <p>Please wait...</p>
            <div className="loader"></div>
          </div>
        )}
      </main>
    </div>
  );
}