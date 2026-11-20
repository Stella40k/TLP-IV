import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { UserRepository } from "./repositories/UserRepository";
import { AuthService } from "./services/AuthService";
import { AuthController } from "./controllers/AuthController";
import { createAuthRoutes } from "./routes/auth.routes";
import { TicketRepository } from "./repositories/TicketRepository";
import { TicketService } from "./services/ticket.service";
import { TicketController } from "./controllers/ticket.controller";
import { createTicketRoutes } from "./routes/ticket.routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Composition Root (main.ts)
// 1. Auth & Users
const userRepository = new UserRepository();
const authService = new AuthService(userRepository);
const authController = new AuthController(authService);

// 2. Tickets
const ticketRepository = new TicketRepository();
const ticketService = new TicketService(ticketRepository);
const ticketController = new TicketController(ticketService);

// Montar Rutas
app.use("/api/auth", createAuthRoutes(authController));
app.use("/api/tickets", createTicketRoutes(ticketController));

app.get("/api/health", (_req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

async function bootstrap() {
  try {
    console.log("Servidor inicializado correctamente con RF1, RF2 y RF3");
    app.listen(PORT, () => {
      console.log(`Servidor backend escuchando en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log("Error al iniciar el server", error);
    process.exit(1);
  }
}

bootstrap();
