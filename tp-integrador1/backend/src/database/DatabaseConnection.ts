import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

/**
 * Patrón Singleton - DatabaseConnection
 * Encapsula la conexión a la base de datos PostgreSQL mediante Sequelize.
 * Garantiza una única instancia compartida por toda la aplicación.
 */
export class DatabaseConnection {
  private static instance: Sequelize | null = null;

  // Constructor privado para impedir instanciación directa con 'new'
  private constructor() {}

  public static getInstance(): Sequelize {
    if (!DatabaseConnection.instance) {
      const dbName = process.env.DB_NAME ?? "tp_integrador";
      const dbUser = process.env.DB_USER ?? "tlp4";
      const dbPass = process.env.DB_PASSWORD ?? "tlp4";
      const dbHost = process.env.DB_HOST ?? "localhost";
      const dbPort = Number(process.env.DB_PORT) || 5432;

      DatabaseConnection.instance = new Sequelize(dbName, dbUser, dbPass, {
        host: dbHost,
        port: dbPort,
        dialect: "postgres",
        logging: process.env.NODE_ENV === "development" ? console.log : false,
      });
    }
    return DatabaseConnection.instance;
  }
}

export const sequelize = DatabaseConnection.getInstance();
