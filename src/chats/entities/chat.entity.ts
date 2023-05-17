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
    @PrimaryGeneratedColumn('uuid')
    uuid: string;
    
    @ManyToOne(() => User, { nullable: false })
    @JoinColumn({ name: 'userUuid' })
    userUuid: User;

    @ManyToOne(() => Activity)

    @JoinColumn({ name: 'activityUuid' })
    activityUuid: Activity;

    @Column({ name: 'userUuid2' })
    userUuid2: string;

    @Column()
    message: string;

    @Column()
    date: string;
}
