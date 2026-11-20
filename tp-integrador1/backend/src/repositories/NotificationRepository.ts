import { Notification, Ticket } from "../models";
import {
  CreateNotificationData,
  INotificationRepository,
} from "./interfaces/INotificationRepository";

export class NotificationRepository implements INotificationRepository {
  async create(data: CreateNotificationData): Promise<Notification> {
    return await Notification.create({
      ...data,
      read: false,
    });
  }

  async createMany(
    notifications: CreateNotificationData[],
  ): Promise<Notification[]> {
    return await Notification.bulkCreate(
      notifications.map((n) => ({ ...n, read: false })),
    );
  }

  async findByUserId(userId: number): Promise<Notification[]> {
    return await Notification.findAll({
      where: { userId },
      include: [{ model: Ticket, as: "ticket", attributes: ["id", "title", "status"] }],
      order: [["createdAt", "DESC"]],
    });
  }

  async countUnreadByUserId(userId: number): Promise<number> {
    return await Notification.count({
      where: { userId, read: false },
    });
  }

  async markAsRead(notificationId: number, userId: number): Promise<boolean> {
    const [affected] = await Notification.update(
      { read: true },
      { where: { id: notificationId, userId } },
    );
    return affected > 0;
  }

  async markAllAsRead(userId: number): Promise<boolean> {
    const [affected] = await Notification.update(
      { read: true },
      { where: { userId, read: false } },
    );
    return affected > 0;
  }
}
