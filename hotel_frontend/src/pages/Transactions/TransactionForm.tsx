import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { createTransaction } from '../../api/transactionAPI';
import { getCategories, Category } from '../../api/categoryAPI';
import { useQuery } from '@tanstack/react-query';

const TransactionForm: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>(
    undefined
  );

  // Используем useQuery для загрузки категорий, передавая объект в виде параметра
  const {
    data: categories = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  const formik = useFormik({
    initialValues: {
      amount: '',
      category_id: '',
      type: 'income' as 'income' | 'expense',
      description: '',
    },
    validationSchema: Yup.object({
      amount: Yup.number()
        .required('Введите сумму')
        .positive('Сумма должна быть положительным числом'),
      category_id: Yup.string().required('Выберите категорию'),
      type: Yup.string().required('Выберите тип'),
      description: Yup.string(),
    }),
    onSubmit: (values) => {
      const transactionData = {
        amount: parseFloat(values.amount), // Преобразуем сумму в число
        category_id: parseInt(values.category_id, 10), // Преобразуем category_id в число
        type: values.type as 'income' | 'expense',
        description: values.description,
      };
      createTransaction(transactionData).then(() => {
        // Перенаправление или обновление после успешного создания транзакции
      });
    },
  });

  // Проверяем статус загрузки категорий
  if (isLoading) return <div>Загрузка категорий...</div>;
  if (isError) return <div>Ошибка при загрузке категорий</div>;

  return (
    <form onSubmit={formik.handleSubmit} className="transaction-form">
      <h2>Создать Транзакцию</h2>

      <label>Сумма</label>
      <input
        type="number"
        name="amount"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.amount}
      />
      {formik.touched.amount && formik.errors.amount ? (
        <div className="error">{formik.errors.amount}</div>
      ) : null}

      <label>Категория</label>
      <select
        name="category_id"
        onChange={(e) => {
          formik.handleChange(e);
          setSelectedCategory(Number(e.target.value));
        }}
        onBlur={formik.handleBlur}
        value={formik.values.category_id}
      >
        <option value="">Выберите категорию</option>
        {categories.map((category: Category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
      {formik.touched.category_id && formik.errors.category_id ? (
        <div className="error">{formik.errors.category_id}</div>
      ) : null}

      <label>Тип</label>
      <select
        name="type"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.type}
      >
        <option value="income">Доход</option>
        <option value="expense">Расход</option>
      </select>

      <label>Описание</label>
      <input
        type="text"
        name="description"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.description}
      />

      <button type="submit">Сохранить</button>
    </form>
  );
};

export default TransactionForm;
