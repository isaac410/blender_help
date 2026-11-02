import { BlenderHelp, CreateBlenderHelpInput, UpdateBlenderHelpInput } from '../domain/blender-help.model';
import { IBlenderHelpRepository } from '../ports/blender-help.repository.interface';

export class ApiBlenderHelpRepository implements IBlenderHelpRepository {
  private readonly baseUrl = '/api/blender-help';

  async getAll(): Promise<BlenderHelp[]> {
    const response = await fetch(this.baseUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch Blender help entries');
    }
    return response.json();
  }

  async search(query: string, keywords: string, version: string): Promise<BlenderHelp[]> {
    const url = `${this.baseUrl}/search?q=${encodeURIComponent(query)}&keywords=${encodeURIComponent(keywords)}&version=${encodeURIComponent(version)}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to search Blender help entries');
    }
    return response.json();
  }

  async create(input: CreateBlenderHelpInput): Promise<BlenderHelp> {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    });
    if (!response.ok) {
      throw new Error('Failed to create Blender help entry');
    }
    return response.json();
  }

  async update(id: string, input: UpdateBlenderHelpInput): Promise<BlenderHelp> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    });
    if (!response.ok) {
      throw new Error('Failed to update Blender help entry');
    }
    return response.json();
  }

  async delete(id: string, password?: string): Promise<void> {
    const url = password ? `${this.baseUrl}/${id}?password=${encodeURIComponent(password)}` : `${this.baseUrl}/${id}`;
    const response = await fetch(url, {
      method: 'DELETE',
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const errorMessage = errorData?.message || 'Failed to delete Blender help entry';
      throw new Error(errorMessage);
    }
  }
}
