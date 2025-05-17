import axiosInstance from "@/utils/axiosInstance";
import { GROUPS_ENDPOINTS } from "@/config/apiConfig";

const groupService = {
    getGroups: async () => {
        try {
            console.log("Making API call to:", GROUPS_ENDPOINTS.GET_ALL_GROUPS);
            const response = await axiosInstance.get(`${GROUPS_ENDPOINTS.GET_ALL_GROUPS}`);
            console.log("API Response status:", response.status);
            console.log("API Response data:", response.data);
            
            return response.data;
        } catch (error) {
            console.error("Error fetching groups:", error);
            throw error;
        }
    },
    saveNewGroup: async (groupData: any) => {
        try {
            console.log("Making API call to:", GROUPS_ENDPOINTS.SAVE_NEW_GROUP);
            const response = await axiosInstance.post(`${GROUPS_ENDPOINTS.SAVE_NEW_GROUP}`, groupData);
            console.log("API Response status:", response.status);
            console.log("API Response data:", response.data);
            
            return response.data;
        } catch (error) {
            console.error("Error saving new group:", error);
            throw error;
        }
    },
    updateGroup: async (groupId: string, groupData: any) => {
        try {
            console.log("Making API call to:", GROUPS_ENDPOINTS.UPDATE_GROUP);
            const response = await axiosInstance.put(`${GROUPS_ENDPOINTS.UPDATE_GROUP}/${groupId}`, groupData);
            console.log("API Response status:", response.status);
            console.log("API Response data:", response.data);
            
            return response.data;
        } catch (error) {
            console.error("Error updating group:", error);
            throw error;
        }
    }
}
export default groupService;