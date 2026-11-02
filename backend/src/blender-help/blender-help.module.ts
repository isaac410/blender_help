import { Module } from '@nestjs/common';
import { BlenderHelpController } from './adapters/controllers/blender-help.controller';
import { BlenderHelpService } from './application/blender-help.service';
import { IBlenderHelpRepository } from './domain/ports/blender-help.repository.interface';
import { PrismaBlenderHelpRepository } from './adapters/persistence/prisma-blender-help.repository';

@Module({
  controllers: [BlenderHelpController],
  providers: [
    BlenderHelpService,
    {
      provide: IBlenderHelpRepository,
      useClass: PrismaBlenderHelpRepository,
    },
  ],
  exports: [BlenderHelpService],
})
export class BlenderHelpModule {}
