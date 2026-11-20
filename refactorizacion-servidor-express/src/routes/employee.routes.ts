import { Router } from "express";
import { EmployeeRepository } from "../repositories/employee.repository";
import { EmployeeService } from "../services/employee.service";
import { EmployeeController } from "../controllers/employee.controller";

const router = Router();

const employeeRepo = new EmployeeRepository();
const employeeService = new EmployeeService(employeeRepo);
const employeeController = new EmployeeController(employeeService);

router.post("/", employeeController.create);
router.get("/", employeeController.getAll);
router.get("/:id", employeeController.getById);

export default router;
