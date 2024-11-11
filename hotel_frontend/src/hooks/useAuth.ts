// src/hooks/useAuth.ts

import { useContext } from 'react';
import AuthContext, { AuthContextType } from '../context/AuthContext';

const useAuth = () => {
  const context = useContext<AuthContextType>(AuthContext);
  if (!context) {
    throw new Error('useAuth должен использоваться внутри AuthProvider');
  }
  return context;
};

export default useAuth;
