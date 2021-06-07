import {
  Entity,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class CustomBaseEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  creation: Date;

  @UpdateDateColumn()
  modification: Date;
}
