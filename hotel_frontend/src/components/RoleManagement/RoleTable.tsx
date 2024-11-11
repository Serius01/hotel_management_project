// src/components/RoleManagement/RoleTable.tsx

import React from 'react';
import '../../styles/RoleTable.css';
import { Role } from '../../types/Role';

interface RoleTableProps {
  roles: Role[];
  onEditRole: (role: Role) => void;
}

const RoleTable: React.FC<RoleTableProps> = ({ roles, onEditRole }) => {
  const handleEdit = (role: Role) => {
    onEditRole(role);
  };

  const handleDelete = (roleId: number) => {
    // Логика удаления роли
  };

  return (
    <table className="role-table">
      <thead>
        <tr>
          <th>Название роли</th>
          <th>Количество пользователей</th>
          <th>Действия</th>
        </tr>
      </thead>
      <tbody>
        {roles.map((role: Role) => (
          <tr key={role.id}>
            <td>{role.name}</td>
            <td>{/* Отображение количества пользователей */}</td>
            <td>
              <button onClick={() => handleEdit(role)}>Редактировать</button>
              <button onClick={() => handleDelete(role.id!)}>Удалить</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default RoleTable;
