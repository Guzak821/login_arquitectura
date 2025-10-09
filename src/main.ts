import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
// const hbs = require('express-handlebars'); // Handlebars

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // 1. Configurar directorio de VISTAS (Template Engine)
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs'); 

  // 2. Configurar directorio de archivos estáticos (CSS, JS)
  app.useStaticAssets(join(__dirname, '..', 'public')); // carpeta 'public'

  await app.listen(3000);
}
bootstrap();