// src/api/categoryAPI.ts

import axiosInstance from './axiosInstance';

export interface Transaction {
  id: number;
  date: string;
  description: string;
  category_id: number;
  amount: number;
  type: 'income' | 'expense';
  payment_method: string;
  employee: string;
}

// Интерфейс для представления категории согласно Swagger-документации
export interface Category {
  id: number;
  name: string;
  description?: string;
  type: 'income' | 'expense'; // Добавляем поле "type" с фиксированными значениями
  is_active: boolean; // Добавляем поле "is_active"
}

export interface CreateCategoryData {
  name: string;
  description?: string;
  type: 'income' | 'expense'; // Поле "type" обязательно при создании
  is_active: boolean; // Поле "is_active" также обязательно
}

export interface UpdateCategoryData {
  name?: string;
  description?: string;
  type?: 'income' | 'expense'; // Поле "type" может быть изменено, но не обязательно
  is_active?: boolean; // Поле "is_active" также можно изменить, но не обязательно
}

/**
 * Получить список категорий
 */
export const getCategories = async (): Promise<Category[]> => {
  try {
    const response = await axiosInstance.get<{ results: Category[] }>(
      '/api/transaction/categories/'
    );
    return response.data.results; // Возвращаем массив категорий из поля "results"
  } catch (error) {
    console.error('Ошибка при получении списка категорий:', error);
    throw error;
  }
};

/**
 * Получить детали категории по ID
 * @param id - ID категории
 */
export const getCategoryById = async (id: number): Promise<Category> => {
  try {
    const response = await axiosInstance.get<Category>(
      `/api/transaction/categories/${id}/`
    );
    return response.data;
  } catch (error) {
    console.error(`Ошибка при получении категории с ID ${id}:`, error);
    throw error;
  }
};

/**
 * Создать новую категорию
 * @param data - Данные для создания категории
 */
export const createCategory = async (
  data: CreateCategoryData
): Promise<Category> => {
  try {
    const response = await axiosInstance.post<Category>(
      '/api/transaction/categories/',
      data
    );
    return response.data;
  } catch (error) {
    console.error('Ошибка при создании категории:', error);
    throw error;
  }
};

/**
 * Обновить категорию по ID
 * @param id - ID категории
 * @param data - Данные для обновления категории
 */
export const updateCategory = async (
  id: number,
  data: UpdateCategoryData
): Promise<Category> => {
  try {
    const response = await axiosInstance.put<Category>(
      `/api/transaction/categories/${id}/`,
      data
    );
    return response.data;
  } catch (error) {
    console.error(`Ошибка при обновлении категории с ID ${id}:`, error);
    throw error;
  }
};

/**
 * Удалить категорию по ID
 * @param id - ID категории
 */
export const deleteCategory = async (id: number): Promise<void> => {
  try {
    await axiosInstance.delete(`/api/transaction/categories/${id}/`);
    console.info(`Категория с ID ${id} успешно удалена`);
  } catch (error) {
    console.error(`Ошибка при удалении категории с ID ${id}:`, error);
    throw error;
  }
};
