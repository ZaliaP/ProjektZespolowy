// src/components/layout/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <div>Ładowanie...</div>;
  if (!isAuthenticated) return <Navigate to="/logowanie" state={{ action: 'Logowanie' }} />;

  return children;
};

export default ProtectedRoute;