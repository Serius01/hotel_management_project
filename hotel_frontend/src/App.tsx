import React, { Suspense, lazy } from 'react';
import * as Sentry from '@sentry/react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import AuthProvider from './context/AuthProvider';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Calendar from './components/Calendar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './styles/App.css'; // Импорт глобальных стилей

// Инициализация клиента для react-query
const queryClient = new QueryClient();

// Ленивые (lazy) импорты компонентов страниц для оптимизации загрузки
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const BookingsList = lazy(() => import('./pages/Bookings/BookingsList'));
const BookingDetail = lazy(() => import('./pages/Bookings/BookingDetail'));
const BookingForm = lazy(() => import('./pages/Bookings/BookingForm'));
const EditBooking = lazy(() => import('./pages/Bookings/EditBooking'));
const TransactionsList = lazy(
  () => import('./pages/Transactions/TransactionsList')
);
const CategoriesList = lazy(() => import('./pages/Categories/CategoriesList'));
const CategoryDetail = lazy(() => import('./pages/Categories/CategoryDetail'));
const CategoryForm = lazy(() => import('./pages/Categories/CategoryForm'));
const Profile = lazy(() => import('./pages/Profile/Profile'));

/**
 * Основное содержимое приложения.
 * Обрабатывает навигацию и рендеринг страниц.
 */
const AppContent: React.FC = () => {
  const location = useLocation();

  // Проверяем, находится ли пользователь на страницах авторизации, чтобы скрыть Navbar
  const isAuthPage =
    location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className="app-container">
      {/* Navbar отображается только если пользователь не на странице логина/регистрации */}
      {!isAuthPage && <Navbar />}
      <div className={!isAuthPage ? 'main-content' : ''}>
        {/* Suspense используется для показа загрузки при ленивом рендеринге компонентов */}
        <Suspense fallback={<div>Загрузка...</div>}>
          <Routes>
            {/* Публичные маршруты */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Защищённые маршруты, требующие авторизации */}
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <BookingsList />
                </PrivateRoute>
              }
            />
            <Route
              path="/calendar"
              element={
                <PrivateRoute>
                  <Calendar />
                </PrivateRoute>
              }
            />
            <Route
              path="/bookings"
              element={
                <PrivateRoute>
                  <BookingsList />
                </PrivateRoute>
              }
            />
            <Route
              path="/bookings/new"
              element={
                <PrivateRoute>
                  <BookingForm
                    bookingId={0}
                    onClose={() => {}}
                    onBookingUpdated={() => {}}
                  />
                </PrivateRoute>
              }
            />
            <Route
              path="/bookings/:id/edit"
              element={
                <PrivateRoute>
                  <EditBooking />
                </PrivateRoute>
              }
            />
            <Route
              path="/transactions"
              element={
                <PrivateRoute>
                  <TransactionsList />
                </PrivateRoute>
              }
            />
            <Route path="/categories" element={<CategoriesList />} />
            <Route path="/categories/new" element={<CategoryForm />} />
            <Route path="/categories/:id" element={<CategoryDetail />} />
            <Route path="/categories/:id/edit" element={<CategoryForm />} />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />
          </Routes>
        </Suspense>
        {/* ToastContainer для показа уведомлений */}
        <ToastContainer />
      </div>
    </div>
  );
};

/**
 * Главный компонент приложения. Оборачивает приложение в контексты для авторизации, обработки ошибок и управления кэшированием запросов.
 */
const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <AuthProvider>
          <Router>
            <AppContent />
          </Router>
        </AuthProvider>
      </ErrorBoundary>
    </QueryClientProvider>
  );
};

// Инициализация Sentry для отслеживания ошибок и производительности
Sentry.init({
  dsn: 'https://6db0e65ef330876a739adf6c6cdc0aab@o4508263632928768.ingest.de.sentry.io/4508263671267408',
  integrations: [Sentry.browserTracingIntegration()],
  tracesSampleRate: 1.0, // Настройте значение по необходимости
});

export default App;
