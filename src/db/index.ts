// src/db/index.ts

import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import type { DataSchema } from "../types/index.js";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const file = path.join(__dirname, "../data/users.json");

const adapter = new JSONFile<DataSchema>(file);
const defaultData: DataSchema = { users: [] };
const db = new Low<DataSchema>(adapter, defaultData);

export async function initializeDatabase() {
  try {
    console.log(`INFO: Intentando leer DB desde: ${file}`); 

    await db.read();
    console.log(
      `INFO: Base de datos LowDB inicializada correctamente desde: ${file}`
    );
  } catch (error) {
    console.error(
      `FATAL: No se pudo inicializar la base de datos desde ${file}. Error:`,
      error
    );
  }
}

export default db;
