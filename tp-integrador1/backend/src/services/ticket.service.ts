import { Ticket } from "../models";
import { ITicketRepository } from "../repositories/interfaces/ITicketRepository";
import { TicketCategory, TicketPriority, TicketStatus } from "../types";
import { ISubject, TicketStatusChangedEvent } from "../observer/ISubject";

export interface CreateTicketDTO {
  title: string;
  description: string;
  category: TicketCategory;
  priority?: TicketPriority;
  creatorId: number;
  assignedToId?: number | null;
}

export interface UpdateTicketDTO {
  title?: string;
  description?: string;
  category?: TicketCategory;
  priority?: TicketPriority;
  assignedToId?: number | null;
}

export class TicketService {
  constructor(
    private readonly ticketRepository: ITicketRepository,
    private readonly eventPublisher?: ISubject<TicketStatusChangedEvent>,
  ) {}

  public async createTicket(dto: CreateTicketDTO): Promise<Ticket> {
    return await this.ticketRepository.create({
      title: dto.title,
      description: dto.description,
      category: dto.category,
      priority: dto.priority || "MEDIUM",
      creatorId: dto.creatorId,
      assignedToId: dto.assignedToId || null,
      status: "ABIERTO",
    });
  }

  public async getAllTickets(): Promise<Ticket[]> {
    return await this.ticketRepository.findAll();
  }

  public async getTicketById(id: number): Promise<Ticket | null> {
    return await this.ticketRepository.findById(id);
  }

  public async updateTicket(id: number, data: UpdateTicketDTO): Promise<Ticket | null> {
    return await this.ticketRepository.update(id, data);
  }

  /**
   * Cambia el estado del ticket y dispara el evento en el Observer (EventPublisher)
   */
  public async changeStatus(
    ticketId: number,
    newStatus: TicketStatus,
    changedByUserId?: number,
  ): Promise<Ticket | null> {
    const currentTicket = await this.ticketRepository.findById(ticketId);
    if (!currentTicket) return null;

    const previousStatus = currentTicket.status;
    if (previousStatus === newStatus) {
      return currentTicket;
    }

    const updated = await this.ticketRepository.updateStatus(ticketId, newStatus);
    if (!updated) return null;

    // Disparar evento a todos los observadores registrados
    if (this.eventPublisher) {
      await this.eventPublisher.notify({
        ticketId: updated.id,
        ticketTitle: updated.title,
        previousStatus,
        newStatus,
        changedByUserId,
        timestamp: new Date(),
      });
    }

    return updated;
  }

  public async deleteTicket(id: number): Promise<boolean> {
    return await this.ticketRepository.delete(id);
  }
}
