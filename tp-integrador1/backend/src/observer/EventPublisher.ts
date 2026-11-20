import { IObserver, ISubject, TicketStatusChangedEvent } from "./ISubject";

/**
 * Patrón Observer - EventPublisher (Subject concreto)
 * Mantiene la lista de observadores interesados y despacha eventos cuando cambia el estado.
 */
export class EventPublisher implements ISubject<TicketStatusChangedEvent> {
  private observers: IObserver<TicketStatusChangedEvent>[] = [];

  attach(observer: IObserver<TicketStatusChangedEvent>): void {
    if (!this.observers.includes(observer)) {
      this.observers.push(observer);
    }
  }

  detach(observer: IObserver<TicketStatusChangedEvent>): void {
    const index = this.observers.indexOf(observer);
    if (index !== -1) {
      this.observers.splice(index, 1);
    }
  }

  async notify(event: TicketStatusChangedEvent): Promise<void> {
    for (const observer of this.observers) {
      try {
        await observer.update(event);
      } catch (error) {
        console.error("Error al notificar observer:", error);
      }
    }
  }
}
