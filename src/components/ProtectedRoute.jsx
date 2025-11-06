import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, requireSubscription = false, requireAdmin = false }) {
  const { currentUser, hasSubscription, isAdmin } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/dashboard" />;
  }

  if (requireSubscription && !hasSubscription) {
    return <Navigate to="/subscription" />;
  }

  return children;
}
