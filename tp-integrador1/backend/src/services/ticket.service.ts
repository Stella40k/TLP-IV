import { Ticket } from "../models";
import { ITicketRepository } from "../repositories/interfaces/ITicketRepository";
import { TicketCategory, TicketPriority, TicketStatus } from "../types";

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
  constructor(private readonly ticketRepository: ITicketRepository) {}

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

  public async changeStatus(
    ticketId: number,
    newStatus: TicketStatus,
    _changedByUserId?: number,
  ): Promise<Ticket | null> {
    const updated = await this.ticketRepository.updateStatus(ticketId, newStatus);
    // Nota: en RF5 se conectará aquí el EventPublisher (Observer)
    return updated;
  }

  public async deleteTicket(id: number): Promise<boolean> {
    return await this.ticketRepository.delete(id);
  }
}
