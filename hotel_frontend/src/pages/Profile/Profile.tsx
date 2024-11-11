// src/pages/Profile/Profile.tsx

import React from 'react';
import { NavLink, Routes, Route, Navigate } from 'react-router-dom';
import UsersTab from '../../components/ProfileTabs/UsersTab';
import RolesTab from '../../components/ProfileTabs/RolesTab';
import ActivityLogTab from '../../components/ProfileTabs/ActivityLogTab';
import '../../styles/Profile.css';
import useAuth from '../../hooks/useAuth';

// Компонент профиля с вкладками для управления пользователями, ролями и историей действий
const Profile: React.FC = () => {
  // Получаем информацию о текущем пользователе из хука аутентификации
  const { user } = useAuth();

  // Проверяем, что пользователь существует и является администратором
  if (!user || user.role !== 'admin') {
    // Если нет, отображаем сообщение об отсутствии доступа
    return <div>У вас нет доступа к этой странице</div>;
  }

  return (
    <div className="profile-page">
      {/* Навигационные вкладки */}
      <div className="tabs">
        <NavLink
          to="/profile/users"
          className={({ isActive }) => (isActive ? 'active' : '')}
        >
          Пользователи
        </NavLink>
        <NavLink
          to="/profile/roles"
          className={({ isActive }) => (isActive ? 'active' : '')}
        >
          Роли
        </NavLink>
        <NavLink
          to="/profile/activity"
          className={({ isActive }) => (isActive ? 'active' : '')}
        >
          История действий
        </NavLink>
      </div>
      {/* Содержимое текущей вкладки */}
      <div className="tab-content">
        <Routes>
          {/* Если путь пустой, перенаправляем на вкладку "Пользователи" */}
          <Route path="/" element={<Navigate to="users" replace />} />
          {/* Маршрут для вкладки "Пользователи" */}
          <Route path="users" element={<UsersTab />} />
          {/* Маршрут для вкладки "Роли" */}
          <Route path="roles" element={<RolesTab />} />
          {/* Маршрут для вкладки "История действий" */}
          <Route path="activity" element={<ActivityLogTab />} />
          {/* Обработка неизвестных маршрутов */}
          <Route path="*" element={<div>Страница не найдена</div>} />
        </Routes>
      </div>
    </div>
  );
};

export default Profile;
