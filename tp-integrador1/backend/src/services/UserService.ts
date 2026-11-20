import { IUserRepository } from "../repositories/interfaces/IUserRepository";
import { User } from "../models/user.model";
import { UserRole } from "../types";

export class UserService {
  constructor(private readonly userRepository: IUserRepository) {}

  async getAllUsers(): Promise<User[]> {
    return await this.userRepository.findAll();
  }

  async getUserById(id: number): Promise<User | null> {
    return await this.userRepository.findById(id);
  }

  async assignRole(id: number, role: UserRole): Promise<User | null> {
    const validRoles: UserRole[] = ["admin", "operador", "usuario"];
    if (!validRoles.includes(role)) {
      throw new Error(`Rol inválido. Opciones permitidas: ${validRoles.join(", ")}`);
    }

    const updatedUser = await this.userRepository.updateRole(id, role);
    if (!updatedUser) {
      throw new Error("Usuario no encontrado");
    }

    return updatedUser;
  }
}
