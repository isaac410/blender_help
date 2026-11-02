import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { BlenderHelpService } from './blender-help.service';
import { CreateBlenderHelpDto } from './dto/create-blender-help.dto';
import { QueryBlenderHelpDto } from './dto/query-blender-help.dto';
import { BlenderHelp } from './domain/blender-help.entity';

@ApiTags('Blender Help')
@Controller('blender-help')
export class BlenderHelpController {
  constructor(private readonly blenderHelpService: BlenderHelpService) {}

  @Get()
  @ApiOperation({ summary: 'Consultar atajos y ayudas de Blender filtrando por versión, etiqueta, modo o búsqueda' })
  @ApiResponse({ status: 200, description: 'Listado de atajos y ayudas', type: [BlenderHelp] })
  findAll(@Query() query: QueryBlenderHelpDto): BlenderHelp[] {
    return this.blenderHelpService.findAll(query);
  }

  @Get('tags')
  @ApiOperation({ summary: 'Obtener todas las etiquetas registradas para filtros rápidos' })
  getTags(): string[] {
    return this.blenderHelpService.getTags();
  }

  @Get('versions')
  @ApiOperation({ summary: 'Obtener todas las versiones de Blender disponibles en los registros' })
  getVersions(): string[] {
    return this.blenderHelpService.getVersions();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener detalle de un atajo específico por ID' })
  findOne(@Param('id') id: string): BlenderHelp {
    return this.blenderHelpService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Registrar un nuevo atajo o ayuda rápida de Blender' })
  create(@Body() dto: CreateBlenderHelpDto): BlenderHelp {
    return this.blenderHelpService.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un atajo o ayuda existente' })
  update(@Param('id') id: string, @Body() dto: Partial<CreateBlenderHelpDto>): BlenderHelp {
    return this.blenderHelpService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un atajo o ayuda' })
  remove(@Param('id') id: string) {
    return this.blenderHelpService.remove(id);
  }
}
