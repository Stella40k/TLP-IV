import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import ticketRoutes from "./routes/ticket.routes";
import { UserRepository } from "./repositories/UserRepository";
import { AuthService } from "./services/AuthService";
import { AuthController } from "./controllers/AuthController";
import { createAuthRoutes } from "./routes/auth.routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Composition Root para autenticación
const userRepository = new UserRepository();
const authService = new AuthService(userRepository);
const authController = new AuthController(authService);

app.use("/api/auth", createAuthRoutes(authController));
app.use("/api/ticket", ticketRoutes);

app.get("/api/health", (_req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

async function bootstrap() {
  try {
    console.log("Servidor inicializado correctamente con autenticación (RF1)");
    app.listen(PORT, () => {
      console.log(`Servidor backend escuchando en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log("Error al iniciar el server", error);
    process.exit(1);
  }
}

bootstrap();
