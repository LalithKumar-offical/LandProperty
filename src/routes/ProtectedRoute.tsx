
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import type { RootState } from "../slice/store";
import type { JSX } from "react";

interface Props {
  children: JSX.Element;
  allowedRoles: string[];
}

const ProtectedRoute = ({ children, allowedRoles }: Props) => {
  const user = useSelector((state: RootState) => state.auth.user);

  if (!user) return <Navigate to="/login" replace />;

  if (!allowedRoles.includes(user.Role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
