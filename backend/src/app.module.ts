import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { BlenderHelpModule } from './blender-help/blender-help.module';

@Module({
  imports: [PrismaModule, BlenderHelpModule],
})
export class AppModule {}
