// src/modules/users/users.module.ts

import { Module, forwardRef } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm'; 
import { User } from './user.entity';
import { UsuarioDao } from './DAO/UsuarioDao';
import { AuthModule } from '../../auth/auth.module';


@Module({
  imports: [ forwardRef(() => AuthModule), TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService ,UsuarioDao], 
  exports: [UsersService, UsuarioDao]
})
export class UsersModule {}