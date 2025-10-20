import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RegisterUserCommand } from '../commands/register.user.command';
import { AuthService } from 'src/auth/auth.service';

@CommandHandler(RegisterUserCommand)
export class RegisterUserHandler implements ICommandHandler<RegisterUserCommand> {
    constructor(private readonly authService: AuthService) {}

    async execute(command: RegisterUserCommand): Promise<any> {
        const { nombre, email, password } = command.registerData;

        // La lógica de hasheo y guardado está en AuthService (DAO)
        return this.authService.registerUser(nombre, email, password);
    }
}
