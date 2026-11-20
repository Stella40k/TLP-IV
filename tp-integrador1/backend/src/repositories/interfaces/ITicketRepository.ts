import { Ticket } from "../../models/ticket.model";
import { TicketCategory, TicketPriority, TicketStatus } from "../../types";

export interface CreateTicketData {
  title: string;
  description: string;
  category: TicketCategory;
  priority: TicketPriority;
  creatorId: number;
  assignedToId?: number | null;
  status?: TicketStatus;
}

export interface UpdateTicketData {
  title?: string;
  description?: string;
  category?: TicketCategory;
  priority?: TicketPriority;
  assignedToId?: number | null;
}

export interface ITicketRepository {
  create(data: CreateTicketData): Promise<Ticket>;
  findAll(): Promise<Ticket[]>;
  findById(id: number): Promise<Ticket | null>;
  update(id: number, data: UpdateTicketData): Promise<Ticket | null>;
  updateStatus(id: number, status: TicketStatus): Promise<Ticket | null>;
  delete(id: number): Promise<boolean>;
}
