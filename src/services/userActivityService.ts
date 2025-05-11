import axiosInstance from "@/utils/axiosInstance";
import { USER_ACTIVITY_ENDPOINTS } from "@/config/apiConfig";

const userActivityService = {
    stats: async () => {
        try {
            const response = await axiosInstance.get(USER_ACTIVITY_ENDPOINTS.USER_STATS);
            return response.data;
        } catch (error) {
            console.error("Error fetching user stats:", error);
            throw error;
        }
    },
    activity: async (type?: string, limit?: number, days?: number) => {
        try {
            const response = await axiosInstance.get(USER_ACTIVITY_ENDPOINTS.USER_ACTIVITY, {
                params: {
                    limit,
                    days,
                    type,
                }
            });
            return response.data;
        } catch (error) {
            console.error("Error fetching user activity:", error);
            throw error;
        }
    }
}

export default userActivityService;