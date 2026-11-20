import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { authenticate } from "../middlewares/authenticate";
import { authorize } from "../middlewares/authorize";

export function createUserRoutes(userController: UserController): Router {
  const router = Router();

  router.use(authenticate);

  // RF6 - Administración de usuarios (solo admin)
  router.get("/", authorize("user:read"), userController.getAll);
  router.patch("/:id/role", authorize("user:assign-role"), userController.assignRole);

  return router;
}
