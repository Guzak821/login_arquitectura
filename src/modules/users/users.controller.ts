import { Controller, Get, Post, Render, Body, Res, UsePipes, ValidationPipe } from '@nestjs/common';
import { UsersService } from './users.service'; // Inyección del Modelo
import { UsuarioDao } from './DAO/UsuarioDao';
import { AuthService } from 'src/auth/auth.service';
import { UpdatePasswordDto } from 'src/modules/DTO/UpdatePasswordDto';


@Controller() // Controlador principal
export class UsersController {
  constructor(
    private readonly usuarioDao: UsuarioDao,
    private readonly authService: AuthService
  ) {}

  // **VISTA de Registro (GET /register)**
  @Get('register')
  @Render('register')
  showRegisterForm() {
    return { title: 'Registro de Usuario' };
  }

  // **Lógica de Registro (POST /register)**
  @Post('register')
  async register(@Body() userData: any, @Res() res: any) {
    await this.authService.registerUser(userData.nombre, userData.email, userData.password); 
    return res.redirect('/login'); 
  }

  // VISTA de Bienvenida (GET /PrincipalDashboard)
  @Get('PrincipalDashboard')
  @Render('PrincipalDashboard')
  showWelcomePage() { 
    return { message: '¡Bienvenido!' };
  }
  
  // **VISTA de Login (GET /login)**
  @Get('login')
  @Render('login')
  showLoginForm() {
    return { errorMessage: null };
  }

  // **Lógica de Login (POST /login)**
  @Post('login')
  async login(@Body() userData: any, @Res() res: any) {
    // La validación es responsabilidad de AuthService
    const user = await this.authService.validateUser(userData.email, userData.password);

    if (user) {
      return res.redirect('/PrincipalDashboard'); 
    } else {
      return res.render('login', { errorMessage: 'Credenciales inválidas.' });
    }
  }

// VISTA de Usuarios (GET /dashboard/usuarios)
@Get('dashboard/usuarios') 
@Render('dashboard/usuarios')
async listUsers() {
    // Usamos el DAO para operaciones CRUD directas
    const users = await this.usuarioDao.findAll(); 
    return { 
        viewTitle: 'Administración de Usuarios', 
        isUsersView: true, 
        users: users 
    }; 
}

  // VISTA de Perfil (GET /dashboard/perfil)
@Get('dashboard/perfil')
@Render('dashboard/perfil')
showProfile() {
  return { 
    viewTitle: 'Configuración de Perfil y Contraseña',
    isProfileView: true,
    user: { name: 'Usuario Actual', email: 'email@ejemplo.com' }
  }; 
}

// Metodo buscar usuarios
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

  // Metodo para actualizar la contraseña
@Post('dashboard/perfil/update-password')
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
async updatePassword(@Body() updatePasswordDto: UpdatePasswordDto, @Res() res: any) {
    const { current_pass, new_pass } = updatePasswordDto;

    const userId = 1; // ID Fijo solo para prueba
    const userName = 'User1'; // Nombre Fijo solo para prueba
    const userEmail = '1@gmail.com'; // Email Fijo solo para prueba
    
    try {
        // Delegamos la verificación y actualización a AuthService
        const success = await this.authService.updatePassword(userId, userEmail, current_pass, new_pass);
        
        // Si el servicio retorna true (o si no lanza una excepción)
        return res.render('dashboard/perfil', {
            viewTitle: 'Configuración de Perfil y Contraseña',
            isProfileView: true,
            user: { name: 'Usuario Actual', email: userEmail },
            successMessage: 'Contraseña actualizada exitosamente.'
        });
        
    } catch (error) {
        // Capturamos el error de contraseña incorrecta (o cualquier otro del servicio)
        return res.render('dashboard/perfil', {
            viewTitle: 'Configuración de Perfil y Contraseña',
            isProfileView: true,
            user: { name: 'Usuario Actual', email: userEmail },
            errorMessage: error.message || 'Error desconocido al actualizar la contraseña.'
        });
    }
  }
}