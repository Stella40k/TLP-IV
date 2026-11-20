import { INotifier, NotificationPayload } from "./INotifier";

/**
 * Patrón Adapter - ConsoleNotifierAdapter
 * Adapta el objeto 'NotificationPayload' esperado por el contrato 'INotifier'
 * a la salida de texto requerida por 'console.log'.
 */
export class ConsoleNotifierAdapter implements INotifier {
  async send(notification: NotificationPayload): Promise<void> {
    const destinatario = notification.userEmail || `Usuario #${notification.userId}`;
    console.log(
      `[NOTIFICACIÓN] Para: ${destinatario} | Ticket #${notification.ticketId} (${notification.ticketTitle}) | Estado: ${notification.previousStatus} → ${notification.newStatus}`,
    );
  }
}
