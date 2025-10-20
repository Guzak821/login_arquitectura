import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { RegisterDto } from '../modules/DTO/register.dto';
import { UpdateProfileDto } from '../modules/DTO/update.profile';
import { RegisterUserCommand } from './commands/register.user.command';
import { UpdateProfileCommand } from './commands/update.profile.command';

/**
 * UsuariosCQRS actúa como un Gateway para el controlador.
 * Recibe la petición del controlador y la traduce en un Comando despachable.
 */
@Injectable()
export class UsuariosCQRS {
    constructor(private readonly commandBus: CommandBus) {}

    // 1. Método Insert (Registro de Cuenta)
    async insert(registerData: RegisterDto): Promise<any> {
        // Ejecuta el comando de registro
        return this.commandBus.execute(new RegisterUserCommand(registerData));
    }

    // 2. Método Update (Actualización de Perfil)
    async update(userId: number, updateData: UpdateProfileDto): Promise<any> {
        // Ejecuta el comando de actualización
        return this.commandBus.execute(new UpdateProfileCommand(userId, updateData));
    }
}
