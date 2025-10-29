// src/external-api-mock/external-api-mock.module.ts

import { Module } from '@nestjs/common';
import { ExternalApiMockController } from './external-api-controller';
import { UsersService } from 'src/modules/users/users.service';
import { UsuarioDao } from 'src/modules/users/DAO/UsuarioDao';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/modules/users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User]),],
  controllers: [ExternalApiMockController],
  providers: [UsersService, UsuarioDao],
})
export class ExternalApiMockModule {}