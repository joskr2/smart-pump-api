import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import type { DataSchema } from "../types/index.js";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const file = path.join(__dirname, "../data/users.json");

const adapter = new JSONFile<DataSchema>(file);
const defaultData: DataSchema = { users: [] };
const db = new Low<DataSchema>(adapter, defaultData);

export async function initializeDatabase() {
  try {
    console.log(`INFO: Intentando leer DB desde: ${file}`);
    console.log('--- DEBUG: Verificando adapter.read() directamente ---');
    let adapterData = null;
    try {
      adapterData = await adapter.read();
      console.log('Resultado de adapter.read():', adapterData === null ? 'null' : 'Objeto recibido (verificar abajo)');
      if (adapterData) {
        console.log('Primeros 200 chars de adapterData:', `${JSON.stringify(adapterData).substring(0, 200)}...`);
        console.log('Número de usuarios en adapterData:', adapterData.users?.length ?? 'Propiedad "users" no encontrada o no es array');
      } else {
        console.log('adapter.read() devolvió null. ¿El archivo está vacío o no se encontró/pudo leer?');
      }
    } catch (adapterError) {
      console.error('ERROR directo de adapter.read():', adapterError);
    }
    console.log('-------------------------------------------------');

    await db.read();

    console.log(
      'INFO: db.read() completado. Verificando db.data...'
    );

    if (db.data && Array.isArray(db.data.users)) {
      console.log(`Número de usuarios en db.data AHORA: ${db.data.users.length}`);
    } else {
      console.error('ERROR: db.data o db.data.users sigue inválido DESPUÉS de db.read()!');
    }


  } catch (error) {
    console.error(
      'FATAL: Error en initializeDatabase (posiblemente en db.read o después):',
      error
    );
    console.error(error);
  }
}

export default db;
