import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { IUserRepository } from "../repositories/interfaces/IUserRepository";
import { UserRole } from "../types";

export interface RegisterDTO {
  name: string;
  email: string;
  password: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: UserRole;
  };
}

export class AuthService {
  private readonly jwtSecret: string;
  private readonly saltRounds = 10;

  constructor(private readonly userRepository: IUserRepository) {
    this.jwtSecret = process.env.JWT_SECRET || "tlp4-secret-key-change-in-prod";
  }

  async register(data: RegisterDTO): Promise<AuthResponse> {
    const existing = await this.userRepository.findByEmail(data.email);
    if (existing) {
      throw new Error("El email ya se encuentra registrado");
    }

    const passwordHash = await bcrypt.hash(data.password, this.saltRounds);

    const newUser = await this.userRepository.create({
      name: data.name,
      email: data.email,
      passwordHash,
      role: "usuario",
    });

    const token = this.generateToken(newUser.id, newUser.email, newUser.role);

    return {
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    };
  }

  async login(data: LoginDTO): Promise<AuthResponse> {
    const user = await this.userRepository.findByEmail(data.email);
    if (!user) {
      throw new Error("Credenciales inválidas");
    }

    const isMatch = await bcrypt.compare(data.password, user.passwordHash);
    if (!isMatch) {
      throw new Error("Credenciales inválidas");
    }

    const token = this.generateToken(user.id, user.email, user.role);

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  private generateToken(id: number, email: string, role: UserRole): string {
    return jwt.sign({ id, email, role }, this.jwtSecret, {
      expiresIn: "8h",
    });
  }
}
