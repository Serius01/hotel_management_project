// src/components/UserManagement/UserTable.tsx

import React from 'react';
import '../../styles/UserTable.css';
import { User } from '../../types/User';

interface UserTableProps {
  users: User[];
  onEditUser: (user: User) => void;
}

const UserTable: React.FC<UserTableProps> = ({ users, onEditUser }) => {
  const handleEdit = (user: User) => {
    onEditUser(user);
  };

  const handleDelete = (userId: number) => {
    // Логика удаления пользователя
  };

  return (
    <table className="user-table">
      <thead>
        <tr>
          <th>Имя</th>
          <th>Email</th>
          <th>Роль</th>
          <th>Статус</th>
          <th>Действия</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user: User) => (
          <tr key={user.id}>
            <td>{user.name}</td>
            <td>{user.email}</td>
            <td>{user.role}</td>
            <td>{user.status}</td>
            <td>
              <button onClick={() => handleEdit(user)}>Редактировать</button>
              <button onClick={() => handleDelete(user.id!)}>Удалить</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default UserTable;
