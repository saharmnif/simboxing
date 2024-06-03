// useAuth.js
import { useContext } from 'react';
import { AuthContext } from '../Components/AuthContext'; 

export const useAuth = () => {
  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);

  return { isAuthenticated, setIsAuthenticated };
};
