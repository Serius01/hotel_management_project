// src/context/AuthProvider.tsx

import React, { useState, useEffect, useCallback } from 'react';
import AuthContext from './AuthContext'; // Импортируем AuthContext из файла AuthContext.tsx
import {
  loginUser,
  registerUser,
  refreshToken,
  getUserProfile,
  UserProfile,
  LoginData,
  RegisterData,
} from '../api/userAPI';

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // Состояние, указывающее, авторизован ли пользователь
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  // Состояние загрузки данных пользователя
  const [isLoading, setIsLoading] = useState<boolean>(true);
  // Состояние профиля пользователя
  const [user, setUser] = useState<UserProfile | null>(null);

  // Функция для выхода пользователя из системы
  const logout = useCallback(() => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setIsAuthenticated(false);
    setUser(null);
    setIsLoading(false);
  }, []);

  // Функция для получения профиля пользователя
  const fetchUserProfile = useCallback(async () => {
    try {
      const userData = await getUserProfile();
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Ошибка при получении профиля пользователя:', error);
      logout();
    } finally {
      setIsLoading(false); // Завершаем загрузку после получения профиля
    }
  }, [logout]);

  // Проверяем наличие токенов при монтировании компонента
  useEffect(() => {
    const accessToken = localStorage.getItem('access_token');
    const refreshTokenValue = localStorage.getItem('refresh_token');

    if (accessToken && refreshTokenValue) {
      fetchUserProfile();
    } else {
      setIsLoading(false); // Если токенов нет, завершаем загрузку
    }
  }, [fetchUserProfile]);

  // Функция для входа пользователя
  const login = async (credentials: LoginData) => {
    try {
      const response = await loginUser(credentials);
      console.log('Полученные токены:', response);
      localStorage.setItem('access_token', response.access);
      localStorage.setItem('refresh_token', response.refresh);
      await fetchUserProfile();
    } catch (error) {
      console.error('Ошибка при входе:', error);
      throw error;
    }
  };

  // Функция для регистрации пользователя
  const register = async (credentials: RegisterData) => {
    try {
      const response = await registerUser(credentials);
      localStorage.setItem('access_token', response.access);
      localStorage.setItem('refresh_token', response.refresh);
      await fetchUserProfile();
    } catch (error) {
      console.error('Ошибка при регистрации:', error);
      throw error;
    }
  };

  // Автоматическое обновление токенов каждые 4 минуты
  useEffect(() => {
    const interval = setInterval(
      async () => {
        const currentRefreshToken = localStorage.getItem('refresh_token');
        if (currentRefreshToken) {
          try {
            const newAccessToken = await refreshToken({
              refresh: currentRefreshToken,
            });
            localStorage.setItem('access_token', newAccessToken.access);
          } catch (error) {
            console.error('Ошибка при обновлении токена:', error);
            logout(); // Выход при ошибке обновления токена
          }
        }
      },
      4 * 60 * 1000
    ); // Обновление токена каждые 4 минуты

    return () => clearInterval(interval);
  }, [logout]);

  // Возвращаем провайдер контекста, предоставляя значения и методы
  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
