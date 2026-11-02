import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { BlenderHelp } from '../../domain/blender-help.entity';
import { IBlenderHelpRepository } from '../../domain/ports/blender-help.repository.interface';

@Injectable()
export class PrismaBlenderHelpRepository implements IBlenderHelpRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Omit<BlenderHelp, 'id' | 'createdAt' | 'updatedAt'>): Promise<BlenderHelp> {
    const created = await this.prisma.blenderHelp.create({
      data: {
        question: data.question.toLowerCase(),
        explanation: data.explanation.toLowerCase(),
        keywords: data.keywords.map((k) => k.toLowerCase()),
        version: data.version.toLowerCase(),
      },
    });
    return new BlenderHelp(created);
  }

  async findById(id: string): Promise<BlenderHelp | null> {
    const item = await this.prisma.blenderHelp.findUnique({
      where: { id },
    });
    return item ? new BlenderHelp(item) : null;
  }

  async findAll(): Promise<BlenderHelp[]> {
    const items = await this.prisma.blenderHelp.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return items.map((item) => new BlenderHelp(item));
  }

  async update(
    id: string,
    data: Partial<Omit<BlenderHelp, 'id' | 'createdAt' | 'updatedAt'>>,
  ): Promise<BlenderHelp> {
    const updateData: any = {};
    if (data.question !== undefined) updateData.question = data.question.toLowerCase();
    if (data.explanation !== undefined) updateData.explanation = data.explanation.toLowerCase();
    if (data.version !== undefined) updateData.version = data.version.toLowerCase();
    if (data.keywords !== undefined) updateData.keywords = data.keywords.map((k) => k.toLowerCase());

    const updated = await this.prisma.blenderHelp.update({
      where: { id },
      data: updateData,
    });
    return new BlenderHelp(updated);
  }

  async delete(id: string): Promise<boolean> {
    await this.prisma.blenderHelp.delete({
      where: { id },
    });
    return true;
  }

  async search(query: string, keywordsString: string, versionString: string): Promise<BlenderHelp[]> {
    const cleanQuery = query.trim().toLowerCase();
    const cleanKeywords = keywordsString
      .split(',')
      .map((k) => k.trim().toLowerCase())
      .filter((k) => k !== '');
    const cleanVersion = versionString.trim().toLowerCase();

    if (!cleanQuery && cleanKeywords.length === 0 && !cleanVersion) {
      return this.findAll();
    }

    let sqlQuery = `SELECT * FROM "BlenderHelp" WHERE 1=1`;
    const params: any[] = [];
    let paramIndex = 1;

    if (cleanQuery) {
      sqlQuery += ` AND "question" ILIKE $${paramIndex++}`;
      params.push(`%${cleanQuery}%`);
    }

    if (cleanVersion) {
      sqlQuery += ` AND "version" ILIKE $${paramIndex++}`;
      params.push(`%${cleanVersion}%`);
    }

    if (cleanKeywords.length > 0) {
      for (const keyword of cleanKeywords) {
        sqlQuery += ` AND EXISTS (
          SELECT 1 FROM unnest("keywords") k
          WHERE k ILIKE $${paramIndex++}
        )`;
        params.push(`%${keyword}%`);
      }
    }

    sqlQuery += ` ORDER BY "createdAt" DESC`;

    const items: any[] = await this.prisma.$queryRawUnsafe(sqlQuery, ...params);
    return items.map(
      (item) =>
        new BlenderHelp({
          id: item.id,
          question: item.question,
          explanation: item.explanation,
          keywords: item.keywords,
          version: item.version,
          createdAt: new Date(item.createdAt),
          updatedAt: new Date(item.updatedAt),
        }),
    );
  }
}
