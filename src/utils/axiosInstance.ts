import axios from "axios";
import { API_BASE_URL } from "../config/apiConfig";
import Cookies from "js-cookie";

// Create axios instance with base configuration
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 5000,
});

// Add a request interceptor to add the auth token to every request
axiosInstance.interceptors.request.use(
  async (config) => {
    // Get access token directly from the cookie
    const accessToken = Cookies.get('accessToken');
    console.log("Access token retrieved from cookie:", accessToken ? "Token exists" : "No token");
    
    // Add token to headers if it exists
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle token refresh (optional enhancement)
// axiosInstance.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   async (error) => {
//     const originalRequest = error.config;
    
//     // If the error is 401 Unauthorized and we haven't retried yet
//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;
      
//       try {
//         // Get the refresh token
//         const refreshToken = Cookies.get('refreshToken');
        
//         if (!refreshToken) {
//           // No refresh token available, redirect to login
//           window.location.href = '/signin';
//           return Promise.reject(error);
//         }
        
//         // Call your refresh token endpoint
//         const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
//           refreshToken: refreshToken
//         });
        
//         // If token refresh was successful
//         if (response.data.accessToken) {
//           // Store the new tokens
//           Cookies.set('accessToken', response.data.accessToken, { 
//             expires: 30,
//             secure: process.env.NODE_ENV === 'production',
//             sameSite: 'strict'
//           });
          
//           if (response.data.refreshToken) {
//             Cookies.set('refreshToken', response.data.refreshToken, { 
//               expires: 30,
//               secure: process.env.NODE_ENV === 'production',
//               sameSite: 'strict'
//             });
//           }
          
//           // Update the Authorization header for the original request
//           originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
          
//           // Retry the original request
//           return axiosInstance(originalRequest);
//         }
//       } catch (refreshError) {
//         console.error("Token refresh failed:", refreshError);
//         // Clear auth cookies on refresh failure
//         Cookies.remove('user');
//         Cookies.remove('accessToken');
//         Cookies.remove('refreshToken');
        
//         // Redirect to login page
//         window.location.href = '/signin';
//       }
//     }
    
//     return Promise.reject(error);
//   }
// );

export default axiosInstance;