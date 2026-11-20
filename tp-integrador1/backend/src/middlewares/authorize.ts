import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "./authenticate";
import { Permission, hasPermission } from "../config/permissions";

export const authorize = (requiredPermission: Permission) => {
  return (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): void => {
    if (!req.user) {
      res.status(401).json({ error: "No autenticado" });
      return;
    }

    const userRole = req.user.role;

    if (!hasPermission(userRole, requiredPermission)) {
      res.status(403).json({
        error: `Acceso denegado: permiso requerido '${requiredPermission}' no disponible para el rol '${userRole}'`,
      });
      return;
    }

    next();
  };
};
