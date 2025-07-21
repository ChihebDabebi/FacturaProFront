// components/GuestRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';

const GuestRoute = () => {
  const token = localStorage.getItem('token');
  return !token ? <Outlet /> : <Navigate to="/dashboard/sales" replace />;
};

export default GuestRoute;
