import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/authenticate";
import { TicketService } from "../services/ticket.service";
import { TicketStatus } from "../types";

export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  create = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { title, description, category, priority, assignedToId } = req.body;
      const creatorId = req.user?.id;

      if (!title || !description || !category) {
        res.status(400).json({ error: "Título, descripción y categoría son obligatorios" });
        return;
      }

      if (!creatorId) {
        res.status(401).json({ error: "Usuario creador no identificado" });
        return;
      }

      const ticket = await this.ticketService.createTicket({
        title,
        description,
        category,
        priority,
        creatorId,
        assignedToId,
      });

      res.status(201).json(ticket);
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Error al crear ticket" });
    }
  };

  getAll = async (_req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const tickets = await this.ticketService.getAllTickets();
      res.status(200).json(tickets);
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Error al obtener tickets" });
    }
  };

  getById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const id = Number(req.params.id);
      const ticket = await this.ticketService.getTicketById(id);

      if (!ticket) {
        res.status(404).json({ error: "Ticket no encontrado" });
        return;
      }

      res.status(200).json(ticket);
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Error al obtener ticket" });
    }
  };

  update = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const id = Number(req.params.id);
      const { title, description, category, priority, assignedToId } = req.body;

      const updated = await this.ticketService.updateTicket(id, {
        title,
        description,
        category,
        priority,
        assignedToId,
      });

      if (!updated) {
        res.status(404).json({ error: "Ticket no encontrado" });
        return;
      }

      res.status(200).json(updated);
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Error al actualizar ticket" });
    }
  };

  changeStatus = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const id = Number(req.params.id);
      const { status } = req.body;

      const validStatuses: TicketStatus[] = ["ABIERTO", "EN_PROGRESO", "RESUELTO", "CERRADO"];
      if (!status || !validStatuses.includes(status)) {
        res.status(400).json({
          error: `Estado inválido. Opciones válidas: ${validStatuses.join(", ")}`,
        });
        return;
      }

      const updated = await this.ticketService.changeStatus(id, status, req.user?.id);

      if (!updated) {
        res.status(404).json({ error: "Ticket no encontrado" });
        return;
      }

      res.status(200).json(updated);
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Error al cambiar estado del ticket" });
    }
  };

  delete = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const id = Number(req.params.id);
      const deleted = await this.ticketService.deleteTicket(id);

      if (!deleted) {
        res.status(404).json({ error: "Ticket no encontrado" });
        return;
      }

      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Error al eliminar ticket" });
    }
  };
}
