import React, { createContext, useContext, useState, useEffect } from "react";
import type { User, UserRole, Permission } from "../types";

const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  admin: [
    "ticket:read",
    "ticket:create",
    "ticket:update",
    "ticket:change-status",
    "ticket:delete",
    "subscription:create",
    "subscription:delete",
    "notification:read",
    "user:read",
    "user:assign-role",
  ],
  operador: [
    "ticket:read",
    "ticket:create",
    "ticket:update",
    "ticket:change-status",
    "subscription:create",
    "subscription:delete",
    "notification:read",
  ],
  usuario: [
    "ticket:read",
    "subscription:create",
    "subscription:delete",
    "notification:read",
  ],
};

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  can: (permission: Permission) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("token"),
  );

  useEffect(() => {
    if (token && user) {
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  }, [token, user]);

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  const can = (permission: Permission): boolean => {
    if (!user) return false;
    const permissions = ROLE_PERMISSIONS[user.role] || [];
    return permissions.includes(permission);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, can }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
};
