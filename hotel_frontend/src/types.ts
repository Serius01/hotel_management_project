export interface Booking {
  id: number;
  date: string;
  guest: string;
  roomNumber: number;
  status: string;
  // Добавьте другие поля по необходимости
}

export interface BookingCreate {
  date: string;
  guest: string;
  roomNumber: number;
  status: string;
  // Добавьте другие поля по необходимости
}

export interface BookingUpdate {
  date?: string;
  guest?: string;
  roomNumber?: number;
  status?: string;
  // Добавьте другие поля по необходимости
}

export interface User {
  id?: number;
  name: string;
  email: string;
  role: string;
  status: string;
}
