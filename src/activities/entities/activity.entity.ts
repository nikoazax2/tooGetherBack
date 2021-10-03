import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/user.entity';
import { CustomBaseEntity } from '../../custom-base-entity';

@Entity()
export class Activity extends CustomBaseEntity {
  @ManyToMany(() => User)
  @JoinTable()
  participants: User[];

  @ManyToOne(() => User)
  @JoinTable()
  creator: User;

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  lieux: string;

  @Column()
  date: string;

  @Column()
  description: string;
}
