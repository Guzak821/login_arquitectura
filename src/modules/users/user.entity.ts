// src/modules/users/user.entity.ts

import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('user') // Nombre de la tabla
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;
  
  @Column({ unique: true }) // El correo es único y será el "usuario"
  email: string;

@Column({ select: false })
  password: string; 
}