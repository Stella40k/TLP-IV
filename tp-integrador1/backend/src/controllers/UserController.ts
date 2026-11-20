import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/authenticate";
import { UserService } from "../services/UserService";
import { UserRole } from "../types";

export class UserController {
  constructor(private readonly userService: UserService) {}

  getAll = async (_req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const users = await this.userService.getAllUsers();
      res.status(200).json(users);
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Error al obtener usuarios" });
    }
  };

  assignRole = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const id = Number(req.params.id);
      const { role } = req.body;

      if (!role) {
        res.status(400).json({ error: "El campo 'role' es obligatorio" });
        return;
      }

      const updated = await this.userService.assignRole(id, role as UserRole);
      res.status(200).json({
        message: "Rol asignado con éxito",
        user: updated,
      });
    } catch (error: any) {
      const statusCode = error.message.includes("no encontrado") ? 404 : 400;
      res.status(statusCode).json({ error: error.message || "Error al asignar rol" });
    }
  };
}
