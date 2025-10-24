import { Controller, Post, Body, UsePipes, ValidationPipe, HttpStatus, HttpCode, Param } from '@nestjs/common';
import { UsuariosCQRS } from 'src/cqrs/usuarios.cqrs';
import { UsrInsertExternoViewModel } from '../viewmodel/user-insert-externo.viewmodel';
import { UsrPublicoExternoViewModel } from '../viewmodel/user-publico-externo.viewmodel';
import { UpdateProfileDto } from '../modules/DTO/update-profile.dto'; 

@Controller('api/external') // Prefijo base para todos los endpoints externos
export class ExternalUsersController {
    constructor(private readonly usuariosCQRS: UsuariosCQRS) {}

    /**
     * SERVICIO 1: Registro de Cuenta (Insert)
     * Ruta: POST /api/external/register
     * Flujo: Controlador (API) -> UsuariosCQRS -> Handler -> DAO
     */
    @Post('register')
    @HttpCode(HttpStatus.CREATED) 
    @UsePipes(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true }))
    async register(
    @Body() userData: UsrInsertExternoViewModel,
): Promise<UsrPublicoExternoViewModel> {
    
    const registerDto = {
        email: userData.Usr,
        password: userData.Pss,
    };

    // 1. Ejecutar el registro y obtener la entidad con el nuevo ID (sin password)
    const registeredUser = await this.usuariosCQRS.insert(registerDto as any);
    
    // 2. Mapear explícitamente al ViewModel de salida y añadir datos NO sensibles.
    const outputViewModel: UsrPublicoExternoViewModel = {
        Identificador: registeredUser.id, 
        Usr: registeredUser.email,
    
    };

    return outputViewModel; 
}

    /**
     * SERVICIO 2: Actualización de Perfil (Update)
     * Ruta: POST /api/external/update/:id
     * Flujo: Controlador (API) -> UsuariosCQRS -> Handler -> DAO
     */
    @Post('update/:id')
    @HttpCode(HttpStatus.OK)
    @UsePipes(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true }))
    async update(
        @Param('id') userId: string, // ID del usuario a actualizar
        @Body() userData: UsrInsertExternoViewModel, // Contrato de entrada para la nueva información
    ): Promise<UsrPublicoExternoViewModel> {
        
        // Mapear el ViewModel Externo a tu DTO interno de CQRS (UpdateProfileDto)
        const updateDto: UpdateProfileDto = {
            email: userData.Usr,
            password: userData.Pss,
            // si esta ruta maneja el cambio de password, pero por ahora solo pasamos nombre/email
        } as any; 

        // Despachar el comando de actualización con el ID y los datos
        const updatedUser = await this.usuariosCQRS.update(parseInt(userId, 10), updateDto);
        
        // Devolver el ViewModel de salida
        return updatedUser as UsrPublicoExternoViewModel;
    }
}
