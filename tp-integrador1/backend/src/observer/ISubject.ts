export interface TicketStatusChangedEvent {
  ticketId: number;
  ticketTitle: string;
  previousStatus: string;
  newStatus: string;
  changedByUserId?: number;
  timestamp: Date;
}

export interface IObserver<T = TicketStatusChangedEvent> {
  update(event: T): Promise<void>;
}

export interface ISubject<T = TicketStatusChangedEvent> {
  attach(observer: IObserver<T>): void;
  detach(observer: IObserver<T>): void;
  notify(event: T): Promise<void>;
}
