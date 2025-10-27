import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm'; 
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { ExternalUsersController } from './external/external-users.controller'; 
import { ExternalApiMockModule } from './apiservice/external-api-mock/external-api-mock.module';
import { HttpModule } from '@nestjs/axios';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'dao.sqlite',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      cache: false,
      synchronize: true,
      
    }),
    ServeStaticModule.forRoot({
      // Asegúrate de que 'public' sea el nombre de tu carpeta de archivos estáticos
      rootPath: join(__dirname, '..', 'public'), 
      // La opción 'serveRoot' se puede usar si quieres prefijar tus archivos (ej. /static/js)
    }),
    UsersModule, 
    AuthModule,
    HttpModule,
    ExternalApiMockModule,
  ],
  controllers: [AppController, ExternalUsersController],
  providers: [AppService, AuthService],
})
export class AppModule {}
