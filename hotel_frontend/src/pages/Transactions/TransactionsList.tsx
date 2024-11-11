import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  getTransactions,
  createTransaction,
  deleteTransaction,
  updateTransaction, // добавляем метод обновления
  Transaction,
  UpdateTransactionData,
} from '../../api/transactionAPI';
import { getCategories, Category } from '../../api/categoryAPI';
import { toast } from 'react-toastify';
import axios from 'axios';
import TransactionRow from './TransactionRow'; // Компонент строки для редактирования
import './TransactionsList.css';

const TransactionsList: React.FC = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');

  // Fetch categories for category selection in form
  const {
    data: categories = [],
    isLoading: isCategoriesLoading,
    isError: isCategoriesError,
  } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  // Fetch transactions for the list
  const {
    data: transactions,
    isLoading: isTransactionsLoading,
    isError: isTransactionsError,
  } = useQuery({
    queryKey: ['transactions'],
    queryFn: getTransactions,
  });

  // Mutation to create a new transaction
  const createMutation = useMutation({
    mutationFn: createTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });

      toast.success('Транзакция добавлена');
      formik.resetForm();
    },
    onError: (err) => {
      if (axios.isAxiosError(err)) {
        toast.error(`Ошибка: ${err.response?.data || err.message}`);
      } else {
        toast.error(`Ошибка: ${err.message}`);
      }
    },
  });

  // Mutation to delete a transaction
  const removeTransaction = useMutation({
    mutationFn: deleteTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });

      toast.success('Транзакция удалена');
    },
    onError: (err) => {
      if (axios.isAxiosError(err)) {
        toast.error(`Ошибка: ${err.response?.data || err.message}`);
      } else {
        toast.error(`Ошибка: ${err.message}`);
      }
    },
  });

  // Mutation to update an existing transaction
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateTransactionData }) =>
      updateTransaction(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast.success('Транзакция обновлена');
    },
    onError: (err) => {
      if (axios.isAxiosError(err)) {
        toast.error(`Ошибка: ${err.response?.data || err.message}`);
      } else {
        toast.error(`Ошибка: ${err.message}`);
      }
    },
  });

  // Formik for form handling and validation
  const formik = useFormik({
    initialValues: {
      date: new Date().toISOString().slice(0, 10),
      description: '',
      category_id: '',
      amount: '',
      type: 'income',
      paymentMethod: 'cash',
      employee: 'Текущий пользователь',
    },
    validationSchema: Yup.object({
      amount: Yup.number()
        .required('Введите сумму')
        .positive('Сумма должна быть положительным числом'),
      category_id: Yup.string().required('Выберите категорию'),
      type: Yup.string().oneOf(['income', 'expense']).required('Выберите тип'),
      description: Yup.string(),
      paymentMethod: Yup.string().required('Выберите метод оплаты'),
    }),
    onSubmit: (values) => {
      const transactionData = {
        ...values,
        amount: parseFloat(values.amount),
        category_id: parseInt(values.category_id, 10),
        payment_method: values.paymentMethod, // убедитесь, что используется правильное имя поля
        type: values.type as 'income' | 'expense',
      };
      createMutation.mutate(transactionData);
    },
  });

  const filteredTransactions = transactions?.filter((transaction) => {
    const description = transaction.description?.toLowerCase() || '';
    const categoryName = transaction.category?.name?.toLowerCase() || '';
    return (
      description.includes(search.toLowerCase()) ||
      categoryName.includes(search.toLowerCase())
    );
  });

  const handleSaveTransaction = (updatedTransaction: Transaction) => {
    if (updatedTransaction.id) {
      const dataToUpdate: UpdateTransactionData = {
        ...updatedTransaction,
        category_id: updatedTransaction.category?.id || undefined, // Приведение к числу или undefined
      };

      console.log('Saving transaction:', dataToUpdate);

      updateMutation.mutate({
        id: updatedTransaction.id,
        data: dataToUpdate,
      });
    } else {
      console.error(
        'Отсутствуют обязательные данные для обновляемой транзакции.'
      );
      toast.error('Ошибка: Проверьте корректность данных перед сохранением.');
    }
  };

  if (isTransactionsLoading || isCategoriesLoading)
    return <div>Загрузка...</div>;
  if (isTransactionsError || isCategoriesError)
    return <div style={{ color: 'red' }}>Ошибка при загрузке данных.</div>;

  return (
    <div className="transactions-container">
      {/* Поле поиска */}
      <input
        type="text"
        placeholder="Поиск по описанию или категории"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-input"
      />

      {/* Форма для добавления новой транзакции */}
      <form onSubmit={formik.handleSubmit} className="add-transaction-form">
        <input
          type="date"
          name="date"
          value={formik.values.date}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        <input
          type="text"
          name="description"
          placeholder="Описание"
          value={formik.values.description}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        <select
          name="category_id"
          onChange={(e) => {
            formik.handleChange(e);
            const selectedCategory = categories.find(
              (category) => category.id === Number(e.target.value)
            );
            if (selectedCategory) {
              formik.setFieldValue('type', selectedCategory.type);
            }
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
        <input
          type="number"
          name="amount"
          placeholder="Сумма"
          value={formik.values.amount}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        <select
          name="type"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.type}
          disabled
        >
          <option value="income">Доход</option>
          <option value="expense">Расход</option>
        </select>
        <select
          name="paymentMethod"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.paymentMethod}
        >
          <option value="cash">Наличные</option>
          <option value="non_cash">Безнал</option>
          <option value="terminal">Терминал</option>
          <option value="qr">QR-код</option>
          <option value="bank_transfer">Банковский перевод</option>
          <option value="crypto">Криптовалюта</option>
        </select>
        <button type="submit" className="add-button">
          Добавить транзакцию
        </button>
      </form>

      {/* Таблица транзакций */}
      <table className="styled-table">
        <thead>
          <tr>
            <th>Дата</th>
            <th>Описание</th>
            <th>Категория</th>
            <th>Сумма</th>
            <th>Тип</th>
            <th>Метод оплаты</th>
            <th>Сотрудник</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {filteredTransactions?.map((transaction) => (
            <TransactionRow
              key={transaction.id}
              transaction={transaction}
              onSave={handleSaveTransaction}
              onDelete={() => removeTransaction.mutate(transaction.id)}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionsList;
