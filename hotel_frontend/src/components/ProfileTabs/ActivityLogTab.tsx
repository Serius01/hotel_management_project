// src/components/ProfileTabs/ActivityLogTab.tsx

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchActivityLogs } from '../../api/activityLogAPI';
import ActivityLogTable from '../ActivityLog/ActivityLogTable';
import '../../styles/ActivityLogTab.css';
import { ActivityLog } from '../../types/ActivityLog';
import useAuth from '../../hooks/useAuth';

const ActivityLogTab: React.FC = () => {
  const { user } = useAuth(); // Получаем текущего пользователя из контекста аутентификации

  const [filters, setFilters] = useState({
    user: '',
    actionType: '',
    startDate: '',
    endDate: '',
  });

  // Проверяем, что пользователь авторизован и имеет необходимые разрешения
  if (
    !user ||
    !user.permissions ||
    !user.permissions.includes('view_activity_log')
  ) {
    return <div>У вас нет доступа к этой странице</div>;
  }

  // Используем React Query для загрузки журнала активности с учетом фильтров
  const {
    data: logsData,
    isLoading,
    error,
  } = useQuery<ActivityLog[]>({
    queryKey: ['activityLogs', filters],
    queryFn: () => fetchActivityLogs(filters),
    staleTime: 5000,
  });

  // Обработчик изменения значений фильтров
  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  // Отображаем индикатор загрузки, если данные еще не получены
  if (isLoading) return <div>Загрузка журнала активности...</div>;
  // Отображаем сообщение об ошибке, если произошла ошибка при загрузке данных
  if (error) return <div>Ошибка при загрузке журнала активности</div>;

  return (
    <div>
      <h2>История действий</h2>
      {/* Форма для фильтрации записей журнала активности */}
      <form className="activity-log-filters">
        <input
          type="text"
          name="user"
          placeholder="Пользователь"
          value={filters.user}
          onChange={handleFilterChange}
        />
        <select
          name="actionType"
          value={filters.actionType}
          onChange={handleFilterChange}
        >
          <option value="">Все действия</option>
          <option value="create">Создание</option>
          <option value="update">Обновление</option>
          <option value="delete">Удаление</option>
          {/* Добавьте другие типы действий при необходимости */}
        </select>
        <input
          type="date"
          name="startDate"
          value={filters.startDate}
          onChange={handleFilterChange}
        />
        <input
          type="date"
          name="endDate"
          value={filters.endDate}
          onChange={handleFilterChange}
        />
      </form>
      {/* Отображение таблицы журнала активности, если данные получены */}
      {logsData && <ActivityLogTable logs={logsData} />}
    </div>
  );
};

export default ActivityLogTab;
