import { BlenderHelp, CreateBlenderHelpPayload, FilterParams } from '../types/blender-help';

const API_BASE = (import.meta as any).env?.VITE_API_URL || '/api';

export const fallbackShortcuts: BlenderHelp[] = [
  {
    id: 'bh-01',
    title: 'Extrusión con Menú Avanzado',
    shortcut: 'Alt + E',
    description: 'Muestra el menú desplegable para extruir caras normales, caras individuales, o vértices/aristas.',
    blenderVersion: '4.2 LTS',
    mode: 'Edit Mode',
    category: 'Modelado',
    tags: ['extrude', 'modelado', 'mesh', 'caras'],
    tip: 'Usa "Extrude Faces Along Normals" para dar grosor uniforme a paredes o armaduras.',
  },
  {
    id: 'bh-02',
    title: 'Biselado de Aristas / Vértices (Bevel)',
    shortcut: 'Ctrl + B',
    description: 'Aplica bisel (Bevel) interactivo a las aristas seleccionadas. Al presionar "V" conmuta a biselar vértices.',
    blenderVersion: 'All',
    mode: 'Edit Mode',
    category: 'Modelado',
    tags: ['bevel', 'bisel', 'aristas', 'hard-surface'],
    tip: 'Rueda la rueda del ratón (Scroll) mientras mueves el ratón para aumentar o disminuir el número de segmentos.',
  },
  {
    id: 'bh-03',
    title: 'Corte en Bucle (Loop Cut & Slide)',
    shortcut: 'Ctrl + R',
    description: 'Inserta un bucle de aristas alrededor de la malla. Permite deslizarlo inmediatamente a lo largo de las caras.',
    blenderVersion: 'All',
    mode: 'Edit Mode',
    category: 'Modelado',
    tags: ['loopcut', 'geometria', 'mesh', 'topologia'],
    tip: 'Gira la rueda del mouse para añadir múltiples cortes equidistantes de una sola vez.',
  },
  {
    id: 'bh-04',
    title: 'Herramienta Cuchillo (Knife Tool)',
    shortcut: 'K',
    description: 'Activa la herramienta cuchillo para cortar caras manualmente vértice a vértice o arista a arista.',
    blenderVersion: 'All',
    mode: 'Edit Mode',
    category: 'Modelado',
    tags: ['knife', 'cuchillo', 'retopologia', 'cortes'],
    tip: 'Presiona "C" para restringir el corte a ángulos ortogonales o presiona "Z" para cortar a través de todo el objeto.',
  },
  {
    id: 'bh-05',
    title: 'Edición Proporcional (Proportional Editing)',
    shortcut: 'O',
    description: 'Activa o desactiva la influencia de transformación suave sobre los vértices vecinos.',
    blenderVersion: 'All',
    mode: 'Edit Mode',
    category: 'Modelado',
    tags: ['proportional', 'organico', 'influencia', 'soft-selection'],
    tip: 'Con "Shift + O" puedes cambiar el tipo de curva de caída (Smooth, Sphere, Root, Linear, Constant, Random).',
  },
  {
    id: 'bh-06',
    title: 'Emparentar con Pesos Automáticos (Rigging)',
    shortcut: 'Ctrl + P',
    description: 'Emparenta la malla seleccionada con la armadura activa calculando las influencias de pesos (Bone Heat).',
    blenderVersion: 'All',
    mode: 'Object Mode',
    category: 'Rigging',
    tags: ['armature', 'rigging', 'parent', 'skinning', 'huesos'],
    tip: 'Asegúrate de aplicar rotación y escala (Ctrl + A) tanto a la malla como a la armadura antes de emparentar.',
  },
  {
    id: 'bh-07',
    title: 'Fusión de Vértices (Merge Menu)',
    shortcut: 'M',
    description: 'Despliega las opciones para unir vértices: en el centro (At Center), en el cursor, colapsar o por distancia.',
    blenderVersion: '4.2 LTS',
    mode: 'Edit Mode',
    category: 'Modelado',
    tags: ['merge', 'limpieza', 'optimización', 'vértices'],
    tip: 'Usa "By Distance" para limpiar vértices duplicados tras operaciones booleanas o de espejo.',
  },
  {
    id: 'bh-08',
    title: 'Modo Rayos X (Toggle X-Ray)',
    shortcut: 'Alt + Z',
    description: 'Alterna la transparencia de la vista 3D para ver y seleccionar elementos que están ocultos detrás de otros.',
    blenderVersion: 'All',
    mode: 'Object Mode',
    category: 'Viewport',
    tags: ['x-ray', 'seleccion', 'visor', 'transparencia'],
    tip: 'Crucial para seleccionar caras o vértices traseros con el cuadro de selección (Box Select B).',
  },
  {
    id: 'bh-09',
    title: 'Rueda de Vistas Rápidas (Pie Menu View)',
    shortcut: '` (Backtick / Tilde)',
    description: 'Abre el menú circular de navegación de vistas (Superior, Frontal, Derecha, Cámara, etc.).',
    blenderVersion: 'All',
    mode: 'Object Mode',
    category: 'Navegación',
    tags: ['pie-menu', 'navegacion', 'camara', 'vistas'],
    tip: 'Si no tienes teclado numérico físico, activa "Emulate Numpad" en Preferences > Input.',
  },
  {
    id: 'bh-10',
    title: 'Desplegar UV (Smart UV Project / Unwrap)',
    shortcut: 'U',
    description: 'Abre el menú de operaciones UV para desenvolver la malla según marcas de costura (Seams).',
    blenderVersion: '4.2 LTS',
    mode: 'Edit Mode',
    category: 'UV Mapping',
    tags: ['uv', 'unwrap', 'texturizado', 'seams'],
    tip: 'Marca previamente costuras seleccionando aristas con "Ctrl + E > Mark Seam".',
  },
  {
    id: 'bh-11',
    title: 'Búsqueda Rápida de Comandos (Search Menu)',
    shortcut: 'F3',
    description: 'Abre el buscador global de operadores, herramientas y modificadores por nombre.',
    blenderVersion: 'All',
    mode: 'All',
    category: 'General',
    tags: ['search', 'comandos', 'herramientas', 'atajos'],
    tip: 'En versiones modernas de Blender puedes buscar nombres de operadores de Python o scripts directamente.',
  },
  {
    id: 'bh-12',
    title: 'Remesh Rápido Voxel (Voxel Remesher)',
    shortcut: 'Ctrl + R',
    description: 'Ejecuta el remallado Voxel instantáneo de la geometría esculpida con la resolución configurada.',
    blenderVersion: '5.2 LTS',
    mode: 'Sculpt Mode',
    category: 'Escultura',
    tags: ['sculpt', 'remesh', 'voxel', 'esculpido'],
    tip: 'Presiona "Shift + R" antes para previsualizar interactivamente el tamaño de la cuadrícula voxel.',
  },
  {
    id: 'bh-13',
    title: 'Aplicar Transformaciones (Apply Transforms)',
    shortcut: 'Ctrl + A',
    description: 'Aplica la posición, rotación o escala del objeto como su nuevo valor neutral (1.0 o 0.0).',
    blenderVersion: 'All',
    mode: 'Object Mode',
    category: 'General',
    tags: ['transforms', 'rotacion', 'escala', 'rigging'],
    tip: 'Imprescindible antes de exportar a GLB/FBX o aplicar modificadores como Bevel y Solidify.',
  },
  {
    id: 'bh-14',
    title: 'Separar Geometría (Separate)',
    shortcut: 'P',
    description: 'Separa los vértices seleccionados en un objeto 3D independiente (Por selección, por material o partes sueltas).',
    blenderVersion: 'All',
    mode: 'Edit Mode',
    category: 'Modelado',
    tags: ['separate', 'separar', 'objetos', 'mesh'],
    tip: 'Usa "By Loose Parts" para separar un modelo importado que vino compuesto de múltiples piezas sin unir.',
  },
  {
    id: 'bh-15',
    title: 'Aislar Vista Local (Local View)',
    shortcut: '/ (Numpad Slash)',
    description: 'Oculta temporalmente todos los objetos de la escena excepto el que tienes seleccionado y hace zoom en él.',
    blenderVersion: 'All',
    mode: 'Object Mode',
    category: 'Viewport',
    tags: ['local-view', 'aislar', 'viewport', 'enfoque'],
    tip: 'Vuelve a presionar "/" para restaurar la visibilidad de toda la escena original sin perder tus capas.',
  }
];

