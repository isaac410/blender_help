import { BlenderHelp } from '../blender-help.entity';

export abstract class IBlenderHelpRepository {
  abstract create(data: Omit<BlenderHelp, 'id' | 'createdAt' | 'updatedAt'>): Promise<BlenderHelp>;
  abstract findById(id: string): Promise<BlenderHelp | null>;
  abstract findAll(): Promise<BlenderHelp[]>;
  abstract update(id: string, data: Partial<Omit<BlenderHelp, 'id' | 'createdAt' | 'updatedAt'>>): Promise<BlenderHelp>;
  abstract delete(id: string): Promise<boolean>;
  abstract search(query: string, keywords: string, version: string): Promise<BlenderHelp[]>;
}
