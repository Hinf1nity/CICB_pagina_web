import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";

export default function PrivateRoute({ children, requiredRole }: { children: React.ReactNode, requiredRole?: string[] }) {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) return null; // o spinner

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (requiredRole && !requiredRole.includes(user!.rol)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
