export interface User {
  id?: number;
  name: string;
  email: string;
  username: string;
  password: string;
  role: string;
  role: string;
  status: string;
  permissions: string[];
}

// Интерфейс для создания пользователя (без id)
export interface NewUser {
  name: string;
  email: string;
  username: string;
  password: string;
  role: string;
  status: string;
}

// Интерфейс для существующего пользователя (с id)
export interface ExistingUser extends NewUser {
  id: number;
}
