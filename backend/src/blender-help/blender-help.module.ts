import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlenderHelpController } from './blender-help.controller';
import { BlenderHelpService } from './blender-help.service';
import { BlenderHelp } from './domain/blender-help.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BlenderHelp])],
  controllers: [BlenderHelpController],
  providers: [BlenderHelpService],
  exports: [BlenderHelpService],
})
export class BlenderHelpModule {}
