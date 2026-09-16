import { create } from "zustand";
import api from "../api/axios";

interface AuthState {
  user: any;
  accessToken: string | null;
  refreshToken: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (
    username: string,
    email: string,
    password: string,
    role: string,
  ) => Promise<void>;
  logout: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
  // Safe parsing for strings/null
  user: JSON.parse(
    typeof window !== "undefined"
      ? localStorage.getItem("user") || "null"
      : "null",
  ),
  accessToken:
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null,
  refreshToken:
    typeof window !== "undefined" ? localStorage.getItem("refreshToken") : null,

  logout: () => {
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    set({ user: null, accessToken: null, refreshToken: null });
  },
  login: async (email: string, password: string) => {
    try {
      const { data } = await api.post("/auth/login", { email, password });
      const { accessToken } = data.data?.accessToken
        ? data.data
        : { accessToken: null };
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("user", JSON.stringify(data.data?.user));
      set({
        user: data.data?.user,
      });
    } catch (error: any) {
      console.error("Login error:", error.message);
    }
  },
  signup: async (
    username: string,
    email: string,
    password: string,
    role: string,
  ) => {
    try {
      await api.post("/auth/register", { username, email, password, role });
    } catch (error: any) {
      console.error("Signup error:", error.message);
    }
  },
}));

export default useAuthStore;
