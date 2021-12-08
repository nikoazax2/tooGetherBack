import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/user.entity';
import { CustomBaseEntity } from '../../custom-base-entity';
import { Activity } from 'src/activities/entities/activity.entity';

@Entity()
export class Chat extends CustomBaseEntity {
  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'userId' })
  userId: User;

  @ManyToOne(() => Activity, { nullable: false })
  @JoinColumn({ name: 'activityId' })
  activityId: Activity;

  @Column()
  message: string;

  @Column()
  date: string;
}
