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

  // VISTA de Bienvenida (GET /welcome)
  @Get('welcome')
  @Render('welcome')
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
      return res.redirect('/welcome'); 
    } else {
      // Fallo: Mostrar la vista de login con un mensaje de error
      return res.render('login', { errorMessage: 'Credenciales inválidas.' });
    }
  }
}