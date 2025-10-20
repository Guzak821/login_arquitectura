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
import type { Request } from 'express'; 
import { UpdatePasswordDto } from 'src/modules/DTO/UpdatePasswordDto';
import { UsuarioDao } from './DAO/UsuarioDao';
import { AuthService } from 'src/auth/auth.service';
import { AuthGuard } from '@nestjs/passport'; 
import { User } from 'src/auth/decorators/user.decorator'; 
import { UsersService } from './users.service';
import { IsNotEmpty, IsString, Length, IsDefined } from 'class-validator';


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
        private readonly authService: AuthService
    ) {}

    // --- RUTAS DE AUTENTICACIÓN Y REGISTRO ---

    @Get('register')
    @Render('register')
    showRegisterForm() {
        return { title: 'Registro de Usuario' };
    }

    @Post('register')
    async register(@Body() userData: any, @Res() res: any) {
        await this.authService.registerUser(userData.nombre, userData.email, userData.password); 
        return res.redirect('/login'); 
    }
    
    @Get('PrincipalDashboard')
    @Render('PrincipalDashboard')
    showWelcomePage() { 
        return { message: '¡Bienvenido!' };
    }
    
    @Get('login')
    @Render('login')
    showLoginForm() {
        return { errorMessage: null };
    }

    @Post('login')
    async login(@Body() userData: any, @Res() res: any) {
        // 1. Validar las credenciales
        const user = await this.authService.validateUser(userData.email, userData.password);

        if (user) {
            // CLAVE: 2. Generar el token y la respuesta de login
            const result = await this.authService.login(user);

            // CLAVE: 3. Guardar el token en la cookie ANTES de redirigir
            res.cookie('jwt', result.access_token, { 
                httpOnly: true, // Seguridad: previene ataques XSS desde JavaScript
                secure: process.env.NODE_ENV === 'production', // Solo en HTTPS
                maxAge: 3600000 // 1 hora de validez (debe coincidir con la configuración de JwtModule)
            });

            // 4. Redirigir
            return res.redirect('/PrincipalDashboard'); 
        } else {
            return res.render('login', { errorMessage: 'Credenciales inválidas.' });
        }
    }

    // --- RUTAS PROTEGIDAS CON IDENTIDAD DINÁMICA ---

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
        return { 
            viewTitle: 'Configuración de Contraseña',
            isProfileView: true,
            user: user
        }; 
    }

    @Get('dashboard/search-users')
    @Render('dashboard/search-users')
    async searchUsers(@Body() searchData: any) {
        const users = await this.usuarioDao.findAll(); 
        return { 
            viewTitle: 'Buscar Usuarios', 
            isSearchUsersView: true, 
            users: users 
        }; 
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('dashboard/perfil/update-password')
    @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    async updatePassword(
        @Body() updatePasswordDto: UpdatePasswordDto, 
        @Res() res: any, 
        @User() user: JwtPayload
    ) {
        const { current_pass, new_pass } = updatePasswordDto;
        
        try {
            await this.authService.updatePassword(user.id, user.email, current_pass, new_pass);
            
            return res.render('dashboard/perfil', {
                viewTitle: 'Configuración de Contraseña',
                isProfileView: true,
                user: { nombre: user.nombre, email: user.email },
                successMessage: 'Contraseña actualizada exitosamente.'
            });
            
        } catch (error) {
            return res.render('dashboard/perfil', {
                viewTitle: 'Configuración de Contraseña',
                isProfileView: true,
                user: { nombre: user.nombre, email: user.email },
                errorMessage: error.message || 'Error desconocido al actualizar la contraseña.'
            });
        }
    }
}
