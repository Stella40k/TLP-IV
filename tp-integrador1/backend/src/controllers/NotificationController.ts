import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/authenticate";
import { INotificationRepository } from "../repositories/interfaces/INotificationRepository";

export class NotificationController {
  constructor(private readonly notificationRepo: INotificationRepository) {}

  getMyNotifications = async (
    req: AuthenticatedRequest,
    res: Response,
  ): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ error: "No autenticado" });
        return;
      }

      const notifications = await this.notificationRepo.findByUserId(userId);
      const unreadCount = await this.notificationRepo.countUnreadByUserId(userId);

      res.status(200).json({
        notifications,
        unreadCount,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Error al obtener notificaciones" });
    }
  };

  markAsRead = async (
    req: AuthenticatedRequest,
    res: Response,
  ): Promise<void> => {
    try {
      const userId = req.user?.id;
      const notificationId = Number(req.params.id);

      if (!userId) {
        res.status(401).json({ error: "No autenticado" });
        return;
      }

      const updated = await this.notificationRepo.markAsRead(notificationId, userId);
      if (!updated) {
        res.status(404).json({ error: "Notificación no encontrada" });
        return;
      }

      res.status(200).json({ message: "Notificación marcada como leída" });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Error al actualizar notificación" });
    }
  };

  markAllAsRead = async (
    req: AuthenticatedRequest,
    res: Response,
  ): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ error: "No autenticado" });
        return;
      }

      await this.notificationRepo.markAllAsRead(userId);
      res.status(200).json({ message: "Todas las notificaciones marcadas como leídas" });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Error al actualizar notificaciones" });
    }
  };
}
