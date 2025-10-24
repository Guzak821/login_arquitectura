// src/external-api-mock/external-api-mock.controller.ts

import { Controller, Get, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { UsrInsertExternoViewModel } from 'src/viewmodel/user-insert-externo.viewmodel';
import { UsrPublicoExternoViewModel } from 'src/viewmodel/user-publico-externo.viewmodel';

// Usaremos un prefijo claro como 'api-externa' para diferenciar
@Controller('api-externa')
export class ExternalApiMockController { 
    private readonly mockUsers: UsrPublicoExternoViewModel[] = [
        { Identificador: 1001, Usr: 'usuario.externo.a@mock.com' },
        { Identificador: 1002, Usr: 'usuario.externo.b@mock.com' },
    ];
    private nextId = 1003;

    // --- RUTA SIMULADA para GetUsuarios() ---
    // Simula el endpoint de tu compañero para obtener usuarios
   @Get('usuarios') 
    getUsuariosExternos(): UsrPublicoExternoViewModel[] {
        console.log('API Externa Simulada: Devolviendo usuarios in-memory.');
        return this.mockUsers;
    
    }

   // --- RUTA SIMULADA para InsertUsuario() ---
    @Post('insert') // Endpoint: POST /api-externa/insert
    @HttpCode(HttpStatus.CREATED) // Retorna 201 Created
    insertUsuarioExterno(@Body() userData: UsrInsertExternoViewModel): UsrPublicoExternoViewModel {
        console.log('API Externa Simulada: Petición POST recibida para /registrar con datos:', userData);
        
        // Simula la lógica de registro y devuelve el usuario creado
        const newId = Math.floor(Math.random() * 1000) + 2000;
        
        return {
            Identificador: newId,
            Usr: userData.Usr, // Devuelve el correo que se intentó registrar
        };
    }
}