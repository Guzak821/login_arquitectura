import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

/**
 * DTO para la creación de nuevos usuarios (Registro).
 * Implementa las validaciones de negocio solicitadas.
 */
export class RegisterDto {
    @IsNotEmpty({ message: 'El nombre es obligatorio.' })
    @IsString({ message: 'El nombre debe ser una cadena de texto.' })
    @Length(1, 30, { message: 'El nombre debe contener un máximo de 30 caracteres.' }) // Validación de máximo 30 caracteres
    nombre: string;

    @IsNotEmpty({ message: 'El correo electrónico es obligatorio.' })
    @IsEmail({}, { message: 'Formato de correo electrónico inválido.' })
    email: string;

    @IsNotEmpty({ message: 'La contraseña es obligatoria.' })
    @IsString({ message: 'La contraseña debe ser una cadena de texto.' })
    @Length(6, 50, { message: 'La contraseña debe tener un mínimo de 6 caracteres.' }) // Validación de mínimo 6 caracteres
    password: string;
}
