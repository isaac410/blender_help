import { Injectable, OnModuleInit, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BlenderHelp } from './domain/blender-help.entity';
import { CreateBlenderHelpDto } from './dto/create-blender-help.dto';
import { QueryBlenderHelpDto } from './dto/query-blender-help.dto';

@Injectable()
export class BlenderHelpService implements OnModuleInit {
  private readonly logger = new Logger(BlenderHelpService.name);

  constructor(
    @InjectRepository(BlenderHelp)
    private readonly blenderHelpRepository: Repository<BlenderHelp>,
  ) {}

  async onModuleInit() {
    await this.seedInitialData();
  }

  private async seedInitialData() {
    try {
      const count = await this.blenderHelpRepository.count();
      if (count === 0) {
        this.logger.log('Base de datos vacía. Sembrando atajos y ayudas iniciales de Blender...');
        for (const item of initialSeedShortcuts) {
          const entity = this.blenderHelpRepository.create(item);
          await this.blenderHelpRepository.save(entity);
        }
        this.logger.log(` ${initialSeedShortcuts.length} atajos y ayudas sembradas con éxito.`);
      }
    } catch (err) {
      this.logger.warn('Error al verificar/sembrar datos iniciales en PostgreSQL:', err);
    }
  }

  async findAll(query: QueryBlenderHelpDto): Promise<BlenderHelp[]> {
    const qb = this.blenderHelpRepository.createQueryBuilder('help');

    // Filtro por Versión
    if (query.version && query.version !== 'All' && query.version !== 'Todas') {
      qb.andWhere(
        '(LOWER(help.blenderVersion) LIKE :version OR LOWER(help.blenderVersion) = :all)',
        {
          version: `%${query.version.toLowerCase().trim()}%`,
          all: 'all',
        },
      );
    }

    // Filtro por Modo
    if (query.mode && query.mode !== 'All' && query.mode !== 'Todos') {
      qb.andWhere('LOWER(help.mode) = :mode', {
        mode: query.mode.toLowerCase().trim(),
      });
    }

    // Filtro por Categoría
    if (query.category) {
      qb.andWhere('LOWER(help.category) = :category', {
        category: query.category.toLowerCase().trim(),
      });
    }

    // Filtro por Etiqueta (Tag)
    if (query.tag) {
      qb.andWhere('LOWER(help.tags) LIKE :tag', {
        tag: `%${query.tag.toLowerCase().trim()}%`,
      });
    }

    // Búsqueda por texto (search)
    if (query.search) {
      const s = `%${query.search.toLowerCase().trim()}%`;
      qb.andWhere(
        '(LOWER(help.title) LIKE :s OR LOWER(help.shortcut) LIKE :s OR LOWER(help.description) LIKE :s OR LOWER(help.tags) LIKE :s OR LOWER(help.tip) LIKE :s)',
        { s },
      );
    }

    qb.orderBy('help.createdAt', 'DESC');
    return await qb.getMany();
  }

  async findOne(id: string): Promise<BlenderHelp> {
    const item = await this.blenderHelpRepository.findOne({ where: { id } });
    if (!item) {
      throw new NotFoundException(`Atajo o ayuda con ID "${id}" no encontrada.`);
    }
    return item;
  }

  async create(dto: CreateBlenderHelpDto): Promise<BlenderHelp> {
    const tags = Array.isArray(dto.tags)
      ? dto.tags.map(t => t.trim().toLowerCase())
      : [String(dto.tags).trim().toLowerCase()];

    const entity = this.blenderHelpRepository.create({
      title: dto.title,
      shortcut: dto.shortcut,
      description: dto.description,
      blenderVersion: dto.blenderVersion || '4.2 LTS',
      mode: dto.mode || 'Object Mode',
      category: dto.category || 'General',
      tags,
      tip: dto.tip,
    });

    return await this.blenderHelpRepository.save(entity);
  }

  async update(id: string, dto: Partial<CreateBlenderHelpDto>): Promise<BlenderHelp> {
    const item = await this.findOne(id);
    if (dto.tags && Array.isArray(dto.tags)) {
      dto.tags = dto.tags.map(t => t.trim().toLowerCase());
    }
    Object.assign(item, dto);
    return await this.blenderHelpRepository.save(item);
  }

  async remove(id: string): Promise<{ success: boolean; message: string }> {
    const item = await this.findOne(id);
    await this.blenderHelpRepository.remove(item);
    return { success: true, message: `Atajo ${id} eliminado correctamente.` };
  }

  async getTags(): Promise<string[]> {
    const items = await this.blenderHelpRepository.find({ select: ['tags'] });
    const tagsSet = new Set<string>();
    items.forEach(i => {
      if (Array.isArray(i.tags)) {
        i.tags.forEach(t => tagsSet.add(t.trim().toLowerCase()));
      }
    });
    return Array.from(tagsSet).sort();
  }

  async getVersions(): Promise<string[]> {
    const items = await this.blenderHelpRepository.find({ select: ['blenderVersion'] });
    const verSet = new Set<string>();
    items.forEach(i => {
      if (i.blenderVersion) verSet.add(i.blenderVersion);
    });
    return Array.from(verSet).sort();
  }
}

const initialSeedShortcuts: Partial<BlenderHelp>[] = [
  {
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
    title: 'Aislar Vista Local (Local View)',
    shortcut: '/ (Numpad Slash)',
    description: 'Oculta temporalmente todos los objetos de la escena excepto el que tienes seleccionado y hace zoom en él.',
    blenderVersion: 'All',
    mode: 'Object Mode',
    category: 'Viewport',
    tags: ['local-view', 'aislar', 'viewport', 'enfoque'],
    tip: 'Vuelve a presionar "/" para restaurar la visibilidad de toda la escena original sin perder tus capas.',
  },
];
