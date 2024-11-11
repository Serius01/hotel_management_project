import axiosInstance from './axiosInstance';

// Определение типа Transaction с дополнительными полями
export type Transaction = {
  payment_method: string | number | readonly string[] | undefined;
  id: number;
  amount: number;
  category_id: number;
  type: 'income' | 'expense';
  date?: string;
  description?: string;
  paymentMethod: string | number | readonly string[] | undefined;
  employee: string;
  status?: 'completed' | 'pending' | 'cancelled'; // добавляем статус, если актуально
  category?: { name: string; id: number }; // если API возвращает категорию
};

// Интерфейсы для создания и обновления транзакций
export interface CreateTransactionData {
  type: 'income' | 'expense';
  amount: number;
  category_id: number;
  description?: string;
}

export interface UpdateTransactionData {
  type?: 'income' | 'expense';
  amount?: number;
  category_id?: number;
  description?: string;
}

// Общий интерфейс для пагинированного ответа
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// Функция для получения всех транзакций
export const getTransactions = async (): Promise<Transaction[]> => {
  try {
    const response = await axiosInstance.get<PaginatedResponse<Transaction>>(
      '/api/transaction/transactions/'
    );
    console.log('API Response for getTransactions:', response.data); // Логирование
    return response.data.results;
  } catch (error) {
    console.error('Ошибка при получении списка транзакций:', error);
    throw error;
  }
};

// Функция для создания транзакции
export const createTransaction = async (
  data: CreateTransactionData
): Promise<Transaction> => {
  try {
    const response = await axiosInstance.post<Transaction>(
      '/api/transaction/transactions/',
      data
    );
    console.log('API Response for createTransaction:', response.data); // Логирование
    return response.data;
  } catch (error) {
    console.error('Ошибка при создании транзакции:', error);
    throw error;
  }
};

// Функция для обновления транзакции
export const updateTransaction = async (
  id: number,
  data: UpdateTransactionData
): Promise<Transaction> => {
  try {
    const response = await axiosInstance.put<Transaction>(
      `/api/transaction/transactions/${id}/`,
      data
    );
    console.log(`API Response for updateTransaction ${id}:`, response.data); // Логирование
    return response.data;
  } catch (error) {
    console.error(`Ошибка при обновлении транзакции с ID ${id}:`, error);
    throw error;
  }
};

// Функция для удаления транзакции
export const deleteTransaction = async (id: number): Promise<void> => {
  try {
    await axiosInstance.delete(`/api/transaction/transactions/${id}/`);
    console.info(`Транзакция с ID ${id} успешно удалена`);
  } catch (error) {
    console.error(`Ошибка при удалении транзакции с ID ${id}:`, error);
    throw error;
  }
};

// Функция для получения транзакции по ID
export const getTransactionById = async (id: number): Promise<Transaction> => {
  try {
    const response = await axiosInstance.get<Transaction>(
      `/api/transaction/transactions/${id}/`
    );
    console.log(`API Response for getTransactionById ${id}:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`Ошибка при получении транзакции с ID ${id}:`, error);
    throw error;
  }
};
