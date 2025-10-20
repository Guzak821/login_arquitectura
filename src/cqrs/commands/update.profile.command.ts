import { UpdateProfileDto } from 'src/modules/DTO/update.profile';

export class UpdateProfileCommand {
    constructor(
        // El ID del usuario actual debe venir de la sesión/token
        public readonly userId: number, 
        public readonly updateData: UpdateProfileDto,
    ) {}
}
