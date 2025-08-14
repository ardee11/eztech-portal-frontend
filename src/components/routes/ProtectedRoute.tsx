// components/routes/ProtectedRoute.tsx
import { useAuth } from "../../contexts/authContext";
import { Navigate, Outlet } from "react-router-dom";
import { hasAnyAccess, PageAccess } from "../../utils/permissions";

interface ProtectedRouteProps {
  page?: PageAccess;
}

export default function ProtectedRoute({ page }: ProtectedRouteProps) {
  const { userLoggedIn, userRole, loading } = useAuth();

  if (loading) return null;

  if (!userLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (page && !hasAnyAccess(userRole ?? [], page)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
