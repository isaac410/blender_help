import { Module } from '@nestjs/common';
import { BlenderHelpController } from './blender-help.controller';
import { BlenderHelpService } from './blender-help.service';

@Module({
  controllers: [BlenderHelpController],
  providers: [BlenderHelpService],
  exports: [BlenderHelpService],
})
export class BlenderHelpModule {}
