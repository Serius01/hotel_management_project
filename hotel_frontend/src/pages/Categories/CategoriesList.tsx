// src/pages/Categories/CategoriesList.tsx

import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCategories, deleteCategory, Category } from '../../api/categoryAPI';
import { toast } from 'react-toastify';
import axios from 'axios';

const CategoriesList: React.FC = () => {
  const queryClient = useQueryClient();

  // Получение категорий с помощью useQuery
  const {
    data: categories,
    error,
    isLoading,
    isError,
  } = useQuery<Category[], Error>({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  console.log('Категории:', categories); // Для отладки

  // Удаление категории с использованием useMutation
  const removeCategory = useMutation<void, Error, number>({
    mutationFn: async (id: number) => {
      await deleteCategory(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] }); // Инвалидация данных после успешного удаления
      showToast('success', 'Категория успешно удалена');
    },
    onError: (err: Error) => {
      if (axios.isAxiosError(err)) {
        showToast(
          'error',
          `Ошибка при удалении категории: ${err.response?.data || err.message}`
        );
      } else {
        showToast('error', `Ошибка: ${err.message}`);
      }
    },
  });

  const handleDelete = (id: number) => {
    if (window.confirm('Вы уверены, что хотите удалить эту категорию?')) {
      removeCategory.mutate(id);
    }
  };

  // Функция для отображения уведомлений
  const showToast = (type: 'success' | 'error', message: string) => {
    if (type === 'success') {
      toast.success(message);
    } else {
      toast.error(message);
    }
  };

  if (isLoading) return <div>Загрузка...</div>;
  if (isError)
    return <div style={{ color: 'red' }}>Ошибка: {error?.message}</div>;
  if (!categories || categories.length === 0)
    return <div>Категории отсутствуют</div>;

  // Дополнительная проверка для уверенности, что categories является массивом
  if (!Array.isArray(categories)) {
    console.error('categories is not an array:', categories);
    return <div>Ошибка: данные категорий имеют неверный формат</div>;
  }

  return (
    <div>
      <h2>Список Категорий</h2>
      <Link to="/categories/new">Создать Новую Категорию</Link>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Название</th>
            <th>Описание</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category: Category) => (
            <tr key={category.id}>
              <td>{category.id}</td>
              <td>{category.name}</td>
              <td>{category.description || '—'}</td>
              <td>
                <Link to={`/categories/${category.id}`}>Просмотр</Link>
                {' | '}
                <Link to={`/categories/${category.id}/edit`}>
                  Редактировать
                </Link>
                {' | '}
                <button
                  onClick={() => handleDelete(category.id)}
                  disabled={removeCategory.isLoading}
                >
                  {removeCategory.isLoading ? 'Удаление...' : 'Удалить'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CategoriesList;
