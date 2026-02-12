import { createContext } from "react";
import type { AuthContextType } from "../api/auth.types";

export const AuthContext = createContext<AuthContextType | null>(null);
