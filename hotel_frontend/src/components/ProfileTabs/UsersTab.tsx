// src/components/ProfileTabs/UsersTab.tsx

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchUsers } from '../../api/userAPI';
import UserTable from '../UserManagement/UserTable';
import UserForm from '../UserManagement/UserForm';
import '../../styles/UsersTab.css';
import { User } from '../../types/User';

// Интерфейс для ответа от сервера при получении списка пользователей
interface UsersResponse {
  results: User[]; // Массив пользователей
  count: number; // Общее количество пользователей
}

const UsersTab: React.FC = () => {
  // Состояние для фильтров поиска пользователей
  const [filters, setFilters] = useState({
    name: '',
    email: '',
    role: '',
    status: '',
  });

  // Состояние для выбранного пользователя (для редактирования)
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  // Состояние для управления отображением формы добавления/редактирования
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Получаем список пользователей с помощью React Query
  const {
    data: usersData,
    isLoading,
    error,
    refetch,
  } = useQuery<UsersResponse, Error>({
    queryKey: ['users', filters],
    queryFn: () => fetchUsers(filters),
    staleTime: 5000,
  });

  console.log('usersData:', usersData);

  // Обработчик изменения фильтров
  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  // Обработчик отмены действия (закрытие формы)
  const handleCancel = () => {
    setIsFormOpen(false);
    setSelectedUser(null);
  };

  // Обработчик для добавления нового пользователя
  const handleAddUser = () => {
    setSelectedUser(null);
    setIsFormOpen(true);
  };

  // Обработчик для редактирования существующего пользователя
  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsFormOpen(true);
  };

  // Обработчик успешной отправки формы
  const handleFormSubmitSuccess = () => {
    setIsFormOpen(false);
    refetch(); // Обновляем список пользователей
  };

  if (isLoading) return <div>Загрузка пользователей...</div>;
  if (error) return <div>Ошибка при загрузке пользователей</div>;

  return (
    <div>
      <h2>Список пользователей</h2>
      <button onClick={handleAddUser}>Добавить пользователя</button>
      {/* Форма фильтров (поля фильтрации будут добавлены здесь) */}
      <form className="user-filters">{/* Поля фильтров */}</form>
      {/* Таблица пользователей */}
      <UserTable users={usersData?.results || []} onEditUser={handleEditUser} />
      {/* Форма добавления/редактирования пользователя */}
      {isFormOpen && (
        <UserForm
          initialValues={
            selectedUser || {
              id: undefined,
              name: '',
              email: '',
              username: '',
              password: '',
              role: '',
              status: '',
              permissions: [], // Добавляем отсутствующее поле 'permissions'
            }
          }
          onSubmitSuccess={handleFormSubmitSuccess}
          onCancel={handleCancel} // Передаем функцию отмены
        />
      )}
    </div>
  );
};

export default UsersTab;
