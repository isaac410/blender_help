# 🎨 Blender Help & Shortcuts

Plataforma Full-Stack con **PostgreSQL**, **NestJS** y **React** para consultar, filtrar y gestionar **atajos, shortcuts y ayudas rápidas de Blender**, organizados por **versión de Blender** (4.2 LTS, 5.0, 5.2, 3.6 LTS, Universal) y **etiquetas temáticas** (modelado, bevel, loopcut, rigging, escultura, uv mapping, viewport, etc.).

---

## 🚀 Puertos Asignados

| Servicio | Puerto | Descripción |
| :--- | :--- | :--- |
| **Frontend (React + Vite)** | **3000** | [http://localhost:3000](http://localhost:3000) - Interfaz visual |
| **Backend (NestJS API)** | **4000** | [http://localhost:4000/api](http://localhost:4000/api) - API REST |
| **Documentación Swagger** | **4000** | [http://localhost:4000/api/docs](http://localhost:4000/api/docs) - Swagger UI |
| **Base de Datos (PostgreSQL)** | **5432** | Conexión a Postgres (`blender_help`) |

---

## 🐳 Inicio con Docker Compose

Levanta todos los servicios (Base de datos PostgreSQL, Backend NestJS y Frontend React) con un solo comando:

```bash
docker compose up -d
```

Para ver los logs de los contenedores:
```bash
docker compose logs -f
```

Para detener los contenedores:
```bash
docker compose down
```

---

## 🛠️ Ejecución Local / Standalone (sin Docker)

### 1. Base de Datos
Asegúrate de tener una instancia de PostgreSQL corriendo en el puerto `5432` con la base de datos `blender_help`:
```bash
# Variables por defecto:
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=blender_help
```

### 2. Backend (NestJS)
```bash
cd backend
npm install
npm run start:dev
```
El servidor escuchará en el puerto **4000** y sembrará automáticamente los atajos por defecto en la base de datos si está vacía.

### 3. Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
```
La aplicación web abrirá en el puerto **3000** ([http://localhost:3000](http://localhost:3000)).

---

## 💡 Características Principales

1. **Persistencia Real en PostgreSQL**: Los atajos se almacenan en la tabla `blender_help` con TypeORM.
2. **Filtro por Versión de Blender**: Consulta qué atajos aplican a versiones específicas (ej. remesher en Blender 5.x, menús en 4.2 LTS o atajos universales).
3. **Filtro por Etiquetas (#tags)**: Encuentra rápidamente atajos por concepto: `#extrude`, `#bevel`, `#knife`, `#rigging`, `#uv`, `#sculpt`, etc.
4. **Filtro por Modo de Trabajo**: Filtra según el contexto actual en Blender (`Object Mode`, `Edit Mode`, `Sculpt Mode`, `UV Editor`, `Shader Editor`).
5. **Buscador en Tiempo Real**: Búsqueda reactiva instantánea por nombre de comando, teclas o descripción.
6. **Copia de Atajos en 1 Clic**: Botón para copiar directamente la combinación de teclas al portapapeles.
7. **Formulario Modal para Agregar Atajos**: Permite registrar nuevos atajos con versión, etiquetas, modo y tips de uso directo a la base de datos.
