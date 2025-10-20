import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { UsuarioDao } from './DAO/UsuarioDao';
// Se eliminan 'Repository', 'InjectRepository', y 'bcrypt'

@Injectable()
export class UsersService {
    // Solo inyecta el DAO.
    constructor(private usuarioDao: UsuarioDao) {}

    async createUser(nombre: string, email: string, password: string): Promise<User> {
    
        return this.usuarioDao.createUser(nombre, email, password); 
    }
    
    // Solo usa el DAO para obtener datos
    async findAll(): Promise<Omit<User, 'password'>[]> {
        return this.usuarioDao.findAll();
    }
  }