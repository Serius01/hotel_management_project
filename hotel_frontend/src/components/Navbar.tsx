import React from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import '../styles/Navbar.css'; // Импорт CSS для стилизации навигации
import { FaSignOutAlt } from 'react-icons/fa'; // Импорт иконки выхода

const Navbar: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="navbar">
      <div className="navbar-links">
        <h2 className="navbar-title">Меню</h2>
        <Link to="/bookings" className="navbar-link">
          Бронирования
        </Link>
        <Link to="/transactions" className="navbar-link">
          Транзакции
        </Link>
        <Link to="/categories" className="navbar-link">
          Категории
        </Link>
        <Link to="/calendar" className="navbar-link">
          Календарь
        </Link>
        {isAuthenticated && (
          <Link to="/profile" className="navbar-link">
            Профиль
          </Link>
        )}
      </div>
      {isAuthenticated && (
        <button onClick={handleLogout} className="logout-icon">
          <FaSignOutAlt />
        </button>
      )}
    </nav>
  );
};

export default Navbar;
