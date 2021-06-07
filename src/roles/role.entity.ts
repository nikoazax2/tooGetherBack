import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { RoleEnum } from './role.enum';

@Entity()
export class Role {
  constructor(name: RoleEnum) {
    this.name = name;
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
  })
  name: string;
}
