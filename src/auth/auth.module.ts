import { Module, forwardRef } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport'; // 👈 Nuevo: Para usar Guards
import { JwtModule } from '@nestjs/jwt'; // 👈 Nuevo: Para firmar y verificar tokens

import { AuthService } from './auth.service';
import { UsersModule } from '../modules/users/users.module';

// Importaremos la estrategia que implementaremos a continuación
import { JwtStrategy } from './/strategies/jwt.strategy'; 
import { UsersService } from 'src/modules/users/users.service';
import { UsuarioDao } from 'src/modules/users/DAO/UsuarioDao';

// ⚠️ NOTA: Usar variables de entorno es mejor, pero usamos un secreto simple por ahora.
const jwtConstants = {
    secret: 'hola12345', 
};


@Module({ 
    imports: [
        forwardRef(() => UsersModule),
        PassportModule.register({ defaultStrategy: 'jwt' }), // Configura la estrategia por defecto
        JwtModule.register({
            secret: jwtConstants.secret, // Secreto para firmar y verificar
            signOptions: { expiresIn: '60m' }, // Token válido por 60 minutos
        }),
    ],
    providers: [
        AuthService,
        JwtStrategy 
    ],
    exports: [
        AuthService,
        JwtModule, 
        PassportModule 
    ], 
})
export class AuthModule {}
