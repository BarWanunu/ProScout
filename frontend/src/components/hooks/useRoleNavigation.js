// This file contains a custom hook that provides navigation functionality based on user roles.

import { useNavigate } from "react-router-dom";
import { useCallback } from "react";

export default function useRoleNavigation() {
  const navigate = useNavigate();
  // This hook returns a function that takes a role and navigates to the login page for that role.
  return useCallback(role => navigate(`/login/${role}`), [navigate]);
}
