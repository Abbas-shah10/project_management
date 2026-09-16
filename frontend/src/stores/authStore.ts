import { create } from "zustand";

interface AuthState {
  user: any;
  accessToken: string | null;
  refreshToken: string | null;
  setAuth: (user: any, accessToken: string, refreshToken: string) => void;
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

  setAuth: (user, accessToken, refreshToken) => {
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    set({ user, accessToken, refreshToken });
  },

  logout: () => {
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    set({ user: null, accessToken: null, refreshToken: null });
  },
}));

export default useAuthStore;
