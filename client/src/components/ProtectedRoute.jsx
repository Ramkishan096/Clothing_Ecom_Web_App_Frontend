import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { selectIsAuthenticated, selectCustomer } from '../redux/slices/authSlice';

const ProtectedRoute = ({ children, requireRole = 'buyer', redirectTo = '/' }) => {
  const location = useLocation();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const customer = useSelector(selectCustomer);
  console.log('ProtectedRoute - isAuthenticated:', isAuthenticated, 'customer:', customer);

  // Check if user is authenticated
  if (!isAuthenticated || !customer) {
    // Redirect to login, but save the location they were trying to access
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Check if user has required role (only 'buyer' allowed now)
  if (customer.role !== requireRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;