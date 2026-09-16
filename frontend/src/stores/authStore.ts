import { create } from "zustand";
import api from "../api/axios";

const AuthStore = create((set) => ({
  user: null,
  loading: false,
  error: null,

  login: async (email: string, password: string) => {
    set({ loading: true });

    try {
      const { data } = await api.post("/auth/login", { email, password });

      set({
        user: data.user || data.data?.user,
        loading: false,
        error: null,
      });
    } catch (error: any) {
      set({
        error: error.message,
      });
    }
  },
}));

export default AuthStore;
