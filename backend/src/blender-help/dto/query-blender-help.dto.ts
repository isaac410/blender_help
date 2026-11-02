import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryBlenderHelpDto {
  @ApiPropertyOptional({ description: 'Filtro por versión de Blender (ej. 4.2 LTS, 5.0, All)' })
  version?: string;

  @ApiPropertyOptional({ description: 'Filtro por etiqueta / tag (separadas por coma o individual)' })
  tag?: string;

  @ApiPropertyOptional({ description: 'Filtro por modo de trabajo (ej. Edit Mode, Sculpt Mode, Object Mode)' })
  mode?: string;

  @ApiPropertyOptional({ description: 'Filtro por categoría' })
  category?: string;

  @ApiPropertyOptional({ description: 'Búsqueda por texto en título, teclas o descripción' })
  search?: string;
}
