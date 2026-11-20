import { User } from "../../models/user.model";

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  findById(id: number): Promise<User | null>;
  create(userData: {
    name: string;
    email: string;
    passwordHash: string;
    role?: "admin" | "operador" | "usuario";
  }): Promise<User>;
  findAll(): Promise<User[]>;
  updateRole(id: number, role: "admin" | "operador" | "usuario"): Promise<User | null>;
}
