// src/viewmodel/usr-insert-externo.viewmodel.ts

import { IsNotEmpty, IsString, Length, IsEmail, Matches, IsDefined } from 'class-validator';
import { Match } from '../common/validators/match.validator';
/**
 * ViewModel para la inserción y actualización de usuarios desde una fuente externa (API).
 * Este es el CONTRATO de datos para el cliente externo.
 */
export class UsrInsertExternoViewModel {
    
    @IsDefined()
    @IsEmail({}, { message: 'Formato de correo electrónico inválido.' })
    Usr: string;

    @IsDefined()
    @IsString()
    @Length(6, 50, { message: 'La contraseña debe tener un mínimo de 6 caracteres.' })
    Pss: string; // Pss    
    
    @IsDefined()
    @IsString()
    @Length(6, 50, { message: 'La confirmación debe tener un mínimo de 6 caracteres.' })
    @Match('Pss', {
        message: 'La contraseña y su confirmación deben coincidir.',
    })
    PssConfirmacion: string;
}
    