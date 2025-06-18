import axios from "axios";
import { API_BASE_URL } from "../config/apiConfig";
import Cookies from "js-cookie";
import { signOut } from "next-auth/react";

// Create axios instance with base configuration
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 5000,
});

const refreshTokenEndpoint = `${API_BASE_URL}/users/refresh-token`;

// List of endpoints that don't require authentication
const PUBLIC_ENDPOINTS = [
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
  '/health',
  '/profile'
];

const isPublicEndpoint = (url: string | string[]) => {
  return PUBLIC_ENDPOINTS.some(endpoint => url.includes(endpoint));
};

const handleAuthFailure = async () => {
  console.log("Handling authentication failure - clearing tokens and redirecting");
  await signOut({ redirect: false });
  Cookies.remove('user');
  Cookies.remove('accessToken');
  Cookies.remove('refreshToken');
  window.location.href = '/auth';
};

const refreshAccessToken = async (refreshToken: string) => {
  try {
    const response = await axios.post(refreshTokenEndpoint, {
      refreshToken: refreshToken,
      extensionId: process.env.NEXT_PUBLIC_EXTENSION_ID || 'ajmdlkeecbgnjooecofbcbfkigehipel',
      instanceId: 'your-instance-id' 
    });
    
    return response;
  } catch (error) {
    console.error('Token refresh failed:', error);
    throw error;
  }
}

// Add a request interceptor to add the auth token to every request
axiosInstance.interceptors.request.use(
  async (config) => {
    // Check if this is a public endpoint that doesn't need auth
    if (isPublicEndpoint(config.url || '')) {
      console.log("Public endpoint detected, skipping auth checks:", config.url);
      return config;
    }

    // Get access token directly from the cookie
    const accessToken = Cookies.get('accessToken');
    const refreshToken = Cookies.get('refreshToken');
    
    console.log("Token status:", { 
      hasAccessToken: !!accessToken, 
      hasRefreshToken: !!refreshToken 
    });

    // Case 1: Both tokens are missing
    if (!accessToken && !refreshToken) {
      console.warn("No access token or refresh token found");
      
      // Clean up any remaining auth data
      Cookies.remove('user');
      Cookies.remove('accessToken');
      Cookies.remove('refreshToken');
      
      // Option 1: Redirect immediately (uncomment if you want immediate redirect)
      // await handleAuthFailure();
      // return Promise.reject(new Error('No authentication tokens available'));
      
      // Option 2: Let the request proceed and handle 401 in response interceptor
      console.log("Proceeding without auth header - will handle 401 in response");
      return config;
    }
    
    // Case 2: Refresh token exists but access token is missing - try to refresh
    if (refreshToken && !accessToken) {
      try {
        console.log("No access token but refresh token exists, attempting refresh before request");
        const response = await refreshAccessToken(refreshToken);
        
        if (response.data.accessToken) {
          // Store the new tokens
          Cookies.set('accessToken', response.data.accessToken, { 
            expires: 30,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
          });
          
          if (response.data.refreshToken) {
            Cookies.set('refreshToken', response.data.refreshToken, { 
              expires: 30,
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'strict'
            });
          }
          
          // Add the new token to this request
          config.headers.Authorization = `Bearer ${response.data.accessToken}`;
          console.log("Successfully refreshed token before request");
        }
      } catch (refreshError) {
        console.error("Pre-request token refresh failed:", refreshError);
        // If refresh fails, clean up and redirect
        await handleAuthFailure();
        return Promise.reject(new Error('Token refresh failed'));
      }
    }
    // Case 3: Access token exists - use it
    else if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle token refresh
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // If the error is 401 Unauthorized and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Check if this was a public endpoint - if so, don't try to refresh
      if (isPublicEndpoint(originalRequest.url || '')) {
        console.log("401 on public endpoint, not attempting token refresh");
        return Promise.reject(error);
      }
      
      try {
        // Get the refresh token
        const refreshToken = Cookies.get('refreshToken');
        console.log("Attempting to refresh token due to 401, refreshToken exists:", !!refreshToken);
        
        if (!refreshToken) {
          // No refresh token available, redirect to login
          console.log("No refresh token found after 401, redirecting to login");
          await handleAuthFailure();
          return Promise.reject(error);
        }
        
        // Call your refresh token endpoint
        const response = await refreshAccessToken(refreshToken);
        
        // If token refresh was successful
        if (response.data.accessToken) {
          console.log("Token refresh successful after 401");
          
          // Store the new tokens
          Cookies.set('accessToken', response.data.accessToken, { 
            expires: 30,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
          });
          
          if (response.data.refreshToken) {
            Cookies.set('refreshToken', response.data.refreshToken, { 
              expires: 30,
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'strict'
            });
          }
          
          // Update the Authorization header for the original request
          originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
          
          // Retry the original request
          return axiosInstance(originalRequest);
        } else {
          throw new Error('No access token in refresh response');
        }
      } catch (refreshError) {
        console.error("Token refresh failed after 401:", refreshError);
        // Clear auth cookies on refresh failure and redirect
        await handleAuthFailure();
        return Promise.reject(refreshError);
      }
    } else {
      console.error("Response error:", error.response?.data?.error || "Unknown error");
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;

