import { type ReactNode } from "react";
import { Navigate } from "react-router-dom";

interface Props {
  children: ReactNode;
}

export default function PrivateRoute({ children }: Props) {
  const access = localStorage.getItem("access");
  return access ? <>{children}</> : <Navigate to="/login" replace />;
}
