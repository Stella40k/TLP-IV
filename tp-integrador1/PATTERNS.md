# Documento de Diseño: Patrones y Principios SOLID

Este documento detalla la implementación de los patrones de diseño y los principios SOLID aplicados en el backend del proyecto, siguiendo la consigna del TP Integrador.

---

## 1. Patrones de Diseño

Los cuatro patrones requeridos colaboran juntos en un único flujo de negocio: **cuando un ticket cambia de estado y se notifica a los suscriptores**.

```text
TicketService.changeStatus()
   └─> EventPublisher.notify(evento)                     ← Observer (Subject)
         └─> NotificationService.update(evento)          ← Observer (Observer)
               ├─ consulta suscriptores al repositorio   ← usa DatabaseConnection (Singleton)
               └─ NotifierFactory.create('inapp')        ← Factory
                  NotifierFactory.create('console')
                        └─ ConsoleNotifierAdapter        ← Adapter
                              └─ console.log
```

---

### 1.1 Singleton — `DatabaseConnection`

- **Archivos:** `backend/src/database/DatabaseConnection.ts`
- **Problema que resuelve:** Evita abrir múltiples conexiones a PostgreSQL cada vez que un modelo o repositorio necesita consultar la base de datos. Al mantener una única instancia compartida (`Sequelize`), optimiza el uso de recursos y centraliza la configuración de la conexión.
- **Fragmento de código:**

```typescript
export class DatabaseConnection {
  private static instance: Sequelize | null = null;

  // Constructor privado para evitar 'new DatabaseConnection()'
  private constructor() {}

  public static getInstance(): Sequelize {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new Sequelize(/* variables de entorno */);
    }
    return DatabaseConnection.instance;
  }
}
```

---

### 1.2 Observer — `EventPublisher` y `NotificationService`

- **Archivos:** 
  - `backend/src/observer/ISubject.ts`
  - `backend/src/observer/EventPublisher.ts`
  - `backend/src/services/NotificationService.ts`
  - `backend/src/services/ticket.service.ts`
- **Problema que resuelve:** Desacopla la lógica de cambiar el estado de un ticket del envío de notificaciones. `TicketService` no necesita saber cómo, a quiénes ni por qué medios se notifica; simplemente publica un evento a través de la interfaz `ISubject`. `NotificationService` reacciona a este evento implementando `IObserver`, consulta las suscripciones y envía las notificaciones.
- **Fragmento de código:**

```typescript
// En EventPublisher (Subject):
export class EventPublisher implements ISubject<TicketStatusChangedEvent> {
  private observers: IObserver<TicketStatusChangedEvent>[] = [];

  attach(observer: IObserver<TicketStatusChangedEvent>): void {
    this.observers.push(observer);
  }

  async notify(event: TicketStatusChangedEvent): Promise<void> {
    for (const observer of this.observers) {
      await observer.update(event);
    }
  }
}

// En NotificationService (Observer):
export class NotificationService implements IObserver<TicketStatusChangedEvent> {
  async update(event: TicketStatusChangedEvent): Promise<void> {
    const subscriberUserIds = await this.subscriptionRepo.findSubscribersByTicketId(event.ticketId);
    for (const userId of subscriberUserIds) {
      await this.inAppNotifier.send(payload);
      await this.consoleNotifier.send(payload);
    }
  }
}
```

---

### 1.3 Factory — `NotifierFactory`

- **Archivos:**
  - `backend/src/notifications/INotifier.ts`
  - `backend/src/notifications/NotifierFactory.ts`
- **Problema que resuelve:** Centraliza la creación de los distintos canales de notificación (`'inapp'` o `'console'`). `NotificationService` no crea instancias concretas con `new`, sino que le solicita a la fábrica el canal necesario mediante la interfaz común `INotifier`. Esto permite agregar nuevos canales (como email o push) sin tocar el servicio de notificaciones.
- **Fragmento de código:**

```typescript
export class NotifierFactory {
  constructor(private readonly notificationRepo: INotificationRepository) {}

  create(channel: "inapp" | "console"): INotifier {
    switch (channel) {
      case "inapp":
        return new InAppNotifier(this.notificationRepo);
      case "console":
        return new ConsoleNotifierAdapter();
      default:
        throw new Error(`Canal no soportado: ${channel}`);
    }
  }
}
```

