// src/pages/Categories/CategoryForm.tsx

import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  createCategory,
  getCategoryById,
  updateCategory,
  Category,
  CreateCategoryData,
  UpdateCategoryData,
} from '../../api/categoryAPI';
import { toast } from 'react-toastify';
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';

const CategoryForm: React.FC = () => {
  // Получаем параметр id из URL, если он есть
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Определяем, находимся ли мы в режиме редактирования
  const isEditMode = Boolean(id);

  // Получение данных категории при редактировании
  const {
    data: category,
    error,
    isLoading,
  } = useQuery<Category, Error>({
    queryKey: ['category', id],
    queryFn: () => getCategoryById(Number(id)),
    enabled: isEditMode, // Запрос выполняется только в режиме редактирования
    retry: false, // Не повторять запрос при ошибке
  });

  // Мутация для создания категории
  const createMutation = useMutation<Category, Error, CreateCategoryData>({
    mutationFn: createCategory,
    onSuccess: () => {
      // Инвалидируем кэш списка категорий, чтобы данные обновились
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Категория успешно создана');
      navigate('/categories');
    },
    onError: (err: Error) => {
      toast.error(`Ошибка: ${err.message}`);
    },
  });

  // Определяем тип переменных для обновления категории
  interface UpdateCategoryVariables extends UpdateCategoryData {
    id: number;
  }

  // Мутация для обновления категории
  const updateMutation = useMutation<Category, Error, UpdateCategoryVariables>({
    mutationFn: ({
      id,
      name,
      description,
      type,
      is_active,
    }: UpdateCategoryVariables) => {
      return updateCategory(id, { name, description, type, is_active });
    },
    onSuccess: () => {
      // Инвалидируем кэш списка категорий, чтобы данные обновились
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Категория успешно обновлена');
      navigate('/categories');
    },
    onError: (err: Error) => {
      toast.error(`Ошибка: ${err.message}`);
    },
  });

  // Обработка состояния загрузки и ошибок
  if (isLoading) return <div>Загрузка...</div>;
  if (error && isEditMode)
    return <div style={{ color: 'red' }}>Ошибка: {error.message}</div>;
  if (isEditMode && !category) {
    return <div>Категория не найдена</div>;
  }

  // Начальные значения формы
  const initialValues: CreateCategoryData = {
    name: category?.name || '',
    description: category?.description || '',
    type: category?.type || 'income',
    is_active: category?.is_active ?? true,
  };

  // Схема валидации формы
  const validationSchema = Yup.object({
    name: Yup.string().required('Название обязательно'),
    description: Yup.string(),
    type: Yup.mixed<'income' | 'expense'>()
      .oneOf(['income', 'expense'])
      .required('Тип обязателен'),
    is_active: Yup.boolean().required('Статус обязателен'),
  });

  // Обработчик отправки формы
  const handleSubmit = (
    values: CreateCategoryData,
    { setSubmitting }: FormikHelpers<CreateCategoryData>
  ) => {
    if (isEditMode && id) {
      // Если редактируем существующую категорию
      const variables: UpdateCategoryVariables = {
        id: Number(id),
        ...values,
      };
      updateMutation.mutate(variables, {
        onSettled: () => {
          setSubmitting(false); // Сбрасываем состояние отправки формы
        },
      });
    } else {
      // Если создаем новую категорию
      createMutation.mutate(values, {
        onSettled: () => {
          setSubmitting(false); // Сбрасываем состояние отправки формы
        },
      });
    }
  };

  return (
    <div>
      <h2>{isEditMode ? 'Редактировать Категорию' : 'Создать Категорию'}</h2>
      <Formik
        initialValues={initialValues}
        enableReinitialize
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            {/* Поля формы */}
            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="name">Название:</label>
              <Field type="text" name="name" id="name" />
              <ErrorMessage name="name" component="div" className="error" />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="description">Описание:</label>
              <Field
                as="textarea"
                name="description"
                id="description"
                rows={3}
              />
              <ErrorMessage
                name="description"
                component="div"
                className="error"
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="type">Тип:</label>
              <Field as="select" name="type" id="type">
                <option value="income">Доход</option>
                <option value="expense">Расход</option>
              </Field>
              <ErrorMessage name="type" component="div" className="error" />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="is_active">Активна:</label>
              <Field type="checkbox" name="is_active" id="is_active" />
              <ErrorMessage
                name="is_active"
                component="div"
                className="error"
              />
            </div>

            <button
              type="submit"
              disabled={
                createMutation.isPending ||
                updateMutation.isPending ||
                isSubmitting
              }
            >
              {createMutation.isPending ||
              updateMutation.isPending ||
              isSubmitting
                ? 'Сохранение...'
                : isEditMode
                  ? 'Обновить'
                  : 'Создать'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default CategoryForm;
