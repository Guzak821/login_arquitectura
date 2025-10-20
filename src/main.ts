import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { ValidationPipe } from '@nestjs/common';
// const hbs = require('express-handlebars'); // Handlebars

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // 1. Configurar directorio de VISTAS (Template Engine)
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs'); 

  // 2. Configurar directorio de archivos estáticos (CSS, JS)
  app.useStaticAssets(join(__dirname, '..', 'public')); // carpeta 'public'

   // Habilita el ValidationPipe globalmente
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Esto remueve cualquier propiedad que no esté en el DTO
    forbidNonWhitelisted: true, // Esto lanza un error si se envían propiedades extra
    transform: true, // Esto transforma el cuerpo a la instancia de la clase DTO
  }));
  // 3. Iniciar la aplicación en el puerto 3000
  await app.listen(3000);
}
bootstrap();