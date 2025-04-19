import { Hono } from "hono";
import { logger } from "hono/logger";
import { serve } from "@hono/node-server";
import { initializeDatabase } from "./db/index.js";
import { cors } from 'hono/cors';
import db from "./db/index.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";

async function startServer() {
  try {
    await initializeDatabase();

    // console.log(
    //   "--- DEBUG: Estado de DB justo después de initializeDatabase() ---"
    // );
    // if (db.data && Array.isArray(db.data.users)) {
    //   console.log(
    //     `Número de usuarios cargados en db.data.users: ${db.data.users.length}`
    //   );
    //   if (db.data.users.length > 0) {
    //     console.log(
    //       `Email del primer usuario cargado: ${db.data.users[0].email}`
    //     );
    //   }
    // } else {
    //   console.error(
    //     "ERROR: db.data o db.data.users no está disponible o no es un array después de la inicialización!"
    //   );
    //   console.log("Valor actual de db.data:", db.data);
    // }
    // console.log(
    //   "--------------------------------------------------------------"
    // );

    const app = new Hono();

    app.use("*", logger());
    app.use(
      '*',
      cors({
        origin: 'http://localhost:5173',
        allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowHeaders: ['Content-Type', 'Authorization'],
      })
    );

    app.get("/", (c) =>
      c.json({ message: "API SMART Pump" })
    );
    app.route("/auth", authRoutes);
    app.route("/user", userRoutes);

    const port = Number.parseInt(process.env.PORT || "3001");
    console.log('------------------------------------------------------');
    console.log(`🚀 Servidor API listo en http://localhost:${port}`);
    console.log('------------------------------------------------------');

    serve({ fetch: app.fetch, port: port });
  } catch (error) {
    console.error("FATAL: Error al iniciar el servidor:", error);
    process.exit(1);
  }
}

startServer();
