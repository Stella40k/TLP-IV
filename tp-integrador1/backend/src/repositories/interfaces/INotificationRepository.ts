import { Notification } from "../../models/notification.model";

export interface CreateNotificationData {
  userId: number;
  ticketId: number;
  message: string;
}

export interface INotificationRepository {
  create(data: CreateNotificationData): Promise<Notification>;
  createMany(notifications: CreateNotificationData[]): Promise<Notification[]>;
  findByUserId(userId: number): Promise<Notification[]>;
  countUnreadByUserId(userId: number): Promise<number>;
  markAsRead(notificationId: number, userId: number): Promise<boolean>;
  markAllAsRead(userId: number): Promise<boolean>;
}
