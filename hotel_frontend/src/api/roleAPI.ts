// src/api/roleAPI.ts

import axiosInstance from './axiosInstance';
import { Permission, Role, RoleHistory } from '../types/Role';

export const fetchRoles = async (): Promise<Role[]> => {
  const response = await axiosInstance.get('/roles/roles/');
  return response.data;
};

export const createRole = async (roleData: Role): Promise<Role> => {
  const response = await axiosInstance.post('/roles/roles/', roleData);
  return response.data;
};

export const updateRole = async (
  roleId: number,
  roleData: Role
): Promise<Role> => {
  const response = await axiosInstance.put(`/roles/${roleId}/`, roleData);
  return response.data;
};

export const deleteRole = async (roleId: number): Promise<void> => {
  await axiosInstance.delete(`/roles/${roleId}/`);
};

export const fetchPermissions = async (): Promise<Permission[]> => {
  const response = await axiosInstance.get('/roles/permissions/');
  return response.data;
};

export const fetchRoleHistory = async (
  roleId: number
): Promise<RoleHistory[]> => {
  const response = await axiosInstance.get(`/roles/${roleId}/history/`);
  return response.data;
};
