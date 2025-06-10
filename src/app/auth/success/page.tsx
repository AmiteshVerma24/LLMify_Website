'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';


  
export default function AuthSuccess() {
  const { data: session, status } = useSession();
  const [messageSent, setMessageSent] = useState(false);

  useEffect(() => {
    if (status === 'authenticated' && session && !messageSent) {
      console.log("Authentication successful, sending to extension");
      
      // Get extension ID from environment variable or config
      const extensionId = process.env.NEXT_PUBLIC_EXTENSION_ID;
      
      if (!extensionId) {
        console.error("Extension ID not configured");
        return;
      }
      
      try {
        const message = {
          type: 'AUTH_SUCCESS',
          data: {
            isAuthenticated: true,
            name: session.user.name,
            email: session.user.email,
            image: session.user.image,
            id: session.user.id,
            accessToken: session.accessToken,
            refreshToken: session.refreshToken,
            provider: session.provider,
            providerId: session.providerId,
            subscription_plan: "free", 
          }
        };

        // Send message to Chrome extension
        chrome.runtime.sendMessage(extensionId, message, (response) => {
          console.log('Response from extension:', response);
          setMessageSent(true);
        });
      } catch (error) {
        console.error("Error sending message to extension:", error);
      }
    }
  }, [status, session, messageSent]);

  return (
    <div className="flex items-center justify-center min-h-screen text-white">
      <div className="text-center p-8 max-w-md">
        <h1 className="text-2xl font-bold mb-4">Authentication Successful</h1>
        <p>Youve been authenticated! This tab will close automatically in a moment...</p>
        <p className="text-sm  mt-4">If the tab doesnt close, you can close it manually.</p>
      </div>
    </div>
  );
}