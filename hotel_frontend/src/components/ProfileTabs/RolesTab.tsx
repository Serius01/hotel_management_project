// src/components/ProfileTabs/RolesTab.tsx

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchRoles } from '../../api/roleAPI';
import RoleTable from '../RoleManagement/RoleTable';
import RoleForm from '../RoleManagement/RoleForm';
import '../../styles/RolesTab.css';
import { Role } from '../../types/Role';

const RolesTab: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  const {
    data: roles = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['roles'],
    queryFn: fetchRoles,
    staleTime: 5000, // Данные считаются свежими в течение 5 секунд
  });

  const handleAddRole = () => {
    setSelectedRole(null);
    setIsFormOpen(true);
  };

  const handleEditRole = (role: Role) => {
    setSelectedRole(role);
    setIsFormOpen(true);
  };

  const handleFormSubmitSuccess = () => {
    setIsFormOpen(false);
    refetch();
  };

  if (isLoading) return <div>Загрузка ролей...</div>;
  if (error) return <div>Ошибка при загрузке ролей</div>;

  return (
    <div>
      <h2>Список ролей</h2>
      <button onClick={handleAddRole}>Добавить роль</button>
      <RoleTable roles={roles} onEditRole={handleEditRole} />
      {isFormOpen && (
        <RoleForm
          initialValues={
            selectedRole || { id: undefined, name: '', permissions: [] }
          }
          onSubmitSuccess={handleFormSubmitSuccess}
        />
      )}
    </div>
  );
};

export default RolesTab;
