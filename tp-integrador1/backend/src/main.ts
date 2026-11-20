import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Database Singleton
import { DatabaseConnection } from "./database/DatabaseConnection";

// Repositories
import { UserRepository } from "./repositories/UserRepository";
import { TicketRepository } from "./repositories/TicketRepository";
import { SubscriptionRepository } from "./repositories/SubscriptionRepository";
import { NotificationRepository } from "./repositories/NotificationRepository";

// Patterns: Observer, Factory, Adapter
import { EventPublisher } from "./observer/EventPublisher";
import { NotifierFactory } from "./notifications/NotifierFactory";
import { NotificationService } from "./services/NotificationService";

// Services
import { AuthService } from "./services/AuthService";
import { TicketService } from "./services/ticket.service";
import { SubscriptionService } from "./services/SubscriptionService";

// Controllers
import { AuthController } from "./controllers/AuthController";
import { TicketController } from "./controllers/ticket.controller";
import { SubscriptionController } from "./controllers/SubscriptionController";
import { NotificationController } from "./controllers/NotificationController";

// Routes
import { createAuthRoutes } from "./routes/auth.routes";
import { createTicketRoutes } from "./routes/ticket.routes";
import { createSubscriptionRoutes } from "./routes/subscription.routes";
import { createNotificationRoutes } from "./routes/notification.routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// ==========================================
// COMPOSITION ROOT (Sección 5.1 y 5.2)
// ==========================================

// 1. Singleton Database
DatabaseConnection.getInstance();

// 2. Repositorios
const userRepository = new UserRepository();
const ticketRepository = new TicketRepository();
const subscriptionRepository = new SubscriptionRepository();
const notificationRepository = new NotificationRepository();

// 3. Patrón Factory & Adapter
const notifierFactory = new NotifierFactory(notificationRepository);

// 4. Patrón Observer (Subject y Observers)
const eventPublisher = new EventPublisher();
const notificationService = new NotificationService(
  subscriptionRepository,
  userRepository,
  notifierFactory,
);
eventPublisher.attach(notificationService);

// 5. Servicios de negocio
const authService = new AuthService(userRepository);
const ticketService = new TicketService(ticketRepository, eventPublisher);
const subscriptionService = new SubscriptionService(
  subscriptionRepository,
  ticketRepository,
);

// 6. Controladores
const authController = new AuthController(authService);
const ticketController = new TicketController(ticketService);
const subscriptionController = new SubscriptionController(subscriptionService);
const notificationController = new NotificationController(notificationRepository);

// 7. Montaje de rutas
app.use("/api/auth", createAuthRoutes(authController));
app.use("/api/tickets", createTicketRoutes(ticketController));
app.use("/api/subscriptions", createSubscriptionRoutes(subscriptionController));
app.use("/api/notifications", createNotificationRoutes(notificationController));

app.get("/api/health", (_req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

async function bootstrap() {
  try {
    console.log("Servidor backend corriendo con Singleton, Observer, Factory y Adapter (RF1-RF5)");
    app.listen(PORT, () => {
      console.log(`Servidor backend escuchando en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log("Error al iniciar el server", error);
    process.exit(1);
  }
}

bootstrap();
