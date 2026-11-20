import { IObserver, TicketStatusChangedEvent } from "../observer/ISubject";
import { ISubscriptionRepository } from "../repositories/interfaces/ISubscriptionRepository";
import { IUserRepository } from "../repositories/interfaces/IUserRepository";
import { NotifierFactory } from "../notifications/NotifierFactory";
import { INotifier, NotificationPayload } from "../notifications/INotifier";

/**
 * Patrón Observer - NotificationService
 * Actúa como observador del EventPublisher ante cambios de estado de tickets.
 * Consulta los usuarios suscriptos y despacha la notificación a través de la NotifierFactory.
 */
export class NotificationService implements IObserver<TicketStatusChangedEvent> {
  private inAppNotifier: INotifier;
  private consoleNotifier: INotifier;

  constructor(
    private readonly subscriptionRepo: ISubscriptionRepository,
    private readonly userRepo: IUserRepository,
    notifierFactory: NotifierFactory,
  ) {
    // Obtenemos los canales de notificación a través de la Factory (sin new directo)
    this.inAppNotifier = notifierFactory.create("inapp");
    this.consoleNotifier = notifierFactory.create("console");
  }

  async update(event: TicketStatusChangedEvent): Promise<void> {
    // 1. Consultar los suscriptores al ticket
    const subscriberUserIds = await this.subscriptionRepo.findSubscribersByTicketId(
      event.ticketId,
    );

    if (subscriberUserIds.length === 0) {
      return;
    }

    const message = `El Ticket #${event.ticketId} (${event.ticketTitle}) cambió de estado: ${event.previousStatus} → ${event.newStatus}`;

    // 2. Notificar a cada suscriptor por ambos canales
    for (const userId of subscriberUserIds) {
      const user = await this.userRepo.findById(userId);

      const payload: NotificationPayload = {
        userId,
        userEmail: user?.email,
        ticketId: event.ticketId,
        ticketTitle: event.ticketTitle,
        previousStatus: event.previousStatus,
        newStatus: event.newStatus,
        message,
        timestamp: event.timestamp,
      };

      // Canal 1: In-App (Base de datos)
      await this.inAppNotifier.send(payload);

      // Canal 2: Consola (Adapter con console.log)
      await this.consoleNotifier.send(payload);
    }
  }
}
