import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { ENDPOINTS } from './endpoints';

// In-memory token storage (never exposed to JS-accessible storage)
let accessToken: string | null = null;
let refreshToken: string | null = null;

export const tokenManager = {
  getAccessToken: () => accessToken,
  getRefreshToken: () => refreshToken,
  setTokens: (access: string, refresh: string) => {
    accessToken = access;
    refreshToken = refresh;
  },
  clear: () => {
    accessToken = null;
    refreshToken = null;
  },
};

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: AxiosError | null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  timeout: 30000,
});

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = tokenManager.getAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => axiosInstance(originalRequest));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const rt = tokenManager.getRefreshToken();
        if (!rt) {
          throw new Error('Missing refresh token');
        }
        const res = await axiosInstance.post(ENDPOINTS.AUTH.REFRESH, {
          refresh_token: rt,
        });
        const { access_token, refresh_token: newRt } = res.data.data;
        tokenManager.setTokens(access_token, newRt);
        processQueue(null);
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError as AxiosError);
        tokenManager.clear();
        if (typeof window !== 'undefined') {
          if (window.location.pathname !== '/login') {
            window.location.replace('/login');
          }
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
