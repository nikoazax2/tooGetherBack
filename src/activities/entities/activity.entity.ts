import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import { CustomBaseEntity } from '../../custom-base-entity';
import { User } from '../../users/user.entity';

@Entity()
export class Activity extends CustomBaseEntity {
  @ManyToMany(() => User)
  @JoinTable()
  participants: User[];

  @Column()
  name: string;

  @Column()
  description: string;
}
