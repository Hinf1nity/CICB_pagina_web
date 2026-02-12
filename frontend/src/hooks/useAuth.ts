import {
  createContext,
  useContext,
} from "react";

import type { AuthContextType } from "../api/auth.types";
// Hook limpio

const AuthContext = createContext<AuthContextType | null>(null);
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
};
