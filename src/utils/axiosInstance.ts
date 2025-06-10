import axios from "axios";
import { API_BASE_URL } from "../config/apiConfig";
import { getSession } from "next-auth/react";
import cookieService from "@/services/jwtService";

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
    const session = await getSession();
    const accessToken = cookieService.getAccessToken();
    console.log("Session retrieved:", session);
    console.log("Access token retrieved:", accessToken);
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;