// src/auth/auth.service.ts

import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt'; 
// Asegúrate de que esta ruta sea correcta
import { UsuarioDao } from '../modules/users/DAO/UsuarioDao'; 
import { User } from '../modules/users/user.entity'; 

@Injectable()
export class AuthService {
    // Solo necesita inyectar el DAO para acceder a la base de datos
    constructor(private usuarioDao: UsuarioDao) {}

    // 1. Lógica de REGISTRO: Hashea y luego llama al DAO.
    async registerUser(nombre: string, email: string, password: string): Promise<User> {
        const hashedPassword = await bcrypt.hash(password, 10);

        console.log(`[AUTH: REGISTER] Hashed Password: ${hashedPassword}`);
        // Llama al DAO con el hash, la persistencia es su trabajo.
        return this.usuarioDao.createUser(nombre, email, hashedPassword); 
    }
    
    // 2. Lógica de LOGIN: Valida credenciales.
    async validateUser(email: string, pass: string): Promise<Omit<User, 'password'> | null> {
        // Obtener el usuario incluyendo el hash
        const user = await this.usuarioDao.findByEmailWithPassword(email); 

        if (user) {
            console.log(`[AUTH: LOGIN] Hash DB: ${user.password}`);
            console.log(`[AUTH: LOGIN] Hash Ingresado (bcrypt.compare): ${pass}`);
            // Comparar la contraseña (lógica de seguridad)
            const isMatch = await bcrypt.compare(pass, user.password);

            if (isMatch) {
                // Retorna el objeto sin la contraseña
                const { password, ...result } = user;
                return result; 
            }
        }
        return null; // Fallo
    }

    // 3. Lógica de CAMBIO DE CONTRASEÑA: Verifica y actualiza.
async updatePassword(id: number, email: string, currentPassword: string, newPassword: string): Promise<boolean> {
        
        // 1. Buscar el usuario (necesitamos el hash actual para la verificación)
        const user = await this.usuarioDao.findByEmailWithPassword(email); 

        if (!user) {
            // Este caso es poco probable si el usuario está logueado
            throw new UnauthorizedException('Usuario no encontrado.'); 
        }

        // 2. Seguridad: Verificar que el ID del token/sesión coincida con el ID del usuario encontrado
        // Asumiendo que 'id' es el ID de la sesión.
        if (user.id !== id) {
            throw new UnauthorizedException('Error de identidad en la solicitud.');
        }

        // 3. Verificación CRÍTICA de la contraseña actual
        const isCurrentMatch = await bcrypt.compare(currentPassword, user.password);

        if (!isCurrentMatch) {
            // Si la contraseña actual es incorrecta, lanzamos la excepción
            throw new UnauthorizedException('Contraseña actual incorrecta.'); 
        }
        
        // 4. Hashear la nueva contraseña
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        
        // 5. Actualizar usando el ID del usuario validado
        return this.usuarioDao.updateUserPassword(user.id, hashedPassword);
    }
}