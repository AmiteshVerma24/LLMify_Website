export const API_BASE_URL = "http://localhost:5050"; 

export const AUTH_ENDPOINTS = {
  SIGNUP: "/users/signup",
  EXISTS: "/users/exists",
  UPDATE: "/users/update",
}

export const USER_ACTIVITY_ENDPOINTS = {
  USER_STATS: "/api/user-stats",
  USER_ACTIVITY: "/api/user-activity",
}

export const NOTES_ENDPOINTS = {
  GET_ALL_NOTES: "/api/all-notes",
  GET_NOTE: "/api/notes",
}

export const GROUPS_ENDPOINTS = {
  GET_ALL_GROUPS: "/api/groups",
  SAVE_NEW_GROUP: "/api/groups/new",
  UPDATE_GROUP: "/api/groups/update",
}