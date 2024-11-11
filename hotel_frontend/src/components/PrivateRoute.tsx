// src/components/PrivateRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  // Если аутентификация еще загружается, показываем индикатор загрузки
  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  // Если пользователь аутентифицирован, показываем переданный компонент, иначе перенаправляем на /login
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
