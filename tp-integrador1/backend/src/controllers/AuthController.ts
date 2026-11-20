import { Request, Response } from "express";
import { AuthService } from "../services/AuthService";

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  register = async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        res.status(400).json({ error: "Nombre, email y contraseña son obligatorios" });
        return;
      }

      if (password.length < 6) {
        res.status(400).json({ error: "La contraseña debe tener al menos 6 caracteres" });
        return;
      }

      const result = await this.authService.register({ name, email, password });
      res.status(201).json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Error al registrar usuario" });
    }
  };

  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({ error: "Email y contraseña son obligatorios" });
        return;
      }

      const result = await this.authService.login({ email, password });
      res.status(200).json(result);
    } catch (error: any) {
      res.status(401).json({ error: error.message || "Error al iniciar sesión" });
    }
  };
}
