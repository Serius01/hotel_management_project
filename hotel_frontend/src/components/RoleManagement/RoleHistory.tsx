// src/components/RoleManagement/RoleHistory.tsx

import React, { useEffect, useState } from 'react';
import { fetchRoleHistory } from '../../api/roleAPI';
import { RoleHistory } from '../../types/Role';

interface RoleHistoryProps {
  roleId: number;
}

const RoleHistoryComponent: React.FC<RoleHistoryProps> = ({ roleId }) => {
  const [history, setHistory] = useState<RoleHistory[]>([]);

  useEffect(() => {
    const loadHistory = async () => {
      const data = await fetchRoleHistory(roleId);
      setHistory(data);
    };
    loadHistory();
  }, [roleId]);

  return (
    <div className="role-history">
      <h3>История изменений</h3>
      <ul>
        {history.map((entry) => (
          <li key={entry.id}>
            <strong>{entry.changeDate}</strong> - {entry.changedBy}:{' '}
            {entry.changes}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RoleHistoryComponent;
