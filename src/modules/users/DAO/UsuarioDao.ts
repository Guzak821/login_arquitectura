// src/daos/UsuarioDao.ts

import { Repository } from 'typeorm';
import { User } from '../user.entity'; 
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common'; 

@Injectable() 
export class UsuarioDao {

    // Inyectamos el Repository de TypeORM en el constructor
    constructor(
        @InjectRepository(User) 
        private userRepository: Repository<User>,
    ) {}
     
    // MÉTODOS PARA LA VISTA DE PERFIL

    async findById(id: number): Promise<User | null> {
        // Usa la propiedad userRepository inyectada
        const user = await this.userRepository.findOne({ 
            where: { id },
            select: ['id', 'nombre', 'email'] // Excluye la contraseña
        });
        
        return user || null;
    }


   async updateUserPassword(id: number, hashedPassword: string): Promise<boolean> {
        // 1. Encontrar el usuario para TypeORM.save
        const user = await this.userRepository.findOne({ where: { id } });

        if (!user) {
            return false;
        }

        user.password = hashedPassword; // Asigna el nuevo hash
        
        // 2. USAMOS .save() para asegurar la persistencia
        await this.userRepository.save(user); 
        
        return true;
    }

    async findByEmailWithPassword(email: string): Promise<User | null> {
        const user = await this.userRepository.findOne({ 
            where: { email },
            //  CLAVE: Incluir la contraseña explícitamente para el login/verificación
            select: ['id', 'nombre', 'email', 'password'] 
        });
        return user || null;
    }


    // MÉTODOS PARA LA VISTA DE USUARIOS (Listar y Buscar)

    async findAll(): Promise<User[]> {
        return await this.userRepository.find({ 
            select: ['id', 'nombre', 'email'] // Excluye la contraseña
        });
    }

    async findByQuery(query: string): Promise<User[]> {
        // Usamos la propiedad userRepository inyectada
        return await this.userRepository.createQueryBuilder("user")
            .select(["user.id", "user.nombre", "user.email"])
            .where("user.nombre LIKE :searchQuery", { searchQuery: `%${query}%` })
            .orWhere("user.email LIKE :searchQuery", { searchQuery: `%${query}%` })
            .getMany();
    }

    // MÉTODOS PARA REGISTRO Y LOGIN
    async createUser(nombre:string, email: string, password: string): Promise<User> {
        const newUser = this.userRepository.create({ nombre, email, password }); 
        return this.userRepository.save(newUser); 
    }

    async saveEntity(user: User): Promise<User> {
        return this.userRepository.save(user);
    }
}