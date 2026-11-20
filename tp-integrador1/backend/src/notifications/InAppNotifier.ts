import { INotifier, NotificationPayload } from "./INotifier";
import { INotificationRepository } from "../repositories/interfaces/INotificationRepository";

export class InAppNotifier implements INotifier {
  constructor(private readonly notificationRepo: INotificationRepository) {}

  async send(notification: NotificationPayload): Promise<void> {
    await this.notificationRepo.create({
      userId: notification.userId,
      ticketId: notification.ticketId,
      message: notification.message,
    });
  }
}
