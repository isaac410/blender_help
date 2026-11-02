import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('BlenderHelpBackend');
  const app = await NestFactory.create(AppModule);

  // Set global prefix to /api
  app.setGlobalPrefix('api');

  // Enable CORS for frontend client
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Swagger Documentation configuration
  const config = new DocumentBuilder()
    .setTitle('Blender Help API (PostgreSQL)')
    .setDescription('API REST conectada a PostgreSQL para consulta y gestión de atajos y ayudas de Blender.')
    .setVersion('1.0')
    .addTag('Blender Help')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 4000;
  await app.listen(port);
  logger.log(` Servidor backend activo en http://localhost:${port}/api`);
  logger.log(` Documentación Swagger disponible en http://localhost:${port}/api/docs`);
}
bootstrap();
