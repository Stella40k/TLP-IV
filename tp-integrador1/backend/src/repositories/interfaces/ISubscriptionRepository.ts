import { Subscription } from "../../models/subscription.model";

export interface ISubscriptionRepository {
  subscribe(userId: number, ticketId: number): Promise<Subscription>;
  unsubscribe(userId: number, ticketId: number): Promise<boolean>;
  isSubscribed(userId: number, ticketId: number): Promise<boolean>;
  findSubscribersByTicketId(ticketId: number): Promise<number[]>;
  findByUserId(userId: number): Promise<Subscription[]>;
}
