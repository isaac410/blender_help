import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBlenderHelpDto {
  @ApiProperty({ description: 'Título o nombre de la acción/atajo', example: 'Extruir caras normales' })
  title: string;

  @ApiProperty({ description: 'Combinación de teclas', example: 'Alt + E' })
  shortcut: string;

  @ApiProperty({ description: 'Descripción de la ayuda o acción', example: 'Despliega el menú de extrusión especial para caras individuales o a lo largo de normales.' })
  description: string;

  @ApiProperty({ description: 'Versión de Blender compatible o recomendada', example: '4.2 LTS' })
  blenderVersion: string;

  @ApiProperty({ description: 'Modo de trabajo donde aplica el atajo', example: 'Edit Mode' })
  mode: string;

  @ApiProperty({ description: 'Categoría principal', example: 'Modelado' })
  category: string;

  @ApiProperty({ description: 'Etiquetas clave para filtrar', example: ['extrude', 'mesh', 'normales', 'edición'] })
  tags: string[];

  @ApiPropertyOptional({ description: 'Tip o consejo rápido adicional', example: 'Combínalo con "S" para cambiar el escalado simultáneamente.' })
  tip?: string;
}
