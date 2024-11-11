// src/context/AuthContext.tsx

import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UserProfile,
  LoginData,
  RegisterData,
  loginUser,
  registerUser,
  getUserProfile,
} from '../api/userAPI';

// Интерфейс для типа контекста аутентификации
export interface AuthContextType {
  isAuthenticated: boolean; // Флаг, указывающий, аутентифицирован ли пользователь
  user: UserProfile | null; // Данные пользователя или null, если пользователь не авторизован
  isLoading: boolean; // Флаг загрузки, указывающий, идет ли процесс аутентификации
  login: (credentials: LoginData) => Promise<void>; // Функция для авторизации пользователя
  register: (credentials: RegisterData) => Promise<void>; // Функция для регистрации нового пользователя
  logout: () => void; // Функция для выхода из системы
}

// Функция-заглушка для методов, которые пока не используются
const noop = async () => {};

// Создаем контекст аутентификации с начальными значениями
const defaultAuthContext: AuthContextType = {
  isAuthenticated: false, // Пользователь не авторизован
  user: null, // Данных о пользователе нет
  isLoading: false, // Загрузка не выполняется
  login: async () => {}, // Заглушка для метода login
  register: async () => {}, // Заглушка для метода register
  logout: () => {}, // Пустая функция для метода logout
};

const AuthContext = React.createContext<AuthContextType>(defaultAuthContext);

// Провайдер контекста аутентификации, который оборачивает компоненты
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Состояние для флага аутентификации
  const [user, setUser] = useState<UserProfile | null>(null); // Состояние для данных пользователя
  const [isLoading, setIsLoading] = useState(true); // Состояние для флага загрузки
  const navigate = useNavigate(); // Хук для навигации

  // Функция для выхода из системы, использует useCallback для оптимизации
  const logout = useCallback(() => {
    localStorage.removeItem('token'); // Удаляем токен из localStorage
    setIsAuthenticated(false); // Обновляем состояние, что пользователь не авторизован
    setUser(null); // Сбрасываем данные пользователя
    setIsLoading(false); // Устанавливаем флаг загрузки в false
    navigate('/login'); // Перенаправляем на страницу логина
  }, [navigate]);

  // Функция для загрузки профиля пользователя
  const fetchUserProfile = useCallback(async () => {
    try {
      const profile = await getUserProfile(); // Запрашиваем данные профиля
      setUser(profile); // Устанавливаем данные пользователя
      setIsAuthenticated(true); // Обновляем состояние, что пользователь авторизован
    } catch (error) {
      console.error('Ошибка при загрузке профиля пользователя:', error); // Логируем ошибку
      logout(); // Если произошла ошибка, выполняем выход
    } finally {
      setIsLoading(false); // Завершаем загрузку
    }
  }, [logout]);

  // Проверка наличия токена при монтировании компонента
  useEffect(() => {
    const token = localStorage.getItem('token'); // Получаем токен из localStorage
    if (token) {
      fetchUserProfile(); // Загружаем профиль пользователя
    } else {
      setIsLoading(false); // Если токена нет, завершаем загрузку
    }
  }, [fetchUserProfile]);

  // Функция для авторизации пользователя
  const login = async (credentials: LoginData) => {
    try {
      const { access } = await loginUser(credentials); // Выполняем запрос на вход
      localStorage.setItem('token', access); // Сохраняем токен в localStorage
      await fetchUserProfile(); // Загружаем профиль пользователя
      navigate('/'); // Перенаправляем на главную страницу
    } catch (error) {
      console.error('Ошибка при входе:', error); // Логируем ошибку
      throw error; // Пробрасываем ошибку выше для обработки в UI
    }
  };

  // Функция для регистрации нового пользователя
  const register = async (credentials: RegisterData) => {
    try {
      const { access } = await registerUser(credentials); // Выполняем запрос на регистрацию
      localStorage.setItem('token', access); // Сохраняем токен в localStorage
      await fetchUserProfile(); // Загружаем профиль пользователя
      navigate('/'); // Перенаправляем на главную страницу
    } catch (error) {
      console.error('Ошибка при регистрации:', error); // Логируем ошибку
      throw error; // Пробрасываем ошибку выше
    }
  };

  // Возвращаем провайдер контекста, предоставляя все методы и состояния
  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
