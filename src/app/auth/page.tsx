'use client';

import React from 'react';
import { useSession, signIn } from 'next-auth/react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import authService from '@/services/authService';

export default function Auth() {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const extension = searchParams.get('extension');
  const extensionId = searchParams.get('extensionId') || 'phnekldbpcdigeodkjipkbfoegdbgefm';
  const state = searchParams.get('state');
  
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
    const authData = {
      type: "AUTH_SUCCESS",
      user: session?.user,
      accessToken: session?.accessToken,
      refreshToken: session?.refreshToken,
      provider: session?.provider,
      providerId: session?.providerId,
      
      timestamp: Date.now()
    };
    console.log("Auth data:", authData);
    if (session && session.user) {
      try {
        // Method 1: Try direct communication with extension API
        if (window.chrome && chrome.runtime && chrome.runtime.sendMessage) {
          console.log("Attempting direct chrome.runtime.sendMessage");
          chrome.runtime.sendMessage(
            extensionId,
            authData,
            (response) => {
              if (chrome.runtime.lastError) {
                console.error("Extension messaging error:", chrome.runtime.lastError);
                setMessage("Using alternative authentication method");
                sendViaPostMessage();
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
          sendViaPostMessage();
        }
      } catch (error) {
        console.error("Error in authentication process:", error);
        setMessage("Using fallback authentication method");
        sendViaPostMessage();
      }
    }
    
    function sendViaPostMessage() {
      try {
        // Store in localStorage for potential retrieval by the extension
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