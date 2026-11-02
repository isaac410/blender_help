import { BlenderHelp, CreateBlenderHelpInput, UpdateBlenderHelpInput } from '../domain/blender-help.model';

export interface IBlenderHelpRepository {
  getAll(): Promise<BlenderHelp[]>;
  search(query: string, keywords: string, version: string): Promise<BlenderHelp[]>;
  create(input: CreateBlenderHelpInput): Promise<BlenderHelp>;
  update(id: string, input: UpdateBlenderHelpInput): Promise<BlenderHelp>;
  delete(id: string, password?: string): Promise<void>;
}
