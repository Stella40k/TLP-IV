import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UserRole } from "../types";

export interface AuthenticatedUser {
  id: number;
  email: string;
  role: UserRole;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
}

export const authenticate = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Token de autenticación no proporcionado" });
    return;
  }

  const token = authHeader.split(" ")[1];
  const jwtSecret = process.env.JWT_SECRET || "tlp4-secret-key-change-in-prod";

  try {
    const payload = jwt.verify(token, jwtSecret) as AuthenticatedUser;
    req.user = payload;
    next();
  } catch (_error) {
    res.status(401).json({ error: "Token inválido o expirado" });
  }
};
