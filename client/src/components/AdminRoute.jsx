import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { selectIsAuthenticated, selectCustomer } from '../redux/slices/authSlice';

const AdminRoute = ({ children }) => {
  console.log("admin route hit ...")
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const customer = useSelector(selectCustomer);
  console.log("customer..",customer)
  
  // Check if authenticated
  if (!isAuthenticated || !customer) {
    return <Navigate to="/adminlogin" replace />;
  }

  // Check if user is admin (for future use)
  if (customer.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  // Check if user is admin (for future use)
  // if (!customer.isAdmin) {
  //   return <Navigate to="/" replace />;
  // }

  return children;
};

export default AdminRoute;