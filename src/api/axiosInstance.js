// src/api/axiosInstance.js
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // 수정됨
import { store } from '../redux/store';
import { loginSuccess } from '../redux/slices/authSlice'; // 수정됨

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
axiosInstance.interceptors.response.use(
    (response) => {
      // OAuth2 로그인 응답 처리
      const accessToken = response.headers['authorization']?.replace('Bearer ', '');
      const refreshToken = response.headers['refresh'];

      // 토큰 저장만 수행
      if (accessToken) {
        localStorage.setItem('access_token', accessToken);
      }
      if (refreshToken) {
        localStorage.setItem('refresh_token', refreshToken);
      }

      return response;
    },
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && error.response?.data?.code === 'TOKEN_EXPIRED') {
        if (!originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const refreshToken = localStorage.getItem('refresh_token');
            const response = await axios.post('http://localhost:8080/refresh-token', null, {
              headers: {
                'Refresh': refreshToken
              }
            });

            const { access_token } = response.data;
            localStorage.setItem('access_token', access_token);
            originalRequest.headers.Authorization = `Bearer ${access_token}`;
            return axiosInstance(originalRequest);
          } catch (refreshError) {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            window.location.href = '/login';
            return Promise.reject(refreshError);
          }
        }
      }
      return Promise.reject(error);
    }
);

export default axiosInstance;