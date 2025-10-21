import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateProfileCommand } from '../commands/update.profile.command';
import { UsuarioDao } from 'src/modules/users/DAO/UsuarioDao';
import { AuthService } from 'src/auth/auth.service';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@CommandHandler(UpdateProfileCommand)
export class UpdateProfileHandler implements ICommandHandler<UpdateProfileCommand> {
    constructor(
        private readonly usuarioDao: UsuarioDao,
        private readonly authService: AuthService
    ) {}

    async execute(command: UpdateProfileCommand): Promise<any> {
        const { userId, updateData } = command;
        const { nombre, email, current_pass, new_pass } = updateData;

        // 1. OBTENER EL EMAIL ACTUAL SEGURO
        // Primero, buscamos el usuario solo por ID para obtener su email actual.
        // Esto es necesario para la búsqueda con hash, ya que el DTO.email podría ser el nuevo.
        const userActualProfile = await this.usuarioDao.findById(userId);

        if (!userActualProfile) {
            // Si el ID del token no existe en la base de datos
            throw new UnauthorizedException('Usuario no encontrado o ID inválido.');
        }

        // 2. OBTENER LA ENTIDAD COMPLETA (CON HASH)
        // Usamos el email seguro del perfil actual para obtener la entidad completa con la contraseña hasheada.
        const emailParaBusqueda = userActualProfile.email as string;
        const user = await this.usuarioDao.findByEmailWithPassword(emailParaBusqueda);

        // Verificación de seguridad: El email debe coincidir con el ID.
        if (!user || user.id !== userId) {
            throw new UnauthorizedException('Error de identidad en la búsqueda del hash.');
        }

        let isProfileChanged = false; // Bandera para saber si guardar o no.
        
        // 3. Aplicar Actualizaciones de Perfil (Nombre/Email) al objeto en memoria
        if (nombre && user.nombre !== nombre) {
            user.nombre = nombre;
            isProfileChanged = true;
        }
        // Nota: Si el email viene en el DTO, se aplica al objeto 'user'.
        if (email && user.email !== email) { 
            user.email = email as string; 
            isProfileChanged = true;
        }
        
        // 4. Manejar Actualización de Contraseña (Lógica de Seguridad)
        if (new_pass) {
            if (!current_pass) {
                throw new UnauthorizedException('Debe proporcionar la contraseña actual para el cambio.');
            }

            // Llamamos al AuthService para la VERIFICACIÓN y obtenemos el HASH.
            const hashedPassword = await this.authService.updatePassword(
                userId, 
                user.email, // Usamos el email del objeto 'user' (puede ser el nuevo si se actualizó en el paso 3)
                current_pass, 
                new_pass
            ) as string;

            // Aplicamos el nuevo hash al objeto de usuario en memoria
            user.password = hashedPassword; 
            isProfileChanged = true; // Un cambio de password SIEMPRE requiere guardar
        }

        // 5. Guardado ÚNICO (Si hubo cualquier cambio, lo guardamos)
        if (isProfileChanged) {
            // El objeto 'user' ahora contiene la mezcla de todos los cambios 
            await this.usuarioDao.saveEntity(user); 
        }

        return true;
    }
}
    