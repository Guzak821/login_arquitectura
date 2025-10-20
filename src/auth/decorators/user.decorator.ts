import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

/**
 * Decorador personalizado para extraer el objeto 'user' del request.
 * Este objeto 'user' es adjuntado al request por Passport/JWT Strategy
 * después de una autenticación exitosa.
 * * Uso:
 * @UseGuards(AuthGuard('jwt'))
 * @Get('perfil')
 * getProfile(@User() user: { id: number, email: string }) { ... }
 */
export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest() as Request;
    
    // El objeto 'user' es inyectado por Passport/JWT Strategy.
    // Usamos 'data' (si se proporciona) para extraer una propiedad específica, 
    // o devolvemos todo el objeto 'user'.
    const user = (request as any).user;

    // Si el decorador se usa como @User('email'), extrae solo el email.
    if (data) {
        return user ? user[data as keyof typeof user] : undefined;
    }
    
    return user;
  },
);