---

### 1.4 Adapter — `ConsoleNotifierAdapter`

- **Archivos:** `backend/src/notifications/ConsoleNotifierAdapter.ts`
- **Problema que resuelve:** El sistema espera que todos los canales cumplan con el contrato `INotifier`, el cual recibe un objeto `NotificationPayload` asincrónicamente. La función nativa `console.log` solo recibe cadenas de texto sincrónicas. El adaptador actúa como puente: implementa `INotifier`, formatea el objeto en un texto legible y lo envía a `console.log`.
- **Fragmento de código:**

```typescript
export class ConsoleNotifierAdapter implements INotifier {
  async send(notification: NotificationPayload): Promise<void> {
    const destinatario = notification.userEmail || `Usuario #${notification.userId}`;
    console.log(
      `[NOTIFICACIÓN] Para: ${destinatario} | Ticket #${notification.ticketId} (${notification.ticketTitle}) | Estado: ${notification.previousStatus} → ${notification.newStatus}`
    );
  }
}
```

---

## 2. Principios SOLID

### S — Responsabilidad Única (Single Responsibility Principle)
- **Dónde está aplicado:** En la separación de capas del backend:
  - `TicketController`: atiende la petición HTTP y valida los parámetros de entrada.
  - `TicketService`: contiene las reglas del negocio (cambio de estados, validaciones lógicas).
  - `TicketRepository`: maneja exclusivamente la persistencia contra la base de datos PostgreSQL.
- **Justificación:** Si cambia la estructura de una tabla en la base de datos, solo se modifica el repositorio; el controlador y el servicio no sufren alteraciones.

### O — Abierto/Cerrado (Open/Closed Principle)
- **Dónde está aplicado:** En el sistema de notificaciones (`NotifierFactory` e `INotifier`).
- **Justificación:** Si se desea agregar un canal de notificación nuevo (por ejemplo, `SlackNotifier` o `EmailNotifier`), solo se crea una nueva clase que implemente `INotifier` y se agrega su caso en `NotifierFactory`. `NotificationService` permanece cerrado a modificaciones y no necesita ser reescrito.

### L — Sustitución de Liskov (Liskov Substitution Principle)
- **Dónde está aplicado:** En las implementaciones de `INotifier` (`InAppNotifier` y `ConsoleNotifierAdapter`).
- **Justificación:** Ambos canales implementan `INotifier.send()`. `NotificationService` puede invocar a cualquiera de los dos indistintamente sin verificar su clase concreta con `instanceof`, ya que ambos respetan estrictamente la promesa y los tipos de entrada esperados.

### I — Segregación de Interfaces (Interface Segregation Principle)
- **Dónde está aplicado:** En las interfaces de repositorios (`backend/src/repositories/interfaces/`):
  - `IUserRepository` define solo operaciones de usuarios (`findByEmail`, `updateRole`).
  - `ISubscriptionRepository` define solo operaciones de suscripción (`subscribe`, `findSubscribersByTicketId`).
  - `ITicketRepository` define solo operaciones de tickets (`create`, `updateStatus`).
- **Justificación:** No existe una interfaz genérica monolítica con métodos que las clases no usan. Cada repositorio implementa únicamente el contrato específico que su dominio necesita.

### D — Inversión de Dependencias (Dependency Inversion Principle)
- **Dónde está aplicado:** En los constructores de todos los servicios (`TicketService`, `SubscriptionService`, `AuthService`, `UserService`).
- **Justificación:** Los servicios no dependen directamente de las clases de Sequelize (`Ticket.create(...)`), sino de abstracciones (`ITicketRepository`). Esto permite que en `main.ts` se inyecten las implementaciones concretas, facilitando el cambio de base de datos o el testing con mocks en el futuro.

```typescript
export class TicketService {
  // Depende de la interfaz ITicketRepository, no de la implementación concreta
  constructor(
    private readonly ticketRepository: ITicketRepository,
    private readonly eventPublisher?: ISubject<TicketStatusChangedEvent>
  ) {}
}
```
