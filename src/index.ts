import { Hono } from "hono";
import { logger } from "hono/logger";
import { serve } from "@hono/node-server";
import { initializeDatabase } from "./db/index.js";
import db from "./db/index.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";

async function startServer() {
  try {
    // 1. Inicializa la base de datos
    await initializeDatabase();

    // --- NUEVO LOG DE VERIFICACIÓN ---
    console.log(
      "--- DEBUG: Estado de DB justo después de initializeDatabase() ---"
    );
    // Verifica si db.data existe y si el array users tiene elementos
    if (db.data && Array.isArray(db.data.users)) {
      console.log(
        `Número de usuarios cargados en db.data.users: ${db.data.users.length}`
      );
      // Opcional: Muestra el email del primer usuario si existe, para confirmar
      if (db.data.users.length > 0) {
        console.log(
          `Email del primer usuario cargado: ${db.data.users[0].email}`
        );
      }
    } else {
      console.error(
        "ERROR: db.data o db.data.users no está disponible o no es un array después de la inicialización!"
      );
      console.log("Valor actual de db.data:", db.data); // Muestra qué es db.data
    }
    console.log(
      "--------------------------------------------------------------"
    );
    // --- FIN NUEVO LOG ---

    // 2. Crea la app Hono
    const app = new Hono();

    // 3. Middlewares
    app.use("*", logger());

    // 4. Rutas
    app.get("/", (c) =>
      c.json({ message: "API SMART Pump (Versión Texto Plano - Insegura)" })
    );
    app.route("/auth", authRoutes);
    app.route("/user", userRoutes);

    // 5. Iniciar Servidor
    const port = parseInt(process.env.PORT || "3001");
    console.log(`------------------------------------------------------`);
    console.warn(
      `ADVERTENCIA: Servidor corriendo en modo inseguro (contraseñas texto plano).`
    );
    console.log(`🚀 Servidor API listo en http://localhost:${port}`);
    console.log(`------------------------------------------------------`);

    serve({ fetch: app.fetch, port: port });
  } catch (error) {
    console.error("FATAL: Error al iniciar el servidor:", error);
    process.exit(1);
  }
}

startServer();
