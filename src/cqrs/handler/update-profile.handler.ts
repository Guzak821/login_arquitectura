import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateProfileCommand } from '../commands/update.profile.command';
import { UsuarioDao } from 'src/modules/users/DAO/UsuarioDao';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@CommandHandler(UpdateProfileCommand)
export class UpdateProfileHandler implements ICommandHandler<UpdateProfileCommand> {
    constructor(private readonly usuarioDao: UsuarioDao) {}

    async execute(command: UpdateProfileCommand): Promise<any> {
        const { userId, updateData } = command;
        const { nombre, password } = updateData;

        const user = await this.usuarioDao.findById(userId);

        if (!user) {
            throw new UnauthorizedException('Usuario no encontrado.');
        }

        // 1. Actualizar Nombre (si se proporciona)
        if (nombre) {
            // Asumiendo que tienes un método updateUserName en tu DAO:
            // await this.usuarioDao.updateUserName(userId, nombre); 
            
            // Si no lo tienes, usa user.nombre = nombre; await this.usuarioDao.userRepository.save(user);
        }

        // 2. Actualizar Contraseña (si se proporciona)
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            await this.usuarioDao.updateUserPassword(userId, hashedPassword);
        }

        // 3. Devolver un indicador de éxito
        return true;
    }
}
