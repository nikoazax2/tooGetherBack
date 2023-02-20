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
  @ManyToMany(() => User, {
    onDelete: 'CASCADE',
  })
  @JoinTable()
  users: User[];

  @Column()
  creatorId: string;

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  uuid: string;

  @Column()
  name: string;

  @Column()
  lieux: string;

  @Column()
  coordlieux: string;

  @Column()
  date: string;

  @Column()
  description: string;

  @Column()
  emoji: string;

  @Column()
  nbMax: string;
}
