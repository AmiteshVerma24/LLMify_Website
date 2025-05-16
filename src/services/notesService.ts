import { get } from "http";
import axiosInstance from "../utils/axiosInstance";
import { NOTES_ENDPOINTS } from "@/config/apiConfig";

const notesService = {
    getNotes: async () => {
        try {
            console.log("Making API call to:", NOTES_ENDPOINTS.GET_ALL_NOTES);
            const response = await axiosInstance.get(`${NOTES_ENDPOINTS.GET_ALL_NOTES}`);
            console.log("API Response status:", response.status);
            console.log("API Response data:", response.data);
            
            return response.data;
        } catch (error) {
            console.error("Error fetching notes:", error);
            throw error;
        }
    },
    getNotesByWebsiteUrl: async (url: string) => {
        try {
            
            console.log("Making request to:", NOTES_ENDPOINTS.GET_NOTE);
            console.log("Request params:", { url });
            // const response = await axiosInstance.get(`${NOTES_ENDPOINTS.GET_NOTE}?url=${url}`);
            const response = await axiosInstance.get(NOTES_ENDPOINTS.GET_NOTE, {
                params: {
                    url
                },
                 headers: {
                    "Content-Type": "application/json",
                },
            });
            console.log("API Response status:", response.status);
            console.log("API Response data:", response.data);
            
            return response.data;
        } catch (error) {
            console.error("Error fetching note by URL:", error);
            throw error;
        }
    }
}

export default notesService;