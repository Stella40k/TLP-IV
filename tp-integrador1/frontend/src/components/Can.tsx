import React from "react";
import { useAuth } from "../context/AuthContext";
import type { Permission } from "../types";

interface CanProps {
  permission: Permission;
  children: React.ReactNode;
}

export const Can: React.FC<CanProps> = ({ permission, children }) => {
  const { can } = useAuth();

  if (!can(permission)) {
    return null;
  }

  return <>{children}</>;
};
