// src/modules/users/users.service.ts

import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm'; 
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';


@Injectable()
export class UsersService {
    constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    ) {}

  async createUser(email: string, password: string): Promise<User> {
    // 1. Verificar si el usuario ya existe... (omito el código aquí)
    
    // 🔑 CLAVE: Usar .create() para que TypeORM maneje el 'id'
    const newUser = this.usersRepository.create({ email, password }); 
    
    // El método .save() devuelve la entidad con el 'id' generado
    return this.usersRepository.save(newUser); 
}

  /**
   * Busca un usuario por correo y verifica la contraseña.
   * @param email El correo a buscar.
   * @param password La contraseña a validar.
   * @returns El objeto de usuario si la validación es exitosa, de lo contrario null.
   */
    async validateUser(email: string, password_input: string): Promise<User | null> {
    const user = await this.usersRepository.findOneBy({ email });

    if (!user) {
      return null; // Usuario no encontrado
    }

    // const isMatch = await bcrypt.compare(password_input, user.password_hash);
    
    // Simulación simple:
    if (user.password === password_input) {
      return user; // Éxito: Contraseña coincide
    }
    
    return null; // Contraseña incorrecta
  }
}