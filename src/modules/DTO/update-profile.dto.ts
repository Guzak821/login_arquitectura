import { IsOptional, IsString, Length, IsEmail } from 'class-validator';

/**
 * DTO para la actualización de perfil (nombre y email).
 * Nota: Los campos de contraseña no están aquí, ya que la ruta externa de actualización 
 * asume que solo se actualiza el perfil, o la lógica de contraseña se maneja por separado.
 */
export class UpdateProfileDto {
    
    // Opcional, pero si se envía, debe cumplir con la longitud máxima de 30 caracteres.
    @IsOptional()
    @IsString({ message: 'El nombre debe ser una cadena de texto.' })
    @Length(1, 30, { message: 'El nombre debe contener un máximo de 30 caracteres.' })
    nombre?: string;

    // Email: Opcional, pero si se envía, debe ser un formato válido.
    @IsOptional()
    @IsEmail({}, { message: 'Formato de correo electrónico inválido.' })
    email?: string;
    
  
     @IsOptional()
     @IsString()
     @Length(6, 50, { message: 'La nueva contraseña debe tener un mínimo de 6 caracteres.' })
    password?: string;
}
