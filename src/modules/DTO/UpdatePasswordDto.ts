// src/dtos/UpdatePasswordDto.ts

import { IsNotEmpty, IsString, Length, Matches, IsDefined } from 'class-validator';
import { Match } from 'src/common/validators/match.validator'; 
export class UpdatePasswordDto {
  
  @IsDefined()
  @IsString()
@IsNotEmpty({ message: 'La contraseña actual es requerida.' })
  current_pass: string; // Recibe el campo 'name="current_pass"' del HTML

  @IsDefined()
  @IsString()
@Length(6, 30, { message: 'La nueva contraseña debe tener entre 6 y 30 caracteres.' })
  new_pass: string; // Recibe el campo 'name="new_pass"'

  @IsDefined()
  @IsString()
@IsNotEmpty({ message: 'La confirmación de contraseña es requerida.' })
  // Aplicamos la validación de coincidencia contra 'new_pass'
  @Match('new_pass', {
    message: 'La nueva contraseña y su confirmación deben ser iguales.',
  })  confirm_pass: string; // Recibe el campo 'name="confirm_pass"'
}