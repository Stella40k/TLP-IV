import { Router } from "express";
import { NotificationController } from "../controllers/NotificationController";
import { authenticate } from "../middlewares/authenticate";
import { authorize } from "../middlewares/authorize";

export function createNotificationRoutes(
  notificationController: NotificationController,
): Router {
  const router = Router();

  router.use(authenticate);

  // RF5 - Ver y marcar notificaciones
  router.get("/", authorize("notification:read"), notificationController.getMyNotifications);
  router.patch("/:id/read", authorize("notification:read"), notificationController.markAsRead);
  router.patch("/read-all", authorize("notification:read"), notificationController.markAllAsRead);

  return router;
}
