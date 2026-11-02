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
  @ApiResponse({ status: 200, description: 'Listado de atajos y ayudas desde PostgreSQL', type: [BlenderHelp] })
  async findAll(@Query() query: QueryBlenderHelpDto): Promise<BlenderHelp[]> {
    return await this.blenderHelpService.findAll(query);
  }

  @Get('tags')
  @ApiOperation({ summary: 'Obtener todas las etiquetas registradas en la base de datos' })
  async getTags(): Promise<string[]> {
    return await this.blenderHelpService.getTags();
  }

  @Get('versions')
  @ApiOperation({ summary: 'Obtener todas las versiones de Blender disponibles en la base de datos' })
  async getVersions(): Promise<string[]> {
    return await this.blenderHelpService.getVersions();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener detalle de un atajo específico por ID' })
  async findOne(@Param('id') id: string): Promise<BlenderHelp> {
    return await this.blenderHelpService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Registrar un nuevo atajo o ayuda rápida en PostgreSQL' })
  async create(@Body() dto: CreateBlenderHelpDto): Promise<BlenderHelp> {
    return await this.blenderHelpService.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un atajo o ayuda existente' })
  async update(@Param('id') id: string, @Body() dto: Partial<CreateBlenderHelpDto>): Promise<BlenderHelp> {
    return await this.blenderHelpService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un atajo o ayuda de PostgreSQL' })
  async remove(@Param('id') id: string) {
    return await this.blenderHelpService.remove(id);
  }
}
