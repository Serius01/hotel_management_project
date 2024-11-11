// src/types/Role.ts

export interface Permission {
  id: number;
  name: string;
  description: string;
}

export interface Role {
  id?: number;
  name: string;
  permissions: Permission[];
}

export interface RoleHistory {
  id: number;
  roleId: number;
  changedBy: string;
  changeDate: string;
  changes: string; // Описание изменений
}
