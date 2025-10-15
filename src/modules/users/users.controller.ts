import { Controller, Get, Post, Render, Body, Res } from '@nestjs/common';
import { UsersService } from './users.service'; // Inyección del Modelo

@Controller() // Controlador principal
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // **VISTA de Registro (GET /register)**
  @Get('register')
  @Render('register') // NestJS sabe que debe buscar 'register.hbs' en 'views/'
  showRegisterForm() {
    return { title: 'Registro de Usuario' }; // Datos que pasas a la plantilla
  }

  // **Lógica de Registro (POST /register)**
  @Post('register')
  async register(@Body() userData: any, @Res() res: any) {
    await this.usersService.createUser(userData.email, userData.password); 
    // Después de registrar, redirige al Login
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
    return { errorMessage: null }; // Inicialmente sin error
  }

  // **Lógica de Login (POST /login)**
  @Post('login')
  async login(@Body() userData: any, @Res() res: any) {
    const user = await this.usersService.validateUser(userData.email, userData.password);

    if (user) {
      // Éxito: Redirigir a una página de bienvenida (por ejemplo)
      return res.redirect('/PrincipalDashboard'); 
    } else {
      // Fallo: Mostrar la vista de login con un mensaje de error
      return res.render('login', { errorMessage: 'Credenciales inválidas.' });
    }
  }

// VISTA de Usuarios (GET /dashboard/usuarios)
@Get('dashboard/usuarios') 
@Render('dashboard/usuarios') // Renderiza el layout principal
async listUsers() {
    const users = await this.usersService.findAll();
    return { 
        viewTitle: 'Administración de Usuarios', // Para el H1 del header
        isUsersView: true,                       // Activa el bloque {{#if isUsersView}}
        users: users                             // Pasa la data para la tabla
    }; 
}

  // VISTA de Perfil (GET /dashboard/perfil)
@Get('dashboard/perfil')
@Render('dashboard/perfil')
showProfile() {
  return { 
    viewTitle: 'Configuración de Perfil y Contraseña', // Título grande del encabezado
    isProfileView: true,                             // Habilita el bloque de código del perfil
    user: { name: 'Usuario Actual', email: 'email@ejemplo.com' } // Datos de ejemplo para los inputs
  }; 
}

// Metodo buscar usuarios
@Get('dashboard/search-users')
@Render('dashboard/search-users')
async searchUsers(@Body() searchData: any) {
    const users = await this.usersService.findAll(); 
    return { 
        viewTitle: 'Buscar Usuarios', 
        isSearchUsersView: true, 
        users: users 
    }; 
  }
}