export async function fetchShortcuts(filters?: Partial<FilterParams>): Promise<BlenderHelp[]> {
  try {
    const params = new URLSearchParams();
    if (filters?.version && filters.version !== 'Todas') params.append('version', filters.version);
    if (filters?.tag) params.append('tag', filters.tag);
    if (filters?.mode && filters.mode !== 'Todos') params.append('mode', filters.mode);
    if (filters?.category) params.append('category', filters.category);
    if (filters?.search) params.append('search', filters.search);

    const query = params.toString() ? `?${params.toString()}` : '';
    const res = await fetch(`${API_BASE}/blender-help${query}`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Backend API no disponible aún o sin conexión, usando almacén local sincronizado:', err);
    // Filtrado en memoria si la API estuviera offline
    let items = [...fallbackShortcuts];
    if (filters?.version && filters.version !== 'Todas') {
      items = items.filter(i => i.blenderVersion.toLowerCase().includes(filters.version!.toLowerCase()) || i.blenderVersion.toLowerCase() === 'all');
    }
    if (filters?.tag) {
      items = items.filter(i => i.tags.some(t => t.toLowerCase() === filters.tag!.toLowerCase()));
    }
    if (filters?.mode && filters.mode !== 'Todos') {
      items = items.filter(i => i.mode.toLowerCase() === filters.mode!.toLowerCase());
    }
    if (filters?.search) {
      const s = filters.search.toLowerCase();
      items = items.filter(i =>
        i.title.toLowerCase().includes(s) ||
        i.shortcut.toLowerCase().includes(s) ||
        i.description.toLowerCase().includes(s) ||
        i.tags.some(t => t.toLowerCase().includes(s))
      );
    }
    return items;
  }
}

export async function createShortcut(payload: CreateBlenderHelpPayload): Promise<BlenderHelp> {
  try {
    const res = await fetch(`${API_BASE}/blender-help`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Guardando en memoria local por falta de conexión a backend:', err);
    const newItem: BlenderHelp = {
      id: Date.now().toString(36),
      ...payload,
      createdAt: new Date().toISOString(),
    };
    fallbackShortcuts.unshift(newItem);
    return newItem;
  }
}

export async function deleteShortcut(id: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/blender-help/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return true;
  } catch (err) {
    const idx = fallbackShortcuts.findIndex(i => i.id === id);
    if (idx !== -1) {
      fallbackShortcuts.splice(idx, 1);
    }
    return true;
  }
}
