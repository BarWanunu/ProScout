// auth/RouteGuards.jsx
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

export function RequireAuth({ children }) {
  const { token, hydrating } = useAuth();
  const location = useLocation();
  if (hydrating) return null;
  if (!token) return <Navigate to="/" state={{ from: location }} replace />;
  return children;
}

export function RequireFullProfile({ children }) {
  const { hydrating } = useAuth();
  if (hydrating) return null;
  return children;
}

export function RoleGuard({ allow, children }) {
  const { role, hydrating, DASHBOARD_BY_ROLE } = useAuth();
  if (hydrating) return null;
  if (!allow.includes(role)) {
    const target = DASHBOARD_BY_ROLE[role] || "/";
    return <Navigate to={target} replace />;
  }
  return children;
}
