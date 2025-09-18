//prettier-ignore
import React, {createContext, useCallback, useContext, useEffect, useMemo, useState,} from "react";

const AuthContext = createContext(null);

const FULL_KEY = "hasFullProfile";

export function AuthProvider({ children }) {
  const [id, setId] = useState(() => localStorage.getItem("id") || null);
  const [token, setToken] = useState(
    () => localStorage.getItem("token") || ""
  );
  const [role, setRole] = useState(() => localStorage.getItem("role") || "");
  const [hasFullProfile, setHasFullProfile] = useState(
    () => localStorage.getItem(FULL_KEY) === "true"
  );

  const login = useCallback(
    ({ token: t, role: r, id:uid, hasFullProfile: full = false }) => {
      if (t) {localStorage.setItem("token", t);setToken(t);}
      if (r) {localStorage.setItem("role", r);setRole(r);}
      if(uid) {localStorage.setItem("id", uid); setId(uid)}
      localStorage.setItem(FULL_KEY, String(Boolean(full)));
      setHasFullProfile(Boolean(full));
    },
    []
  );

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem(FULL_KEY);
    setToken("");
    setRole("");
    setHasFullProfile(false);
  }, []);

  const markFullProfile = useCallback(() => {
    localStorage.setItem(FULL_KEY, "true");
    setHasFullProfile(true);
  }, []);

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === "token" && !e.newValue) {
        logout();
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [logout]);

  const value = useMemo(
    () => ({ token, role,id,  hasFullProfile, login, logout, markFullProfile }),
    [token, role,id, hasFullProfile,  login, logout, markFullProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
