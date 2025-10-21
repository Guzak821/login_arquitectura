import { IsOptional, IsString, Length, IsNotEmpty, IsEmail } from 'class-validator';
import { Match } from 'src/common/validators/match.validator';

/**
 * DTO COMPLETO para la actualización de perfil y contraseña.
 * Incluye campos opcionales para la actualización de datos y los campos de contraseña para la validación.
 */
export class UpdateProfileDto {
    // --- DATOS DE PERFIL ---
    @IsOptional()
    @IsString({ message: 'El nombre debe ser una cadena de texto.' })
    @Length(1, 30, { message: 'El nombre debe contener un máximo de 30 caracteres.' })
    nombre?: string;

    @IsOptional()
    @IsEmail({}, { message: 'Formato de correo electrónico inválido.' })
    email?: string;

    // --- DATOS DE CONTRASEÑA (Para el flujo de cambio) ---
    // NOTA: Estos campos son opcionales, pero si alguno se envía, se valida el resto.

    // 1. Contraseña Actual (obligatoria si se cambia la contraseña)
    @IsOptional() 
    @IsString()
    current_pass?: string;

    // 2. Nueva Contraseña
    @IsOptional()
    @IsString()
    @Length(6, 50, { message: 'La nueva contraseña debe tener un mínimo de 6 caracteres.' }) 
    new_pass?: string;

    // 3. Confirmación de Nueva Contraseña
    @IsOptional()
    @IsString()
    // ⚠️ CLAVE: Valida que coincida con new_pass
    @Match('new_pass', {
        message: 'La nueva contraseña y su confirmación deben ser iguales.',
    })
    confirm_pass?: string;
}
