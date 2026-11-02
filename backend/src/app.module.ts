import { Module } from '@nestjs/common';
import { BlenderHelpModule } from './blender-help/blender-help.module';

@Module({
  imports: [BlenderHelpModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
