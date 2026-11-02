import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { IBlenderHelpRepository } from '../domain/ports/blender-help.repository.interface';
import { BlenderHelp } from '../domain/blender-help.entity';
import { CreateBlenderHelpDto } from '../adapters/controllers/dto/create-blender-help.dto';
import { UpdateBlenderHelpDto } from '../adapters/controllers/dto/update-blender-help.dto';

@Injectable()
export class BlenderHelpService {
  constructor(private readonly repository: IBlenderHelpRepository) {}

  async create(data: CreateBlenderHelpDto): Promise<BlenderHelp> {
    return this.repository.create(data);
  }

  async findOne(id: string): Promise<BlenderHelp> {
    const item = await this.repository.findById(id);
    if (!item) {
      throw new NotFoundException(`BlenderHelp entry with ID "${id}" not found`);
    }
    return item;
  }

  async findAll(): Promise<BlenderHelp[]> {
    return this.repository.findAll();
  }

  async update(id: string, data: UpdateBlenderHelpDto): Promise<BlenderHelp> {
    await this.findOne(id);
    return this.repository.update(id, data);
  }

  async remove(id: string, password?: string): Promise<void> {
    if (password !== '1@Abcdefgh') {
      throw new ForbiddenException('Contraseña de eliminación incorrecta');
    }
    await this.findOne(id);
    await this.repository.delete(id);
  }

  async search(query?: string, keywords?: string, version?: string): Promise<BlenderHelp[]> {
    return this.repository.search(query || '', keywords || '', version || '');
  }
}
