import { useEffect, useState, type ReactNode } from "react";
import { AuthContext } from "./AuthContext";
import { decodeJWT, isTokenExpired } from "../api/auth.utils";
import { authService } from "../api/auth";
import { hasPermission as checkPermission } from "../api/auth.roles";
import type { User } from "../api/auth.types";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = Boolean(user);

  const updateUser = (newUser: string | undefined) => {
    if (user) {
      setUser({
        ...user,
        name: newUser,
      });
    }
  }

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
      rol: decoded.rol,
      name: decoded.name ? decoded.name : undefined,
    });
  };

  const hasPermission = (permission: string) =>
    user ? checkPermission(user.rol, permission) : false;

  useEffect(() => {
    const token = localStorage.getItem("access");
    if (token && !isTokenExpired(token)) {
      const decoded = decodeJWT(token);
      setUser({
        id: decoded.user_id,
        rol: decoded.rol,
        name: decoded.name ? decoded.name : undefined,
      });
    } else {
      logout();
    }
    setIsLoading(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, isLoading, login, logout, hasPermission, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}
