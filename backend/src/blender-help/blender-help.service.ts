import { Injectable, NotFoundException } from '@nestjs/common';
import { BlenderHelp } from './domain/blender-help.entity';
import { CreateBlenderHelpDto } from './dto/create-blender-help.dto';
import { QueryBlenderHelpDto } from './dto/query-blender-help.dto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class BlenderHelpService {
  private items: BlenderHelp[] = [];
  private readonly storagePath = path.resolve(process.cwd(), 'data', 'blender-help-store.json');

  constructor() {
    this.loadStore();
  }

  private loadStore() {
    try {
      if (fs.existsSync(this.storagePath)) {
        const raw = fs.readFileSync(this.storagePath, 'utf8');
        this.items = JSON.parse(raw);
        return;
      }
    } catch (e) {
      console.warn('No se pudo leer store local, inicializando datos por defecto.', e);
    }
    this.seedDefaultData();
    this.saveStore();
  }

  private saveStore() {
    try {
      const dir = path.dirname(this.storagePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(this.storagePath, JSON.stringify(this.items, null, 2), 'utf8');
    } catch (e) {
      console.error('Error guardando en archivo store:', e);
    }
  }

  findAll(query: QueryBlenderHelpDto): BlenderHelp[] {
    let result = [...this.items];

    // Filtro por versión
    if (query.version && query.version !== 'All' && query.version !== 'Todas') {
      const verLower = query.version.toLowerCase().trim();
      result = result.filter(item => 
        item.blenderVersion.toLowerCase().includes(verLower) || 
        item.blenderVersion.toLowerCase() === 'all' ||
        item.blenderVersion.toLowerCase() === 'todas'
      );
    }

    // Filtro por etiqueta / tag
    if (query.tag) {
      const tagLower = query.tag.toLowerCase().trim();
      result = result.filter(item =>
        item.tags.some(t => t.toLowerCase() === tagLower || t.toLowerCase().includes(tagLower))
      );
    }

    // Filtro por modo
    if (query.mode && query.mode !== 'All' && query.mode !== 'Todos') {
      const modeLower = query.mode.toLowerCase().trim();
      result = result.filter(item => item.mode.toLowerCase() === modeLower);
    }

    // Filtro por categoría
    if (query.category) {
      const catLower = query.category.toLowerCase().trim();
      result = result.filter(item => item.category.toLowerCase() === catLower);
    }

    // Búsqueda de texto
    if (query.search) {
      const s = query.search.toLowerCase().trim();
      result = result.filter(item =>
        item.title.toLowerCase().includes(s) ||
        item.shortcut.toLowerCase().includes(s) ||
        item.description.toLowerCase().includes(s) ||
        item.tags.some(t => t.toLowerCase().includes(s)) ||
        (item.tip && item.tip.toLowerCase().includes(s))
      );
    }

    return result;
  }

  findOne(id: string): BlenderHelp {
    const item = this.items.find(i => i.id === id);
    if (!item) {
      throw new NotFoundException(`Atajo o ayuda con ID "${id}" no encontrada.`);
    }
    return item;
  }

  create(dto: CreateBlenderHelpDto): BlenderHelp {
    const newItem: BlenderHelp = {
      id: Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
      title: dto.title,
      shortcut: dto.shortcut,
      description: dto.description,
      blenderVersion: dto.blenderVersion || '4.2 LTS',
      mode: dto.mode || 'Object Mode',
      category: dto.category || 'General',
      tags: Array.isArray(dto.tags) ? dto.tags : [dto.tags],
      tip: dto.tip,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.items.unshift(newItem);
    this.saveStore();
    return newItem;
  }

  update(id: string, dto: Partial<CreateBlenderHelpDto>): BlenderHelp {
    const index = this.items.findIndex(i => i.id === id);
    if (index === -1) {
      throw new NotFoundException(`Atajo con ID "${id}" no encontrado.`);
    }

    this.items[index] = {
      ...this.items[index],
      ...dto,
      updatedAt: new Date(),
    };

    this.saveStore();
    return this.items[index];
  }

  remove(id: string): { success: boolean; message: string } {
    const index = this.items.findIndex(i => i.id === id);
    if (index === -1) {
      throw new NotFoundException(`Atajo con ID "${id}" no encontrado.`);
    }
    this.items.splice(index, 1);
    this.saveStore();
    return { success: true, message: `Atajo ${id} eliminado correctamente.` };
  }

  getTags(): string[] {
    const tagsSet = new Set<string>();
    this.items.forEach(item => {
      item.tags.forEach(t => tagsSet.add(t.trim().toLowerCase()));
    });
    return Array.from(tagsSet).sort();
  }

  getVersions(): string[] {
    const verSet = new Set<string>();
    this.items.forEach(item => {
      if (item.blenderVersion) verSet.add(item.blenderVersion);
    });
    return Array.from(verSet).sort();
  }

  private seedDefaultData() {
    this.items = [
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
        createdAt: new Date(),
        updatedAt: new Date(),
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
        createdAt: new Date(),
        updatedAt: new Date(),
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
        createdAt: new Date(),
        updatedAt: new Date(),
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
        createdAt: new Date(),
        updatedAt: new Date(),
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
        createdAt: new Date(),
        updatedAt: new Date(),
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
        createdAt: new Date(),
        updatedAt: new Date(),
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
        createdAt: new Date(),
        updatedAt: new Date(),
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
        createdAt: new Date(),
        updatedAt: new Date(),
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
        createdAt: new Date(),
        updatedAt: new Date(),
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
        createdAt: new Date(),
        updatedAt: new Date(),
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
        createdAt: new Date(),
        updatedAt: new Date(),
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
        createdAt: new Date(),
        updatedAt: new Date(),
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
        createdAt: new Date(),
        updatedAt: new Date(),
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
        createdAt: new Date(),
        updatedAt: new Date(),
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
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ];
  }
}
