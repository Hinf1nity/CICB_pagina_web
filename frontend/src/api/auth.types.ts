import type { Role } from "./auth.roles";

export interface User {
  id: number;
  rol: Role;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  login: (username: string, password: string) => Promise<void>;
  logout: () => void;

  hasPermission: (permission: string) => boolean;
}
