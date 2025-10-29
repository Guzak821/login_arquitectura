// src/external-api-mock/external-api-mock.controller.ts

import { Controller, Get, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { UsrInsertExternoViewModel } from 'src/viewmodel/user-insert-externo.viewmodel';
import { UsrPublicoExternoViewModel } from 'src/viewmodel/user-publico-externo.viewmodel';
import { UsersService } from 'src/modules/users/users.service';
import { User } from 'src/auth/decorators/user.decorator';
import { User as UserEntity } from 'src/modules/users/user.entity';

type MockUser = {
    Identificador: number;
    Usr: string; 
};

@Controller('api-externa')
export class ExternalApiMockController { 
    private mockExternalUsers: MockUser[] = [];
constructor(private readonly usuarsService: UsersService) {}

    // --- RUTA para GetUsuarios() ---
    // Simula el endpoint para obtener usuarios
  @Get('usuarios') 
async getUsuariosExternos(): Promise<UsrPublicoExternoViewModel[]> {
    console.log('API Externa: Solicitando usuarios a la base de datos local y al mock.');
    
    // 1. Obtener usuarios locales de la DB
    const usuariosReales: Omit<UserEntity, 'password'>[] = await this.usuarsService.findAll();

    // 2. Mapear USUARIOS LOCALES a la estructura del EXTERNAL API (Identificador, Usr)
    const mappedLocalUsers = usuariosReales.map(user => ({
        Identificador: user.id,   // Asumiendo que UserEntity tiene 'id'
        Usr: user.email           // Asumiendo que UserEntity tiene 'email'
    }));
    
    // 3. Mapear USUARIOS MOCK a la misma estructura (ya la tienen, solo para consistencia)
    const mappedMockUsers = this.mockExternalUsers.map(user => ({
        Identificador: user.Identificador,
        Usr: user.Usr
    }));

    // 4. COMBINAR todos los usuarios. Ahora todos tienen Identificador y Usr.
    const combinedUsers = [...mappedLocalUsers, ...mappedMockUsers];

    // 5. Mapear el array combinado (Identificador/Usr) al ViewModel final
    const usuariosViewModel = combinedUsers.map(user => {
        const viewModel = new UsrPublicoExternoViewModel();
        
        // Accedemos a las propiedades ESTANDARIZADAS
        viewModel.Identificador = user.Identificador; 
        viewModel.Usr = user.Usr;
        
        return viewModel;
    });

    return usuariosViewModel; 
}


   // --- RUTA para InsertUsuario() ---
    @Post('insert') // Endpoint: POST /api-externa/insert
    @HttpCode(HttpStatus.CREATED) // Retorna 201 Created
    insertUsuarioExterno(@Body() userData: UsrInsertExternoViewModel): UsrPublicoExternoViewModel {
        console.log('API Externa Simulada: Petición POST recibida para /registrar con datos:', userData);
        
        const newId = Math.floor(Math.random() * 1000) + 2000;
        
       const newUser: MockUser = {
            Identificador: newId,
            Usr: userData.Usr,
        };

        this.mockExternalUsers.push(newUser); 

        return newUser;

    }
}