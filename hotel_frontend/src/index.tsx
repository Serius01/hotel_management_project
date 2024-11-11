// src/main.tsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Modal from 'react-modal';

const queryClient = new QueryClient();
const container = document.getElementById('root');

if (container) {
  // Устанавливаем элемент приложения для модальных окон
  Modal.setAppElement('#root');

  const root = ReactDOM.createRoot(container);
  root.render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </React.StrictMode>
  );
} else {
  console.error("Элемент с id 'root' не найден в документе.");
}
