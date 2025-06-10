import axiosInstance from "../utils/axiosInstance";
import { AUTH_ENDPOINTS } from "@/config/apiConfig";

interface SignupData {
    name: string;
    email: string;
    image_url?: string;
    oauth_provider?: string;
    oauth_provider_id?: string;
    access_token?: string;
    refresh_token?: string;
    subscription_plan?: string;
  }

interface ExtensionSyncData {
    "email": string;
    "name": string;
    "extensionId": string;
    "instanceId": string;
}

const authService = {
    signup: async (data: SignupData) => {
        try {
            const response = await axiosInstance.post(AUTH_ENDPOINTS.SIGNUP, data);
            return response.data;
        } catch (error) {
            console.error("Error during signup:", error);
            throw error;
        }
    },
    exists: async (email: string) => {
        try {
            const response = await axiosInstance.get(`${AUTH_ENDPOINTS.EXISTS}`, {
                params: { email },
            });
            return response.data;
        } catch (error) {
            console.error("Error checking if user exists:", error);
            throw error;
        }
    },
    update: async (data: SignupData, email: string) => {
        try {
            const response = await axiosInstance.patch(`${AUTH_ENDPOINTS.UPDATE}`, 
                data,
                {
                    params: {email}
                }
            );
            return response.data;
        } catch (error) {
            console.error("Error during update:", error);
            throw error;
        }
    },
    extensionSync: async (data: ExtensionSyncData) => {
        try {
            const response = await axiosInstance.post(AUTH_ENDPOINTS.EXTENSION_SYNC, data);
            return response.data;
        } catch (error) {
            console.error("Error during extension sync:", error);
            throw error;
        }
    }
}

export default authService;