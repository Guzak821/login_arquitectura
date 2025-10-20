// src/modules/users/users.module.ts

import { Module, forwardRef } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm'; 
import { User } from './user.entity';
import { UsuarioDao } from './DAO/UsuarioDao';
import { AuthModule } from '../../auth/auth.module';
import { CqrsModule } from '@nestjs/cqrs';
import { UsuariosCQRS } from 'src/cqrs/usuarios.cqrs';
import { RegisterUserHandler } from 'src/cqrs/handler/register-user.handler';
import { UpdateProfileHandler } from 'src/cqrs/handler/update-profile.handler';
const CommandHandlers = [RegisterUserHandler, UpdateProfileHandler];
const QueryHandlers = [];
const EventHandlers = [];

@Module({
  imports: [ forwardRef(() => AuthModule), TypeOrmModule.forFeature([User]), CqrsModule],
  controllers: [UsersController],
   providers: [
        UsersService, 
        UsuarioDao,
        UsuariosCQRS, // CLAVE: Registrar el Gateway para inyección en el Controller
        ...CommandHandlers, 
        ...QueryHandlers,
        ...EventHandlers
    ],   
  exports: [UsersService, UsuarioDao, UsuariosCQRS]
})
export class UsersModule {}