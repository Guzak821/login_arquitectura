import { 
    Controller, 
    Get, 
    Post, 
    Render, 
    Body, 
    Res, 
    UsePipes, 
    ValidationPipe, 
    Req,
    UseGuards,
    UnauthorizedException
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport'; 
import { CommandBus } from '@nestjs/cqrs'; 

import type { Request } from 'express'; 
import { UsuarioDao } from './DAO/UsuarioDao';
import { AuthService } from 'src/auth/auth.service';
import { User } from 'src/auth/decorators/user.decorator'; 
import { UsersService } from './users.service';

// DTOs para el flujo CQRS
import { RegisterDto } from 'src/modules/DTO/register.dto';
// Suponemos que UpdateProfileDto ahora incluye campos de CONTRASEÑA ACTUAL/NUEVA para la vista
import { UpdateProfileDto } from 'src/modules/DTO/update.profile'; 
import { UsuariosCQRS } from 'src/cqrs/usuarios.cqrs'; // Gateway de CQRS

// Interfaz de la Carga Útil del JWT (Payload)
interface JwtPayload {
    id: number;
    email: string;
    nombre: string;
}

@Controller()
export class UsersController {
    constructor(
        private readonly usuarioDao: UsuarioDao,
        private readonly authService: AuthService,
        private readonly usuariosCQRS: UsuariosCQRS 
    ) {}

    // --- RUTAS DE AUTENTICACIÓN Y REGISTRO ---

    @Get('register')
    @Render('register')
    showRegisterForm() {
        return { title: 'Registro de Usuario' };
    }

    // FLUIDO CQRS: REGISTRO (Vista > Controlador > CQRS > DAO)
    @Post('register')
    @UsePipes(new ValidationPipe({ transform: true })) // Aplicar validación DTO
    async register(@Body() registerData: RegisterDto, @Res() res: any) { // Usamos el DTO de Registro
        try {
            await this.usuariosCQRS.insert(registerData); // Despacha el comando de registro
            return res.redirect('/login'); 
        } catch (error) {
            // Manejar error de validación o DB (ej: email ya existe)
            return res.render('register', { errorMessage: error.message || 'Error al registrar.' }); 
        }
    }
    
    @Get('PrincipalDashboard')
    @Render('PrincipalDashboard')
    showWelcomePage() { 
        return { message: '¡Bienvenido!' };
    }
    
    @Get('login')
    @Render('login')
    async showLoginForm() {
        return { errorMessage: null };
    }

    @Post('login')
    async login(@Body() userData: any, @Res() res: any) {
        const user = await this.authService.validateUser(userData.email, userData.password);

        if (user) {
            const result = await this.authService.login(user);

            res.cookie('jwt', result.access_token, { 
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 3600000
            });

            return res.redirect('/PrincipalDashboard'); 
        } else {
            return res.render('login', { errorMessage: 'Credenciales inválidas.' });
        }
    }

    // --- RUTAS PROTEGIDAS CON IDENTIDAD DINÁMICA ---

    // Consulta: Pasa por Vista > Controlador > DAO (sin cambios)
    @UseGuards(AuthGuard('jwt')) 
    @Get('dashboard/usuarios') 
    @Render('dashboard/usuarios')
    async listUsers() {
        const users = await this.usuarioDao.findAll(); 
        return { 
            viewTitle: 'Administración de Usuarios', 
            isUsersView: true, 
            users: users 
        }; 
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('dashboard/perfil')
    @Render('dashboard/perfil')
    showProfile(@User() user: JwtPayload) { 
        // AQUÍ SE BUSCAN LOS DATOS REALES DE PERFIL 
       
        return { 
            viewTitle: 'Configuración de Perfil y Contraseña',
            isProfileView: true,
            user: user
        }; 
    }

    @Get('dashboard/search-users')
    @Render('dashboard/search-users')
    async searchUsers(@Body() searchData: any) {
        // Consulta: Pasa por Vista > Controlador > DAO (sin cambios)
        const users = await this.usuarioDao.findAll(); 
        return { 
            viewTitle: 'Buscar Usuarios', 
            isSearchUsersView: true, 
            users: users 
        }; 
    }

    // FLUIDO CQRS: ACTUALIZACIÓN (Vista > Controlador > CQRS > DAO)
    @UseGuards(AuthGuard('jwt'))
    @Post('dashboard/perfil/update-password')
    @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }))
    async updatePassword(
        @Body() updateData: UpdateProfileDto, // DTO con Nombre, Email, y Contraseña(s)
        @Res() res: any, 
        @User() user: JwtPayload
    ) {
        try {
            // Despachamos el comando de actualización, pasando el ID de la sesión y todos los datos del DTO
            await this.usuariosCQRS.update(user.id, updateData); 
            
            // Usamos los datos actualizados para el renderizado
            const updatedUser = { nombre: updateData.nombre || user.nombre, email: updateData.email || user.email };

            return res.render('dashboard/perfil', {
                viewTitle: 'Configuración de Perfil y Contraseña',
                isProfileView: true,
                user: updatedUser, 
                successMessage: 'Perfil y/o contraseña actualizados exitosamente.'
            });
            
        } catch (error) {
            // Manejamos el error
            return res.render('dashboard/perfil', {
                viewTitle: 'Configuración de Perfil y Contraseña',
                isProfileView: true,
                user: { nombre: user.nombre, email: user.email },
                errorMessage: error.message || 'Error al actualizar el perfil.'
            });
        }
    }
}
