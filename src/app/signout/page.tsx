"use client"; 
import { useState } from "react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SignOutPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [extensionNotified, setExtensionNotified] = useState(false);
  const EXTENSION_ID = process.env.NEXT_PUBLIC_EXTENSION_ID || "your-extension-id"; 

  const notifyExtension = () => {
    try {
      // Only proceed if the Chrome runtime is available (we're in a browser environment)
      if (typeof chrome !== 'undefined' && chrome.runtime) {
        chrome.runtime.sendMessage(
          EXTENSION_ID,
          { 
            type: 'AUTH_SIGNOUT',
            timestamp: new Date().toISOString()
          },
          function(response) {
            if (response && response.success) {
              console.log("Extension notified about logout:", response);
              setExtensionNotified(true);
            } else {
              console.log("Failed to notify extension or no response received");
            }
          }
        );
      } else {
        // Handle case where chrome.runtime isn't available
        console.log("Chrome runtime not available - likely not in Chrome or extension not installed");
      }
    } catch (err) {
      console.error("Error notifying extension about logout:", err);
    }
  };

  const handleSignOut = async () => {
    try {
      setIsLoading(true);
      setError("");

      notifyExtension();
    
      await signOut({ redirect: false });
    
      router.push("/");
    } catch (err) {
      console.error("Sign out error:", err);
      setError("Failed to sign out. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md rounded-lg border border-gray-300 bg-white p-8 shadow-md">
        <h1 className="mb-6 text-center text-2xl font-bold">Sign Out</h1>
        <p className="mb-6 text-center text-gray-600">
          Are you sure you want to sign out?
        </p>
        
        {error && (
          <p className="mb-4 text-center text-red-600">{error}</p>
        )}
        
        <div className="flex flex-col space-y-4">
          <button
            onClick={handleSignOut}
            disabled={isLoading}
            className="rounded bg-red-600 px-4 py-2 font-bold text-white hover:bg-red-700 disabled:opacity-50"
          >
            {isLoading ? "Signing out..." : "Yes, Sign me out"}
          </button>
          <button
            onClick={handleCancel}
            disabled={isLoading}
            className="rounded bg-gray-200 px-4 py-2 font-bold text-gray-800 hover:bg-gray-300 disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}