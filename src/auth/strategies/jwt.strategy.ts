import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
// Si necesitas acceder a la DB para verificar el ID, inyecta el UsersService aquí.
// import { UsersService } from 'src/modules/users/users.service'; 

// Función auxiliar para extraer el token de la cookie
const cookieExtractor = (req: Request) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies['jwt']; // 'jwt' debe coincidir con el nombre de la cookie guardada en el login
  }
  return token;
};

// Interfaz del payload que se espera del token JWT
interface JwtPayload {
  id: number;
  email: string;
  nombre: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    // Si necesitas acceder a la DB, inyecta aquí tu servicio o DAO:
    // private userService: UsersService 
  ) {
    super({
      // ✅ CLAVE: Usa el extractor de cookies
      jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
      ignoreExpiration: false,
      // ⚠️ Reemplaza con tu CLAVE SECRETA (la misma que usaste en JwtModule)
      secretOrKey: 'hola12345', 
    });
  }

  // Método que se ejecuta después de que el token es verificado y válido
  async validate(payload: JwtPayload) {
    // 1. Opcional: Busca el usuario en la DB para asegurarse de que aún existe (mejor seguridad)

    // 2. Devuelve el payload que se inyectará en req.user (y que el decorador @User() leerá)
    return { id: payload.id, email: payload.email, nombre: payload.nombre };
  }
}
