# 🎨 Blender Help & Shortcuts

Plataforma Full-Stack para consultar, filtrar y gestionar **atajos, shortcuts y ayudas rápidas de Blender**, organizados por **versión de Blender** (4.2 LTS, 5.0, 5.2, 3.6 LTS, Universal) y **etiquetas temáticas** (modelado, bevel, loopcut, rigging, escultura, uv mapping, viewport, etc.).

---

## 🚀 Inicio Rápido con Docker

La aplicación está completamente configurada con Docker y Docker Compose para levantar en un solo paso:

```bash
docker compose up -d
```

* **Frontend (React + Vite):** [http://localhost:5173](http://localhost:5173)
* **Backend (NestJS API):** [http://localhost:3000/api](http://localhost:3000/api)
* **Documentación Swagger:** [http://localhost:3000/api/docs](http://localhost:3000/api/docs)

Para detener los contenedores:
```bash
docker compose down
```

---

## 🛠️ Ejecución Local / Standalone (sin Docker)

### 1. Backend (NestJS)
```bash
cd backend
npm install
npm run start:dev
```
El servidor arrancará en el puerto `3000`, exponiendo las rutas `/api/blender-help` y `/api/docs`.

### 2. Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
```
La interfaz web abrirá en `http://localhost:5173`.

---

## 💡 Características Principales

1. **Filtro por Versión de Blender**: Consulta qué atajos aplican a versiones específicas (ej. remesher en Blender 5.x, menús en 4.2 LTS o atajos universales).
2. **Filtro por Etiquetas (#tags)**: Encuentra rápidamente atajos por concepto: `#extrude`, `#bevel`, `#knife`, `#rigging`, `#uv`, `#sculpt`, etc.
3. **Filtro por Modo de Trabajo**: Filtra según el contexto actual en Blender (`Object Mode`, `Edit Mode`, `Sculpt Mode`, `UV Editor`, `Shader Editor`).
4. **Buscador en Tiempo Real**: Búsqueda reactiva instantánea por nombre de comando, teclas o descripción.
5. **Copia de Atajos en 1 Clic**: Botón para copiar directamente la combinación de teclas al portapapeles.
6. **Formulario Modal para Agregar Atajos**: Permite registrar nuevos atajos con versión, etiquetas, modo y tips de uso.
7. **Persistencia Automática**: Almacena los registros en `data/blender-help-store.json` o base de datos.
