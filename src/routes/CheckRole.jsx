import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

function CheckRole({ children }) {
    const role = useSelector(state => state.auth.role);

    if (role == "ROLE_ADMIN") {
        return <Navigate to="/admin/" replace />;
    } else if (role == "ROLE_PARTNER") {
        return <Navigate to="/partner/" replace />;
    } else {
        return <Outlet />;
    }
}

export default CheckRole;