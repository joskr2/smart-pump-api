import { Hono } from "hono";
import db from "../db/index.js";
import type { User } from "src/types/index.js";

const authRoutes = new Hono();

authRoutes.post("/login", async (c) => {
  try {
    const { email, password } = await c.req.json();
    if (!email || !password)
      return c.json({ error: "Email y contraseña requeridos" }, 400);

    console.log(email, password,"DATA ENVIADA")

    await db.read();
    const user: User | undefined = db.data.users.find((u) => u.email === email);
    console.log(user, "USER")

    if (!user) {
      console.warn(
        `Intento de login fallido (Usuario no encontrado): ${email}`
      );
      return c.json({ error: "Credenciales inválidas." }, 401);
    }

    if (user.password !== password) {
      console.warn(
        `Intento de login fallido (Contraseña incorrecta - Texto Plano): ${email}`
      );
      console.log(user.password, password, "PASSwORDS NO COINCIDEN")
      return c.json({ error: "Credenciales inválidas." }, 401);
    }
    console.log(`Login exitoso (Texto Plano) para usuario: ${email}`);

    const { password: _, ...userData } = user;

    return c.json({
      message: "Login exitoso (Texto Plano).",
      user: userData,
    });
  } catch (error) {
    console.error("FATAL: Error en la ruta /login:", error);
    return c.json({ error: "Error interno del servidor." }, 500);
  }
});

export default authRoutes;
