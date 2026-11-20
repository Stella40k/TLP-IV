import { UserRole } from "../types";

export type Permission =
  | "ticket:read"
  | "ticket:create"
  | "ticket:update"
  | "ticket:change-status"
  | "ticket:delete"
  | "subscription:create"
  | "subscription:delete"
  | "notification:read"
  | "user:read"
  | "user:assign-role";

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
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

export function hasPermission(role: UserRole, permission: Permission): boolean {
  const permissions = ROLE_PERMISSIONS[role] || [];
  return permissions.includes(permission);
}
