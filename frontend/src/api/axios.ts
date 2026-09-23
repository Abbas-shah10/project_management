import axios from "axios";
import type { AxiosError, InternalAxiosRequestConfig } from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("accessToken");

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

let refreshPromise: Promise<string> | null = null;

const clearAuthAndRedirect = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");

  if (window.location.pathname !== "/login") {
    window.location.replace("/login");
  }
};

const refreshAccessToken = async () => {
  const storedRefreshToken = localStorage.getItem("refreshToken");
  const { data } = await api.post("/auth/refresh-token", {
    refreshToken: storedRefreshToken,
  });
  const { accessToken, refreshToken } = data.data || {};

  if (!accessToken) {
    throw new Error("Unable to refresh access token");
  }

  localStorage.setItem("accessToken", accessToken);
  if (refreshToken) {
    localStorage.setItem("refreshToken", refreshToken);
  }

  return accessToken;
};

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined;
    const isRefreshRequest = originalRequest?.url?.includes(
      "/auth/refresh-token",
    );

    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry ||
      isRefreshRequest
    ) {
      if (isRefreshRequest && error.response?.status === 401) {
        clearAuthAndRedirect();
      }
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      refreshPromise ??= refreshAccessToken().finally(() => {
        refreshPromise = null;
      });

      const accessToken = await refreshPromise;
      originalRequest.headers.Authorization = `Bearer ${accessToken}`;
      return api(originalRequest);
    } catch (refreshError) {
      clearAuthAndRedirect();
      return Promise.reject(refreshError);
    }
  },
);

export default api;
