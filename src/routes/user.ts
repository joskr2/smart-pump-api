import { Hono } from "hono";
import db from "../db/index.js";
import type { User } from "../types/index.js";

const userRoutes = new Hono();

userRoutes.get("/:userId/details", async (c) => {
  try {
    const userId = c.req.param("userId");
    if (!userId)
      return c.json({ error: "ID de usuario requerido en la URL." }, 400);

    await db.read();
    const user = db.data.users.find((u) => u._id === userId);

    if (!user) return c.json({ error: "Usuario no encontrado." }, 404);

    const { password: _, ...userData } = user;
    return c.json(userData);
  } catch (error) {
    console.error(
      `Error en GET /user/${c.req.param("userId")}/details:`,
      error
    );
    return c.json({ error: "Error interno del servidor." }, 500);
  }
});

userRoutes.get("/:userId/balance", async (c) => {
  try {
    const userId = c.req.param("userId");
    if (!userId)
      return c.json({ error: "ID de usuario requerido en la URL." }, 400);

    await db.read();
    const user = db.data.users.find((u) => u._id === userId);

    if (!user) return c.json({ error: "Usuario no encontrado." }, 404);

    return c.json({ balance: user.balance });
  } catch (error) {
    console.error(
      `Error en GET /user/${c.req.param("userId")}/balance:`,
      error
    );
    return c.json({ error: "Error interno del servidor." }, 500);
  }
});

userRoutes.put("/:userId/details", async (c) => {
  try {
    const userId = c.req.param("userId");
    if (!userId)
      return c.json({ error: "ID de usuario requerido en la URL." }, 400);

    const updates = await c.req.json();
    if (
      typeof updates !== "object" ||
      updates === null ||
      Array.isArray(updates)
    ) {
      return c.json({ error: "El cuerpo debe ser un objeto JSON." }, 400);
    }

    const allowedFieldsToUpdate: (keyof Omit<
      User,
      "_id" | "guid" | "email" | "password" | "balance"
    >)[] = [
      "isActive",
      "picture",
      "age",
      "eyeColor",
      "name",
      "company",
      "phone",
      "address",
    ];

    await db.read();
    const userIndex = db.data.users.findIndex((u) => u._id === userId);
    if (userIndex === -1)
      return c.json({ error: "Usuario no encontrado para actualizar." }, 404);

    const currentUser = db.data.users[userIndex];
    const updatedUser = { ...currentUser };
    let changesMade = false;

    for (const field of allowedFieldsToUpdate) {
      if (updates.hasOwnProperty(field)) {
        if (
          field === "name" &&
          typeof updates.name === "object" &&
          updates.name !== null
        ) {
          updatedUser.name = { ...currentUser.name, ...updates.name };
          changesMade = true;
        } else if (field !== "name") {
          (updatedUser as any)[field] = updates[field];
          changesMade = true;
        }
      }
    }

    if (!changesMade)
      return c.json(
        { message: "No se proporcionaron campos válidos para actualizar." },
        200
      );

    db.data.users[userIndex] = updatedUser;
    await db.write();
    console.log(
      `INFO: Detalles actualizados (Texto Plano) para usuario ID ${userId}`
    );

    const { password: _, ...userData } = updatedUser;
    return c.json({
      message: "Detalles actualizados exitosamente.",
      user: userData,
    });
  } catch (error) {
    console.error(
      `Error en PUT /user/${c.req.param("userId")}/details:`,
      error
    );
    if (error instanceof SyntaxError)
      return c.json({ error: "JSON mal formado." }, 400);
    return c.json({ error: "Error interno al actualizar." }, 500);
  }
});

export default userRoutes;
