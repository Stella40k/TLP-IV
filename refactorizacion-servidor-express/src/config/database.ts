import mongoose from "mongoose";

export const connectDB = async (): Promise<void> => {
  try {
    const mongoUri =
      process.env.MONGO_URI || "mongodb://localhost:27017/empleados_db";
    await mongoose.connect(mongoUri);
    console.log("Conectado a MongoDB exitosamente");
  } catch (error) {
    console.error("Error al conectar a MongoDB:", error);
    process.exit(1); // Corta la ejecución si la base no responde
  }
};
