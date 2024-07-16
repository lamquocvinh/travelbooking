import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const AuthGuard = ({ children }) => {
  const role = useSelector(state => state.auth.role);
  const location = useLocation();
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  if (token && (location.pathname === "/login" || location.pathname === "/register")) {
    if (role && role == 'ROLE_ADMIN') {
      return <Navigate to="/admin/" replace />;
    } else if (role && role == 'ROLE_PARTNER') {
      return <Navigate to="/partner/" replace />;
    } else {
      return <Navigate to="/" />;
    }
  };
  if (location.pathname === "/admin") {
    if (!role || role !== 'ROLE_ADMIN') {
      return <Navigate to="/404" replace />;
    }
  }
  if (location.pathname === "/partner") {
    if (!role || role !== 'ROLE_PARTNER') {
      return <Navigate to="/404" replace />;
    }
  }

  return children ? children : <Outlet />;
};


export default AuthGuard;
