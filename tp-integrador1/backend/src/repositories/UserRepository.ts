import { User } from "../models/user.model";
import { IUserRepository } from "./interfaces/IUserRepository";

export class UserRepository implements IUserRepository {
  async findByEmail(email: string): Promise<User | null> {
    return await User.findOne({ where: { email } });
  }

  async findById(id: number): Promise<User | null> {
    return await User.findByPk(id);
  }

  async create(userData: {
    name: string;
    email: string;
    passwordHash: string;
    role?: "admin" | "operador" | "usuario";
  }): Promise<User> {
    return await User.create({
      ...userData,
      role: userData.role || "usuario",
    });
  }

  async findAll(): Promise<User[]> {
    return await User.findAll({
      attributes: ["id", "name", "email", "role", "createdAt", "updatedAt"],
    });
  }

  async updateRole(
    id: number,
    role: "admin" | "operador" | "usuario",
  ): Promise<User | null> {
    const user = await User.findByPk(id);
    if (!user) return null;
    user.role = role;
    await user.save();
    return user;
  }
}
