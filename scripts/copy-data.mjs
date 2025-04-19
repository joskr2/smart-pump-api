import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");

const sourceFilePath = path.resolve(projectRoot, "data/users.json");
const targetDir = path.resolve(projectRoot, "dist/src/data");
const targetFilePath = path.join(targetDir, "users.json");

console.log(`--- Debug Info ---`);
console.log(`Current Working Directory (CWD): ${process.cwd()}`);
console.log(`Script Directory (__dirname):     ${__dirname}`);
console.log(`Project Root (Calculated):      ${projectRoot}`);
console.log(`Source File Path (Resolved):    ${sourceFilePath}`);
console.log(`Target Directory (Resolved):    ${targetDir}`);
console.log(`Target File Path (Resolved):      ${targetFilePath}`);
console.log(`------------------`);

async function copyDataFile() {
  try {
    console.log(`INFO: Creando directorio destino si no existe: ${targetDir}`);
    await fs.mkdir(targetDir, { recursive: true });

    console.log(`INFO: Copiando ${sourceFilePath} a ${targetFilePath}`);
    await fs.copyFile(sourceFilePath, targetFilePath);

    console.log(`SUCCESS: Archivo copiado exitosamente a ${targetFilePath}`);
  } catch (err) {
    console.error("FATAL: Error al copiar el archivo de datos:", err);
    console.error(err);
    process.exit(1);
  }
}

copyDataFile();
