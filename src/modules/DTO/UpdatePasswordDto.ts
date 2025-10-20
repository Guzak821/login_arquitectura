// src/dtos/update-password.dto.ts

import { IsNotEmpty, IsString, Length } from 'class-validator'; 

export class UpdatePasswordDto {
  
  @IsString()
  @IsNotEmpty()
  current_pass: string; // Recibe el campo 'name="current_pass"' del HTML

  @IsString()
  @Length(6, 30) 
  new_pass: string; // Recibe el campo 'name="new_pass"'

  @IsString()
  @IsNotEmpty()
  confirm_pass: string; // Recibe el campo 'name="confirm_pass"'
}