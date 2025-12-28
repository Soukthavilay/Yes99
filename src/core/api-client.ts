import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // ສໍາລັບ HTTP-Only Cookies (BFF)
});

// Request Interceptor: ສໍາລັບການໃສ່ Token ຫຼື Logging
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // ຖ້າຫາກ Backend ບໍ່ໃຊ້ Http-Only Cookie ແຕ່ໃຊ້ Bearer Token
    // const token = localStorage.getItem('auth_token');
    // if (token && config.headers) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: ສໍາລັບຈັດການ Global Error (401, 403, 500)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Logic ສໍາລັບ Logout ຫຼື Refresh Token
      console.error('Unauthorized! Redirecting to login...');
    }
    return Promise.reject(error);
  }
);

export default apiClient;
