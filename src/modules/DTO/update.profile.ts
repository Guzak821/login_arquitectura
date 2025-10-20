// src/modules/users/dtos/update-profile.dto.ts

import { IsOptional, IsString, Length, IsNotEmpty, IsEmail } from 'class-validator';

/**
 * DTO para la actualización del perfil.
 * Contiene validaciones para el nombre de usuario y un campo de contraseña opcional.
 */
export class UpdateProfileDto {
    // El nombre es opcional si el usuario solo quiere cambiar la contraseña, pero si se envía, se valida.
    @IsOptional()
    @IsString({ message: 'El nombre debe ser una cadena de texto.' })
    @Length(1, 30, { message: 'El nombre debe contener un máximo de 30 caracteres.' }) // Máximo 30 caracteres
    nombre?: string;

    // La contraseña en este DTO es opcional si solo se actualiza el nombre, 
    // pero si se envía, debe cumplir con el mínimo de 6 caracteres.
    @IsOptional()
    @IsString({ message: 'La contraseña debe ser una cadena de texto.' })
    @Length(6, 50, { message: 'La contraseña debe tener un mínimo de 6 caracteres.' }) // Mínimo 6 caracteres
    password?: string;

    // Si quieres permitir la actualización del email:
    @IsOptional()
    @IsEmail({}, { message: 'Formato de correo electrónico inválido.' })
    email?: string;
}