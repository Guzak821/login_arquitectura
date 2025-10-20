// src/auth/auth.module.ts
import { Module, forwardRef} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../modules/users/users.module';

@Module({
  imports: [forwardRef(() => UsersModule)],
  providers: [AuthService],
  exports: [AuthService], 
})
export class AuthModule {}