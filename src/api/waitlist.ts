import axiosInstance from "@/utils/axiosInstance";
import { endpoints } from "@/config/apiConfig";

export const saveToWaitlist = async (username: string, email: string) => {
    try {
        const response = await axiosInstance.post(endpoints.addUserToWaitlist, {
            username,
            email
        });
        return response.data;
    } catch (error: any) {
        throw error.response?.data || error.message;
    }
}