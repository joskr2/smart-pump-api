# Smart Pump API

API para el proyecto Smart Pump.

## Descripción

Esta API proporciona los endpoints necesarios para la aplicación Smart Pump. Actualmente utiliza una base de datos simple basada en archivos JSON (LowDB) para almacenar datos de usuario.

## Instalación

1.  Clona este repositorio.
2.  Instala las dependencias usando pnpm:

    ```bash
    pnpm install
    ```

## Uso

### Desarrollo

Para iniciar el servidor en modo de desarrollo con recarga automática:

```bash
pnpm run dev
```

El servidor estará disponible en `http://localhost:3001` (o el puerto especificado en `.env`).

### Build

Para compilar el proyecto TypeScript a JavaScript y copiar los archivos de datos necesarios:

```bash
pnpm run build
```

Esto generará la carpeta `dist` con el código compilado.

### Producción

Para iniciar el servidor con el código compilado:

```bash
pnpm run start
```

## Estructura del Proyecto

-   `src/`: Código fuente de la API (TypeScript).
    -   `db/`: Lógica de inicialización y acceso a la base de datos (LowDB).
    -   `routes/`: Definición de las rutas de la API (Hono).
    -   `types/`: Definiciones de tipos TypeScript.
    -   `index.ts`: Punto de entrada principal de la aplicación.
-   `data/`: Archivos de datos (ej. `users.json`).
-   `scripts/`: Scripts auxiliares (ej. `copy-data.mjs`).
-   `dist/`: Código compilado (generado por `pnpm run build`).
-   `package.json`: Metadatos del proyecto y dependencias.
-   `tsconfig.json`: Configuración del compilador TypeScript.
-   `pnpm-lock.yaml`: Archivo de bloqueo de dependencias de pnpm.


## Scripts

-   `dev`: Inicia el servidor de desarrollo con `tsx`.
-   `build`: Compila el código TypeScript con `tsc` y ejecuta el script `scripts/copy-data.mjs` para copiar `data/users.json` a `dist/src/data/users.json`.
-   `start`: Ejecuta el servidor desde la carpeta `dist` usando `node`.
-   `test`: (Actualmente no implementado)

## Ejemplos de Uso con cURL

A continuación se muestran algunos ejemplos de cómo interactuar con la API utilizando `curl`.

**Autenticación (Login)**

```bash
curl -X POST http://localhost:3001/auth/login -H "Content-Type: application/json" -d '{
  "username": "testuser",
  "password": "password123"
}'
```

**Obtener Información del Usuario (Requiere Token)**

Primero, obtén el token del paso de autenticación. Luego:

```bash
TOKEN="tu_token_jwt_aqui"
curl http://localhost:3001/user -H "Authorization: Bearer $TOKEN"
```

*(Reemplaza `tu_token_jwt_aqui` con el token real obtenido)*

## Licencia

MIT

---

Desarrollado por Josue
