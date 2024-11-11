// src/pages/Categories/CategoryDetail.tsx

import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getCategoryById,
  deleteCategory,
  Category,
} from '../../api/categoryAPI';
import { toast } from 'react-toastify';
import axios from 'axios';

const CategoryDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Получение категории по ID
  const {
    data: category,
    error,
    isLoading,
    isError,
  } = useQuery<Category>({
    queryKey: ['category', id],
    queryFn: async () => {
      if (id) {
        return getCategoryById(Number(id));
      }
      throw new Error('Не удалось получить ID категории');
    },
  });

  // Мутация для удаления категории
  const deleteMutation = useMutation<void, unknown, number>({
    mutationFn: async (categoryId: number) => {
      await deleteCategory(categoryId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] }); // Инвалидация списка категорий после удаления
      toast.success('Категория успешно удалена');
      navigate('/categories');
    },
    onError: (err: unknown) => {
      if (axios.isAxiosError(err)) {
        toast.error(
          `Ошибка при удалении категории: ${err.response?.data || err.message}`
        );
      } else if (err instanceof Error) {
        toast.error(`Ошибка: ${err.message}`);
      } else {
        toast.error('Произошла неизвестная ошибка');
      }
    },
  });

  // Обработчик удаления категории
  const handleDelete = () => {
    if (!id) return;
    if (!window.confirm('Вы уверены, что хотите удалить эту категорию?'))
      return;

    deleteMutation.mutate(Number(id));
  };

  // Обработка состояния загрузки или ошибки
  if (isLoading) {
    return <div className="loading-indicator">Загрузка...</div>;
  }

  if (isError || !category) {
    return (
      <div className="error-message" style={{ color: 'red' }}>
        Ошибка:{' '}
        {error instanceof Error ? error.message : 'Категория не найдена'}
      </div>
    );
  }

  // Основной рендер
  return (
    <div className="category-details">
      <h2>Детали Категории</h2>
      <p>
        <strong>ID:</strong> {category.id}
      </p>
      <p>
        <strong>Название:</strong> {category.name}
      </p>
      <p>
        <strong>Описание:</strong> {category.description || '—'}
      </p>
      <Link to={`/categories/${category.id}/edit`}>Редактировать</Link>
      {' | '}
      <button
        onClick={() => {
          if (window.confirm('Вы уверены, что хотите удалить эту категорию?')) {
            deleteMutation.mutate();
          }
        }}
        disabled={deleteMutation.isLoading}
      >
        {deleteMutation.isLoading ? 'Удаление...' : 'Удалить'}
      </button>
      {' | '}
      <Link to="/categories">Назад к списку</Link>
    </div>
  );
};

export default CategoryDetail;
