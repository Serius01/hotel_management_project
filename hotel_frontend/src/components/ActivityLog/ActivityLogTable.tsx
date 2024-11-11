// src/components/ActivityLog/ActivityLogTable.tsx

import React, { useState } from 'react';
import '../../styles/ActivityLogTable.css';
import { ActivityLog } from '../../types/ActivityLog';

interface ActivityLogTableProps {
  logs: ActivityLog[];
}

const ActivityLogTable: React.FC<ActivityLogTableProps> = ({ logs }) => {
  const [selectedLog, setSelectedLog] = useState<ActivityLog | null>(null);

  const handleRowClick = (log: ActivityLog) => {
    setSelectedLog(log);
  };

  const handleCloseDetail = () => {
    setSelectedLog(null);
  };

  return (
    <div className="activity-log-table-container">
      <table className="activity-log-table">
        <thead>
          <tr>
            <th>Пользователь</th>
            <th>Действие</th>
            <th>Дата</th>
            <th>Описание</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log.id} onClick={() => handleRowClick(log)}>
              <td>{log.user}</td>
              <td>{log.actionType}</td>
              <td>{new Date(log.date).toLocaleString()}</td>
              <td>{log.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedLog && (
        <div className="activity-log-detail">
          <button onClick={handleCloseDetail}>Закрыть</button>
          <h3>Детали действия</h3>
          <p>
            <strong>Пользователь:</strong> {selectedLog.user}
          </p>
          <p>
            <strong>Действие:</strong> {selectedLog.actionType}
          </p>
          <p>
            <strong>Дата:</strong> {new Date(selectedLog.date).toLocaleString()}
          </p>
          <p>
            <strong>Описание:</strong> {selectedLog.description}
          </p>
          <p>
            <strong>IP-адрес:</strong> {selectedLog.ipAddress}
          </p>
          <p>
            <strong>Устройство:</strong> {selectedLog.deviceInfo}
          </p>
        </div>
      )}
    </div>
  );
};

export default ActivityLogTable;
