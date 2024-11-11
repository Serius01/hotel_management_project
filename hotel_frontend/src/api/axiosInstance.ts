// src/api/axiosInstance.ts

import axios from 'axios';
import { toast } from 'react-toastify';

const axiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:8000', // Ваш бэкенд URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Добавление интерсептора для добавления токена в заголовки запросов

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Добавление интерсептора для обработки ошибок
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;
    if (response) {
      const errorMessage = response.data?.detail || 'Произошла ошибка';
      toast.error(`Ошибка: ${errorMessage}`);
    } else {
      toast.error('Сеть недоступна');
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
