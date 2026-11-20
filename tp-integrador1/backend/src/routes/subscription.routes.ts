import { Router } from "express";
import { SubscriptionController } from "../controllers/SubscriptionController";
import { authenticate } from "../middlewares/authenticate";
import { authorize } from "../middlewares/authorize";

export function createSubscriptionRoutes(
  subscriptionController: SubscriptionController,
): Router {
  const router = Router();

  router.use(authenticate);

  // Mis suscripciones
  router.get("/me", subscriptionController.getMySubscriptions);

  // Estado de suscripción para un ticket
  router.get("/tickets/:id/status", subscriptionController.checkStatus);

  // RF4 - Suscribirse y desuscribirse
  router.post(
    "/tickets/:id",
    authorize("subscription:create"),
    subscriptionController.subscribe,
  );
  router.delete(
    "/tickets/:id",
    authorize("subscription:delete"),
    subscriptionController.unsubscribe,
  );

  return router;
}
