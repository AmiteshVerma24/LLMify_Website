// 'use client';
// import { useEffect, useState, useCallback } from 'react';
// import { useSession } from 'next-auth/react';
// import { useRouter } from 'next/navigation';

// export default function AuthSuccess() {
//   const { data: session, status } = useSession();
//   const router = useRouter();
  
//   // State management
//   const [syncState, setSyncState] = useState('initializing'); // initializing, sending, success, error, timeout
//   const [errorMessage, setErrorMessage] = useState('');
//   const [countdown, setCountdown] = useState(5);
  
//   // Handle sending message to extension
//   const sendMessageToExtension = useCallback(() => {
//     if (status !== 'authenticated' || !session) return;
    
//     setSyncState('sending');
//     const extensionId = process.env.NEXT_PUBLIC_EXTENSION_ID;
    
//     if (!extensionId) {
//       setErrorMessage('Extension ID not configured. Please contact support.');
//       setSyncState('error');
//       return;
//     }
    
//     try {
//       // Check if running in a Chrome extension environment
//       if (typeof chrome === 'undefined' || !chrome.runtime || !chrome.runtime.sendMessage) {
//         setErrorMessage('Chrome extension API not available. Please ensure you\'re using Chrome with the extension installed.');
//         setSyncState('error');
//         return;
//       }
      
//       const message = {
//         type: 'AUTH_SUCCESS',
//         data: {
//           isAuthenticated: true,
//           name: session.user.name,
//           email: session.user.email,
//           image: session.user.image,
//           id: session.user.id,
//           accessToken: session.accessToken,
//           refreshToken: session.refreshToken,
//           provider: session.provider,
//           providerId: session.providerId,
//           subscription_plan: "free",
//         }
//       };
      
//       // Set timeout for extension response
//       const timeoutId = setTimeout(() => {
//         setSyncState('timeout');
//         setErrorMessage('The extension did not respond. It might not be installed or is disabled.');
//       }, 5000); // 5 second timeout
      
//       // Send message to Chrome extension
//       chrome.runtime.sendMessage(extensionId, message, (response) => {
//         clearTimeout(timeoutId);
        
//         if (chrome.runtime.lastError) {
//           console.error("Extension communication error:", chrome.runtime.lastError);
//           setErrorMessage(`Communication error: ${chrome.runtime.lastError.message || 'Unknown error'}`);
//           setSyncState('error');
//           return;
//         }
        
//         if (!response) {
//           setErrorMessage('No response from extension. Please try again or restart your browser.');
//           setSyncState('error');
//           return;
//         }
        
//         console.log('Response from extension:', response);
//         setSyncState('success');
        
//         // Start countdown for auto-closing
//         startCountdown();
//       });
//     } catch (error) {
//       console.error("Error sending message to extension:", error);
//       setErrorMessage(`An unexpected error occurred: ${error || 'Unknown error'}`);
//       setSyncState('error');
//     }
//   }, [status, session]);
  
//   // Start countdown for tab auto-close
//   const startCountdown = useCallback(() => {
//     let secondsLeft = 5;
//     setCountdown(secondsLeft);
    
//     const intervalId = setInterval(() => {
//       secondsLeft -= 1;
//       setCountdown(secondsLeft);
      
//       if (secondsLeft <= 0) {
//         clearInterval(intervalId);
//         // Attempt to close the tab/window
//         try {
//           window.close();
//         } catch (e) {
//           // Some browsers prevent programmatic closing
//           console.error("Error closing window:", e);
//           console.log("Could not close window automatically");
//         }
//       }
//     }, 1000);
    
//     return () => clearInterval(intervalId);
//   }, []);
  
//   // Handle manual retry
//   const handleRetry = () => {
//     setErrorMessage('');
//     setSyncState('initializing');
//     sendMessageToExtension();
//   };
  
//   // Handle redirect to dashboard if can't auto-close
//   const handleManualContinue = () => {
//     router.push('/dashboard');
//   };
  
//   // Initial effect to trigger sync
//   useEffect(() => {
//     if (status === 'authenticated' && syncState === 'initializing') {
//       sendMessageToExtension();
//     }
//   }, [status, syncState, sendMessageToExtension]);
  
//   // Render different UI based on state
//   const renderContent = () => {
//     switch (syncState) {
//       case 'initializing':
//       case 'sending':
//         return (
//           <>
//             <h1 className="text-2xl font-bold mb-6">Authentication Successful</h1>
//             <div className="flex flex-col items-center">
//               <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mb-4"></div>
//               <p>Syncing with extension...</p>
//             </div>
//           </>
//         );
      
//       case 'success':
//         return (
//           <>
//             <h1 className="text-2xl font-bold mb-6">Success!</h1>
//             <div className="mb-6 flex flex-col items-center">
//               <svg className="h-16 w-16 text-green-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
//               </svg>
//               <p>Authentication complete!</p>
//               <p className="mt-4">This tab will close in {countdown} seconds...</p>
//             </div>
//             <button 
//               onClick={handleManualContinue}
//               className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded text-white transition-colors"
//             >
//               Continue to Dashboard
//             </button>
//           </>
//         );
      
//       case 'error':
//         return (
//           <>
//             <h1 className="text-2xl font-bold mb-6">Authentication Issue</h1>
//             <div className="mb-6 flex flex-col items-center">
//               <svg className="h-16 w-16 text-red-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
//               </svg>
//               <p className="text-red-400 mb-4">{errorMessage}</p>
//               <p className="text-sm">The extension may not be installed or is having connection issues.</p>
//             </div>
//             <div className="flex space-x-4">
//               <button 
//                 onClick={handleRetry}
//                 className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded text-white transition-colors"
//               >
//                 Try Again
//               </button>
//               <button 
//                 onClick={handleManualContinue}
//                 className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded text-white transition-colors"
//               >
//                 Continue Anyway
//               </button>
//             </div>
//           </>
//         );
      
//       case 'timeout':
//         return (
//           <>
//             <h1 className="text-2xl font-bold mb-6">Connection Timeout</h1>
//             <div className="mb-6 flex flex-col items-center">
//               <svg className="h-16 w-16 text-yellow-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
//               </svg>
//               <p className="text-yellow-400 mb-4">{errorMessage}</p>
//               <p className="text-sm">Please check if the extension is installed and enabled.</p>
//             </div>
//             <div className="flex space-x-4">
//               <button 
//                 onClick={handleRetry}
//                 className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded text-white transition-colors"
//               >
//                 Try Again
//               </button>
//               <button 
//                 onClick={handleManualContinue}
//                 className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded text-white transition-colors"
//               >
//                 Continue Anyway
//               </button>
//             </div>
//           </>
//         );
      
//       default:
//         return <p>Something went wrong. Please refresh the page.</p>;
//     }
//   };
  
//   return (
//     <div className="flex items-center justify-center min-h-screen text-white">
//       <div className="text-center p-8 max-w-md bg-gray-800 rounded-lg shadow-xl">
//         {renderContent()}
//       </div>
//     </div>
//   );
// }

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
        const expiresIn = 30;
        
        // Save user data in cookie
        Cookies.set('user', JSON.stringify(response.user), { 
          expires: expiresIn,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict'
        });
        
        // Save access token in cookie
        Cookies.set('accessToken', response.accessToken, { 
          expires: expiresIn,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict'
        });
        console.log("Verifying cookie was set:", Cookies.get('accessToken') ? "Success" : "Failed");
        
        // Save refresh token in cookie
        Cookies.set('refreshToken', response.refreshToken, { 
          expires: expiresIn,
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