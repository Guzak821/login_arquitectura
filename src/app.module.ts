import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm'; 
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { ExternalUsersController } from './external/external-users.controller'; 


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'dao.sqlite',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      cache: false,
      synchronize: true
    }),
    UsersModule, 
    AuthModule,
  ],
  controllers: [AppController, ExternalUsersController],
  providers: [AppService, AuthService],
})
export class AppModule {}
