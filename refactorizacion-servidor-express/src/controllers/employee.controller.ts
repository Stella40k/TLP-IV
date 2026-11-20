//aca solo atiende a las peticionees HTTP del cliente (req y res)
//validda q los datos vengan bien, llama al servicio y devuelve las respuestas al cliente
import { Request, Response, NextFunction } from "express";
//trae los tipos de Express para tipar la peticionreq q llega, la res q sale y la funcion q pasa al siguiente middle
import { EmployeeService } from "../services/employee.service";
import { AppError } from "../middlewares/error.middleware";

export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, position, baseSalary, yearsOfService } = req.body;

      if (!name || !position) {
        throw new AppError(400, "Nombre y puesto son obligatorios");
      }

      if (typeof baseSalary !== "number" || baseSalary <= 0) {
        throw new AppError(400, "El salario base debe ser mayor a 0");
      }

      if (
        typeof yearsOfService !== "number" ||
        yearsOfService < 0 ||
        !Number.isInteger(yearsOfService)
      ) {
        throw new AppError(
          400,
          "La antigüedad debe ser un entero mayor o igual a 0",
        );
      }

      const employee = await this.employeeService.createEmployee({
        name,
        position,
        baseSalary,
        yearsOfService,
      });

      return res.status(201).json(employee);
    } catch (error) {
      next(error);
    }
  };

  getAll = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const employees = await this.employeeService.getAllEmployees();
      return res.json(employees);
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const employee = await this.employeeService.getEmployeeById(
        req.params.id,
      );

      if (!employee) {
        throw new AppError(404, "Empleado no encontrado");
      }

      return res.json(employee);
    } catch (error) {
      next(error);
    }
  };
}
