import Cookies from "js-cookie";

const ACCESS_TOKEN_KEY = "goAccessToken";
const REFRESH_TOKEN_KEY = "goRefreshToken";
const USER_KEY = "goUser";

// Optional: Define user shape
export interface GoUser {
  id: string;
  name: string;
  email: string;
  imageUrl?: string;
  plan?: string;
  [key: string]: any;
}

// Utility: Safely decode JWT payload
function decodeJwtPayload(token: string): any | null {
  try {
    const base64 = token.split(".")[1]
      .replace(/-/g, "+")
      .replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("Failed to decode JWT payload:", e);
    return null;
  }
}

const cookieService = {
  // --- TOKEN MANAGEMENT ---

  setAccessToken: (token: string, options = {}) => {
    Cookies.set(ACCESS_TOKEN_KEY, token, { expires: 7, sameSite: "Lax", ...options });
    console.log("Access token set:", token);
  },
  getAccessToken: (): string | undefined =>
    Cookies.get(ACCESS_TOKEN_KEY),
  removeAccessToken: () =>
    Cookies.remove(ACCESS_TOKEN_KEY),

  setRefreshToken: (token: string, options = {}) =>
    Cookies.set(REFRESH_TOKEN_KEY, token, { expires: 7, sameSite: "Lax", ...options }),
  getRefreshToken: (): string | undefined =>
    Cookies.get(REFRESH_TOKEN_KEY),
  removeRefreshToken: () =>
    Cookies.remove(REFRESH_TOKEN_KEY),

  // --- USER PROFILE MANAGEMENT ---

  setUser: (user: GoUser, options = {}) =>
    Cookies.set(USER_KEY, JSON.stringify(user), { expires: 7, sameSite: "Lax", ...options }),
  getUser: (): GoUser | undefined => {
    const raw = Cookies.get(USER_KEY);
    return raw ? (JSON.parse(raw) as GoUser) : undefined;
  },
  removeUser: () =>
    Cookies.remove(USER_KEY),

  // --- AUTHENTICATION STATUS ---

  isAuthenticated: (): boolean => {
    const token = Cookies.get(ACCESS_TOKEN_KEY);
    if (!token) return false;
    const payload = decodeJwtPayload(token);
    if (!payload || typeof payload.exp !== "number") return false;
    // exp is in seconds, Date.now() is ms
    return payload.exp > Date.now() / 1000;
  },

  // --- CLEAR ALL ---

  clear: () => {
    Cookies.remove(ACCESS_TOKEN_KEY);
    Cookies.remove(REFRESH_TOKEN_KEY);
    Cookies.remove(USER_KEY);
  },
};

export default cookieService;