import { Injectable, UnauthorizedException, forwardRef, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt'; 
import  { UsuarioDao } from '../modules/users/DAO/UsuarioDao'; 
import type { User } from '../modules/users/user.entity'; 

// Definición de la Carga Útil (Payload) que irá en el token
interface JwtPayload {
    id: number;
    email: string;
    nombre: string;
}

@Injectable()
export class AuthService {
    // Usamos @Inject(forwardRef) para resolver el ciclo de dependencia
    constructor(
        @Inject(forwardRef(() => UsuarioDao)) // Inyecta el DAO que viene del UsersModule
        private usuarioDao: UsuarioDao,
        private jwtService: JwtService 
    ) {}

    // 1. Lógica de REGISTRO: Hashea y luego llama al DAO.
    async registerUser(nombre: string, email: string, password: string): Promise<User> {
        const hashedPassword = await bcrypt.hash(password, 10);
        return this.usuarioDao.createUser(nombre, email, hashedPassword); 
    }
    
    // 2. Lógica de VALIDACIÓN: Verifica credenciales (usado por login)
    async validateUser(email: string, pass: string): Promise<Omit<User, 'password'> | null> {
        const user = await this.usuarioDao.findByEmailWithPassword(email); 

        if (user) {
            const isMatch = await bcrypt.compare(pass, user.password);

            if (isMatch) {
                // Retorna el objeto sin la contraseña para el token
                const { password, ...result } = user;
                return result as Omit<User, 'password'>; 
            }
        }
        return null;
    }
    
    /**
     * ✅ Método para firmar y generar el token JWT.
     * @param user Objeto de usuario validado (sin contraseña).
     * @returns Objeto con la identidad del usuario y el token de acceso.
     */
    async login(user: Omit<User, 'password'>) {
        // Creamos el payload del token (solo información esencial)
        const payload: JwtPayload = { id: user.id, email: user.email, nombre: user.nombre };
        
        return {
            user: payload,
            access_token: this.jwtService.sign(payload), // Firma el token
        };
    }

    // 3. Lógica de CAMBIO DE CONTRASEÑA: Usa el ID/Email dinámico del token.
    async updatePassword(id: number, email: string, currentPassword: string, newPassword: string): Promise<boolean> {
        
        const user = await this.usuarioDao.findByEmailWithPassword(email); 

        if (!user) {
            throw new UnauthorizedException('Usuario no encontrado.'); 
        }
        
        // Verifica que el ID inyectado coincida con el ID del usuario
        if (user.id !== id) {
            throw new UnauthorizedException('Error de identidad en la solicitud.');
        }

        const isCurrentMatch = await bcrypt.compare(currentPassword, user.password);

        if (!isCurrentMatch) {
            throw new UnauthorizedException('Contraseña actual incorrecta.'); 
        }
        
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        
        return this.usuarioDao.updateUserPassword(user.id, hashedPassword);
    }
}
