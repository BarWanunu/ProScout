import { useNavigate } from "react-router-dom";
import { useCallback } from "react";

export default function useRoleNavigation() {
  const navigate = useNavigate();
  return useCallback(role => navigate(`/login/${role}`), [navigate]);
}
