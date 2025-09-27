// auth/RouteGuards.jsx
import React, { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
import AccessDeniedMessage from "@/components/common/AccessDeniedMessage";

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
  
  // If user role is not in the allowed roles list
  if (!allow.includes(role)) {
    console.log(`Access denied: User role '${role}' not in allowed roles: ${allow.join(', ')}`);
    
    // Show access denied message with auto-redirect
    const target = DASHBOARD_BY_ROLE[role] || "/";
    
    return (
      <AccessDeniedWithRedirect
        allowedRoles={allow}
        currentRole={role}
        redirectTo={target}
      />
    );
  }
  
  return children;
}

// Component that shows message and redirects
function AccessDeniedWithRedirect({ allowedRoles, currentRole, redirectTo }) {
  const [shouldRedirect, setShouldRedirect] = useState(false);
  
  const handleClose = () => {
    setShouldRedirect(true);
  };
  
  // Auto redirect after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShouldRedirect(true);
    }, 10000);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (shouldRedirect) {
    return <Navigate to={redirectTo} replace />;
  }
  
  return (
    <AccessDeniedMessage
      show={true}
      allowedRoles={allowedRoles}
      currentRole={currentRole}
      onClose={handleClose}
      autoCloseTime={10}
    />
  );
}
