import { Ticket, User } from "../models";
import { TicketStatus } from "../types";
import {
  CreateTicketData,
  ITicketRepository,
  UpdateTicketData,
} from "./interfaces/ITicketRepository";

export class TicketRepository implements ITicketRepository {
  async create(data: CreateTicketData): Promise<Ticket> {
    return await Ticket.create({
      ...data,
      status: data.status || "ABIERTO",
    });
  }

  async findAll(): Promise<Ticket[]> {
    return await Ticket.findAll({
      include: [
        { model: User, as: "creator", attributes: ["id", "name", "email", "role"] },
        { model: User, as: "assignee", attributes: ["id", "name", "email", "role"] },
      ],
      order: [["createdAt", "DESC"]],
    });
  }

  async findById(id: number): Promise<Ticket | null> {
    return await Ticket.findByPk(id, {
      include: [
        { model: User, as: "creator", attributes: ["id", "name", "email", "role"] },
        { model: User, as: "assignee", attributes: ["id", "name", "email", "role"] },
      ],
    });
  }

  async update(id: number, data: UpdateTicketData): Promise<Ticket | null> {
    const ticket = await Ticket.findByPk(id);
    if (!ticket) return null;
    await ticket.update(data);
    return ticket;
  }

  async updateStatus(id: number, status: TicketStatus): Promise<Ticket | null> {
    const ticket = await Ticket.findByPk(id);
    if (!ticket) return null;
    ticket.status = status;
    await ticket.save();
    return ticket;
  }

  async delete(id: number): Promise<boolean> {
    const deletedCount = await Ticket.destroy({ where: { id } });
    return deletedCount > 0;
  }
}
