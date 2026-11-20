import bcrypt from "bcrypt";
import { User } from "../models/user.model";
import { sequelize } from "../config/database";

export async function runSeed(): Promise<void> {
  console.log("Iniciando seed de usuarios de prueba...");
  await sequelize.sync();

  const passwordHash = await bcrypt.hash("tlp4-2026", 10);

  const defaultUsers = [
    {
      name: "Administrador General",
      email: "admin@tp.com",
      passwordHash,
      role: "admin" as const,
    },
    {
      name: "Operador de Soporte",
      email: "operador@tp.com",
      passwordHash,
      role: "operador" as const,
    },
    {
      name: "Usuario Final",
      email: "usuario@tp.com",
      passwordHash,
      role: "usuario" as const,
    },
  ];

  for (const u of defaultUsers) {
    const existing = await User.findOne({ where: { email: u.email } });
    if (!existing) {
      await User.create(u);
      console.log(`Usuario creado: ${u.email} (${u.role})`);
    } else {
      console.log(`Usuario ya existente: ${u.email}`);
    }
  }

  console.log("Seed finalizado con éxito.");
}

// Ejecución directa si se invoca desde la CLI
if (require.main === module) {
  runSeed()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("Error en seed:", err);
      process.exit(1);
    });
}
