export interface NotificationPayload {
  userId: number;
  userEmail?: string;
  ticketId: number;
  ticketTitle: string;
  previousStatus: string;
  newStatus: string;
  message: string;
  timestamp: Date;
}

export interface INotifier {
  send(notification: NotificationPayload): Promise<void>;
}
