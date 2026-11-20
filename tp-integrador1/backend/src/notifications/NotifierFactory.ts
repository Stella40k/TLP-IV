import { INotifier } from "./INotifier";
import { InAppNotifier } from "./InAppNotifier";
import { ConsoleNotifierAdapter } from "./ConsoleNotifierAdapter";
import { INotificationRepository } from "../repositories/interfaces/INotificationRepository";

export type ChannelType = "inapp" | "console";

/**
 * Patrón Factory - NotifierFactory
 * Construye e instancia el canal de notificación adecuado sin que
 * el servicio cliente utilice 'new' directamente.
 */
export class NotifierFactory {
  constructor(private readonly notificationRepo: INotificationRepository) {}

  create(channel: ChannelType): INotifier {
    switch (channel) {
      case "inapp":
        return new InAppNotifier(this.notificationRepo);
      case "console":
        return new ConsoleNotifierAdapter();
      default:
        throw new Error(`Canal de notificación no soportado: ${channel}`);
    }
  }
}
