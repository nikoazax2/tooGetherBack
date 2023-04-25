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
    @PrimaryGeneratedColumn('uuid')
    uuid: string;

    @ManyToMany(() => User, {
        onDelete: 'CASCADE',
    })
    @JoinTable()
    users: User[];

    @Column()
    creatorId: string;


    @Column()
    name: string;

    @Column()
    lieux: string;

    @Column()
    coordlieux: string;

    @Column()
    lat: string;

    @Column()
    lng: string;

    @Column()
    date: string;

    @Column()
    description: string;

    @Column()
    emoji: string;

    @Column()
    nbMax: string;
}
