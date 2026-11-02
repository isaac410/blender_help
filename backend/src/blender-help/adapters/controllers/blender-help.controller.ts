import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { BlenderHelpService } from '../../application/blender-help.service';
import { CreateBlenderHelpDto } from './dto/create-blender-help.dto';
import { UpdateBlenderHelpDto } from './dto/update-blender-help.dto';
import { BlenderHelp } from '../../domain/blender-help.entity';

@ApiTags('blender-help')
@Controller('blender-help')
export class BlenderHelpController {
  constructor(private readonly blenderHelpService: BlenderHelpService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new Blender help entry' })
  @ApiResponse({ status: 201, description: 'Created successfully', type: BlenderHelp })
  create(@Body() createBlenderHelpDto: CreateBlenderHelpDto) {
    return this.blenderHelpService.create(createBlenderHelpDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all Blender help entries' })
  @ApiResponse({ status: 200, description: 'Success', type: [BlenderHelp] })
  findAll() {
    return this.blenderHelpService.findAll();
  }

  @Get('search')
  @ApiOperation({ summary: 'Search Blender help entries by text matching question, keywords, or version' })
  @ApiQuery({ name: 'q', required: false, description: 'Search query for question' })
  @ApiQuery({ name: 'keywords', required: false, description: 'Search query for keywords (comma separated)' })
  @ApiQuery({ name: 'version', required: false, description: 'Filter by Blender version' })
  @ApiResponse({ status: 200, description: 'Success', type: [BlenderHelp] })
  search(
    @Query('q') query?: string,
    @Query('keywords') keywords?: string,
    @Query('version') version?: string,
  ) {
    return this.blenderHelpService.search(query, keywords, version);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single Blender help entry by ID' })
  @ApiResponse({ status: 200, description: 'Success', type: BlenderHelp })
  findOne(@Param('id') id: string) {
    return this.blenderHelpService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an existing Blender help entry' })
  @ApiResponse({ status: 200, description: 'Updated successfully', type: BlenderHelp })
  update(@Param('id') id: string, @Body() updateBlenderHelpDto: UpdateBlenderHelpDto) {
    return this.blenderHelpService.update(id, updateBlenderHelpDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a Blender help entry' })
  @ApiResponse({ status: 204, description: 'Deleted successfully' })
  remove(@Param('id') id: string, @Query('password') password?: string) {
    return this.blenderHelpService.remove(id, password);
  }
}
