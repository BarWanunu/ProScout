// auth/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";

const AuthCtx = createContext(null);
export const useAuth = () => useContext(AuthCtx);

const DASHBOARD_BY_ROLE = {
  player: "/player-dashboard",
  scout:  "/scout-dashboard",
  team:   "/team-dashboard",
};

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const [hasFullProfile, setHasFullProfile] = useState(false);
  const [hydrating, setHydrating] = useState(true);

  useEffect(() => {
    const t = localStorage.getItem("token");
    const r = localStorage.getItem("role");
    const h = localStorage.getItem("hasFullProfile");
    if (t) setToken(t);
    if (r) setRole(r);
    if (h != null) setHasFullProfile(h === "true");
    setHydrating(false);
  }, []);

  const login = ({ token: t, role: r, hasFullProfile: h }) => {
    setToken(t); setRole(r); setHasFullProfile(!!h);
    localStorage.setItem("token", t);
    localStorage.setItem("role", r);
    localStorage.setItem("hasFullProfile", (!!h).toString());
  };

  const logout = () => {
    setToken(null); setRole(null); setHasFullProfile(false);
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("hasFullProfile");
  };

  const value = { token, role, hasFullProfile, hydrating, login, logout, DASHBOARD_BY_ROLE };
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}
