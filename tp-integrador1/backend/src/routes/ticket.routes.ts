import { Router } from "express";
import { TicketController } from "../controllers/ticket.controller";
import { authenticate } from "../middlewares/authenticate";
import { authorize } from "../middlewares/authorize";

export function createTicketRoutes(ticketController: TicketController): Router {
  const router = Router();

  // Todos los endpoints de tickets requieren autenticación
  router.use(authenticate);

  // RF3 - Permisos según rol
  router.get("/", authorize("ticket:read"), ticketController.getAll);
  router.get("/:id", authorize("ticket:read"), ticketController.getById);
  router.post("/", authorize("ticket:create"), ticketController.create);
  router.put("/:id", authorize("ticket:update"), ticketController.update);
  router.patch("/:id/status", authorize("ticket:change-status"), ticketController.changeStatus);
  router.delete("/:id", authorize("ticket:delete"), ticketController.delete);

  return router;
}
