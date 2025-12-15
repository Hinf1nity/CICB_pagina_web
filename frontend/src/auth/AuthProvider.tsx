import { useEffect, useState, type ReactNode } from "react";
import { AuthContext } from "./AuthContext";
import { decodeJWT, isTokenExpired } from "../api/auth.utils";
import { authService } from "../api/auth";
import type { User } from "../api/auth.types";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = Boolean(user);

  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setUser(null);
  };

  const login = async (username: string, password: string) => {
    const { access, refresh } = await authService.login(username, password);

    localStorage.setItem("access", access);
    localStorage.setItem("refresh", refresh);

    const decoded = decodeJWT(access);
    setUser({
      id: decoded.user_id,
      username: decoded.username,
      role: decoded.role,
    });
  };

  useEffect(() => {
    const token = localStorage.getItem("access");
    if (token && !isTokenExpired(token)) {
      const decoded = decodeJWT(token);
      setUser({
        id: decoded.user_id,
        username: decoded.username,
        role: decoded.role,
      });
    } else {
      logout();
    }
    setIsLoading(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, isLoading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}
