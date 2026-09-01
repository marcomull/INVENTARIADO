import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Dashboard from './Dashboard';

export default function Index() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <Dashboard />;
}
