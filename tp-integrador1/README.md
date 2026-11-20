# Sistema de Mesa de Ayuda (Tickets)

**Dominio:** A — Mesa de ayuda (Tickets)  
**Base de datos:** PostgreSQL + Sequelize  
**Organización del backend:** Carpeta por tipo de archivo  

## Integrantes
- Bernard, Stella

## Descripción
Esta aplicación es un sistema web para la gestión de incidentes y tickets de soporte técnico. Cuenta con autenticación de usuarios mediante JWT, un sistema de roles y permisos estricto validado en el backend (admin, operador, usuario), y permite que los usuarios se suscriban a tickets para recibir notificaciones automáticas (tanto en la base de datos como por consola) cada vez que el estado de un ticket cambia.

## Requisitos previos
- Docker y Docker Compose instalados
- Git
- (Opcional, para ejecución local): Node.js v18 o superior y PostgreSQL

## Cómo ejecutar el proyecto

1. Clonar el repositorio y entrar a la carpeta:
   ```bash
   git clone <url-del-repositorio>
   cd tp-integrador1
   ```

2. Crear el archivo de variables de entorno:
   ```bash
   cp .env.example .env
   ```

3. Levantar los contenedores (Base de datos PostgreSQL, Backend y Frontend):
   ```bash
   docker compose up --build
   ```

4. Cargar los usuarios iniciales de prueba (seed):
   En otra terminal, ejecutamos el script de seed dentro del backend:
   ```bash
   docker compose exec backend npm run seed
   ```

5. Abrir la aplicación:
   - Frontend: [http://localhost:5173](http://localhost:5173)
   - API Backend: [http://localhost:3000/api/health](http://localhost:3000/api/health)

## Ejecución sin Docker (local)

Si querés correrlo de forma manual en tu máquina:

1. **Base de datos:** Asegurate de tener PostgreSQL corriendo con una base llamada `tp_integrador` (usuario `tlp4`, clave `tlp4`).
2. **Backend:**
   ```bash
   cd backend
   npm install
   npm run seed
   npm run dev
   ```
   Quedará corriendo en el puerto 3000.
3. **Frontend:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   Quedará disponible en `http://localhost:5173`.

## Variables de entorno

| Variable | Descripción | Ejemplo |
|---|---|---|
| `DB_HOST` | Host de la base de datos | `db` (en Docker) o `localhost` (local) |
| `DB_PORT` | Puerto de PostgreSQL | `5432` |
| `DB_USER` | Usuario de la base de datos | `tlp4` |
| `DB_PASSWORD` | Contraseña | `tlp4` |
| `DB_NAME` | Nombre de la base | `tp_integrador` |
| `JWT_SECRET` | Clave secreta para firmar tokens JWT | `tlp4-secret-key-change-in-prod` |
| `PORT` | Puerto del servidor backend | `3000` |
| `VITE_API_URL` | URL de la API consumida por el frontend | `http://localhost:3000/api` |

## Usuarios de prueba

El script de seed genera estos tres usuarios listos para probar los permisos:

| Rol | Email | Contraseña | Permisos principales |
|---|---|---|---|
| **admin** | `admin@tp.com` | `tlp4-2026` | Acceso total: eliminar tickets, ver usuarios y asignar roles |
| **operador** | `operador@tp.com` | `tlp4-2026` | Crear, editar y cambiar estado de tickets |
| **usuario** | `usuario@tp.com` | `tlp4-2026` | Ver tickets, suscribirse y recibir notificaciones |

## Cómo probar el flujo de notificaciones (Paso a paso para la defensa)

1. Abrí el navegador en [http://localhost:5173](http://localhost:5173) e iniciá sesión como `usuario@tp.com` (clave `tlp4-2026`).
2. Entrá al detalle de cualquier ticket y hacé click en **"🔔 Suscribirme a este Ticket"**. El botón pasará a verde indicando que estás suscripto.
3. Abrí una ventana en modo incógnito (o en otro navegador) e iniciá sesión como `operador@tp.com` (clave `tlp4-2026`).
4. Entrá al mismo ticket y cambiá su estado (por ejemplo, de `ABIERTO` a `EN_PROGRESO`).
5. **Verificación Canal 1 (In-App):** Volvé a la ventana del usuario común. Verás que la campana de notificaciones del menú muestra un badge rojo con la cantidad no leída. Al ingresar a la campana podrás ver el mensaje del cambio de estado y marcarlo como leído.
6. **Verificación Canal 2 (Consola):** En la terminal donde está corriendo Docker (o ejecutando `docker compose logs backend`), vas a ver la línea formateada por el adaptador:
   ```text
   [NOTIFICACIÓN] Para: usuario@tp.com | Ticket #1 (Problema de red) | Estado: ABIERTO → EN_PROGRESO
   ```

## Endpoints principales del Backend

| Método | Ruta | Permiso requerido | Descripción |
|---|---|---|---|
| `POST` | `/api/auth/register` | Público | Registro de nuevo usuario (rol inicial: usuario) |
| `POST` | `/api/auth/login` | Público | Autenticación y obtención del token JWT |
| `GET` | `/api/tickets` | `ticket:read` | Listar todos los tickets |
| `GET` | `/api/tickets/:id` | `ticket:read` | Obtener el detalle de un ticket |
| `POST` | `/api/tickets` | `ticket:create` | Crear un nuevo ticket |
| `PUT` | `/api/tickets/:id` | `ticket:update` | Editar datos de un ticket |
| `PATCH` | `/api/tickets/:id/status` | `ticket:change-status` | Cambiar estado (dispara el evento Observer) |
| `DELETE` | `/api/tickets/:id` | `ticket:delete` | Eliminar un ticket (solo admin) |
| `POST` | `/api/subscriptions/tickets/:id` | `subscription:create` | Suscribirse a un ticket |
| `DELETE` | `/api/subscriptions/tickets/:id` | `subscription:delete` | Desuscribirse de un ticket |
| `GET` | `/api/subscriptions/tickets/:id/status` | Autenticado | Consultar si el usuario actual está suscripto |
| `GET` | `/api/notifications` | `notification:read` | Bandeja y contador de notificaciones no leídas |
| `PATCH` | `/api/notifications/:id/read` | `notification:read` | Marcar notificación individual como leída |
| `PATCH` | `/api/notifications/read-all` | `notification:read` | Marcar todas las notificaciones como leídas |
| `GET` | `/api/users` | `user:read` | Listar usuarios del sistema |
| `PATCH` | `/api/users/:id/role` | `user:assign-role` | Asignar nuevo rol a un usuario |

## Patrones y principios SOLID
Para ver el detalle de diseño, archivos involucrados y justificaciones teóricas, consultar [PATTERNS.md](./PATTERNS.md).
