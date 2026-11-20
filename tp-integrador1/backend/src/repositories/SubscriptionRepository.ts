import { Subscription, Ticket } from "../models";
import { ISubscriptionRepository } from "./interfaces/ISubscriptionRepository";

export class SubscriptionRepository implements ISubscriptionRepository {
  async subscribe(userId: number, ticketId: number): Promise<Subscription> {
    const existing = await Subscription.findOne({
      where: { userId, ticketId },
    });
    if (existing) {
      return existing;
    }
    return await Subscription.create({ userId, ticketId });
  }

  async unsubscribe(userId: number, ticketId: number): Promise<boolean> {
    const deletedCount = await Subscription.destroy({
      where: { userId, ticketId },
    });
    return deletedCount > 0;
  }

  async isSubscribed(userId: number, ticketId: number): Promise<boolean> {
    const sub = await Subscription.findOne({
      where: { userId, ticketId },
    });
    return !!sub;
  }

  async findSubscribersByTicketId(ticketId: number): Promise<number[]> {
    const subs = await Subscription.findAll({
      where: { ticketId },
      attributes: ["userId"],
    });
    return subs.map((s: Subscription) => s.userId);
  }

  async findByUserId(userId: number): Promise<Subscription[]> {
    return await Subscription.findAll({
      where: { userId },
      include: [{ model: Ticket, as: "ticket" }],
      order: [["createdAt", "DESC"]],
    });
  }
}
