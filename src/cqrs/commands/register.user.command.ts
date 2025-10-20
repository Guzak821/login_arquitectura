import { RegisterDto } from 'src/modules/DTO/register.dto';

export class RegisterUserCommand {
    constructor(
        // Recibe todos los datos necesarios para el registro
        public readonly registerData: RegisterDto,
    ) {}
}
