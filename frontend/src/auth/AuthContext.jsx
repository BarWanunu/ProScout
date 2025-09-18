//prettier-ignore
import React, {createContext, useCallback, useContext, useEffect, useMemo, useState,} from "react";

const AuthContext = createContext(null);

const TOKEN_KEY = "token";
const ROLE_KEY = "role";
const FULL_KEY = "hasFullProfile";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(
    () => localStorage.getItem(TOKEN_KEY) || ""
  );
  const [role, setRole] = useState(() => localStorage.getItem(ROLE_KEY) || "");
  const [hasFullProfile, setHasFullProfile] = useState(
    () => localStorage.getItem(FULL_KEY) === "true"
  );

  const login = useCallback(
    ({ token: t, role: r, hasFullProfile: full = false }) => {
      if (t) {
        localStorage.setItem(TOKEN_KEY, t);
        setToken(t);
      }
      if (r) {
        localStorage.setItem(ROLE_KEY, r);
        setRole(r);
      }
      localStorage.setItem(FULL_KEY, String(Boolean(full)));
      setHasFullProfile(Boolean(full));
    },
    []
  );

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(ROLE_KEY);
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
      if (e.key === TOKEN_KEY && !e.newValue) {
        logout();
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [logout]);

  const value = useMemo(
    () => ({ token, role, hasFullProfile, login, logout, markFullProfile }),
    [token, role, hasFullProfile, login, logout, markFullProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
