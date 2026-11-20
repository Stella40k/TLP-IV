import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/authenticate";
import { SubscriptionService } from "../services/SubscriptionService";

export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  subscribe = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const ticketId = Number(req.params.id);
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({ error: "Usuario no autenticado" });
        return;
      }

      const subscription = await this.subscriptionService.subscribe(userId, ticketId);
      res.status(201).json({
        message: "Suscripción exitosa al ticket",
        subscription,
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Error al suscribirse al ticket" });
    }
  };

  unsubscribe = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const ticketId = Number(req.params.id);
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({ error: "Usuario no autenticado" });
        return;
      }

      const removed = await this.subscriptionService.unsubscribe(userId, ticketId);
      if (!removed) {
        res.status(404).json({ error: "No se encontró suscripción activa para este ticket" });
        return;
      }

      res.status(200).json({ message: "Desuscripción exitosa del ticket" });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Error al desuscribirse del ticket" });
    }
  };

  checkStatus = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const ticketId = Number(req.params.id);
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({ error: "Usuario no autenticado" });
        return;
      }

      const isSub = await this.subscriptionService.isSubscribed(userId, ticketId);
      res.status(200).json({ isSubscribed: isSub });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Error al verificar suscripción" });
    }
  };

  getMySubscriptions = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ error: "Usuario no autenticado" });
        return;
      }

      const subs = await this.subscriptionService.getUserSubscriptions(userId);
      res.status(200).json(subs);
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Error al listar suscripciones" });
    }
  };
}
