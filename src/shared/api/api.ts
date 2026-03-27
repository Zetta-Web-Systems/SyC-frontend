import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { env } from "@shared/config/env";
import { useAuthStore } from "@features/auth";
import { queryClient } from "@shared/config/queryClient";
export const api = axios.create({
  baseURL: env.API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
  paramsSerializer: {
    indexes: null, // TEMP_MSG: Evita que los arrays se serialicen con índices (e.g., ?ids=1&ids=2 en lugar de ?ids[0]=1&ids[1]=2)
  },
});

/**
 * Endpoints que no deben activar el flujo de refresh token.
 */
const SKIP_REFRESH_ENDPOINTS = ["/users/login", "/users/refresh-token"];

function shouldSkipRefresh(url: string | undefined): boolean {
  return SKIP_REFRESH_ENDPOINTS.some((endpoint) => url === endpoint);
}

function forceLogout() {
  useAuthStore.getState().logout();
  queryClient.clear();
}

let isRefreshing = false;
let failedRequestsQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: unknown | null) => {
  failedRequestsQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(undefined);
    }
  });
  failedRequestsQueue = [];
};

/**
 * Interceptor de Response (refresh)
 */
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (!error.response) {
      return Promise.reject(error);
    }

    const status = error.response.status;

    if (shouldSkipRefresh(originalRequest.url)) {
      return Promise.reject(error);
    }

    if (status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedRequestsQueue.push({ resolve, reject });
        })
          .then(() => api(originalRequest))
          .catch((err) => Promise.reject(err));
      }
      originalRequest._retry = true;
      isRefreshing = true;
      try {
        await api.post("/users/refresh-token");

        processQueue(null);
        isRefreshing = false;

        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        isRefreshing = false;
        forceLogout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);
