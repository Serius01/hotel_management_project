// src/context/AuthProvider.tsx

import React, { useState, useEffect, useCallback } from 'react';
import AuthContext from '../context/AuthContext';
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
  // Состояние для проверки, авторизован ли пользователь
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  // Состояние для хранения данных текущего пользователя
  const [user, setUser] = useState<UserProfile | null>(null);
  // Состояние загрузки данных пользователя
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Функция выхода из системы
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
      setIsLoading(false);
    }
  }, [logout]);

  // Эффект для проверки токенов при загрузке компонента
  useEffect(() => {
    const accessToken = localStorage.getItem('access_token');
    const refreshTokenValue = localStorage.getItem('refresh_token');

    if (accessToken && refreshTokenValue) {
      fetchUserProfile();
    } else {
      setIsLoading(false);
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

  // Эффект для автоматического обновления токенов
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
            logout();
          }
        }
      },
      4 * 60 * 1000
    ); // Обновлять токен каждые 4 минуты

    return () => clearInterval(interval);
  }, [logout]);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, login, register, logout, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
