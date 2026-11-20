import { ISubscriptionRepository } from "../repositories/interfaces/ISubscriptionRepository";
import { ITicketRepository } from "../repositories/interfaces/ITicketRepository";
import { Subscription } from "../models";

export class SubscriptionService {
  constructor(
    private readonly subscriptionRepo: ISubscriptionRepository,
    private readonly ticketRepo: ITicketRepository,
  ) {}

  async subscribe(userId: number, ticketId: number): Promise<Subscription> {
    const ticket = await this.ticketRepo.findById(ticketId);
    if (!ticket) {
      throw new Error("El ticket especificado no existe");
    }

    return await this.subscriptionRepo.subscribe(userId, ticketId);
  }

  async unsubscribe(userId: number, ticketId: number): Promise<boolean> {
    return await this.subscriptionRepo.unsubscribe(userId, ticketId);
  }

  async isSubscribed(userId: number, ticketId: number): Promise<boolean> {
    return await this.subscriptionRepo.isSubscribed(userId, ticketId);
  }

  async getUserSubscriptions(userId: number): Promise<Subscription[]> {
    return await this.subscriptionRepo.findByUserId(userId);
  }

  async getSubscribersForTicket(ticketId: number): Promise<number[]> {
    return await this.subscriptionRepo.findSubscribersByTicketId(ticketId);
  }
}
