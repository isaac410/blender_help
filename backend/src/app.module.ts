import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlenderHelpModule } from './blender-help/blender-help.module';
import { BlenderHelp } from './blender-help/domain/blender-help.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'blender_help',
      entities: [BlenderHelp],
      synchronize: true, // auto-creación de tablas para desarrollo
      retryAttempts: 10,
      retryDelay: 3000,
    }),
    BlenderHelpModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
