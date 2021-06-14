import { Transform } from 'class-transformer';
import { Entity, Column, JoinTable, ManyToMany } from 'typeorm';
import { CustomBaseEntity } from '../custom-base-entity';
import { Role } from '../roles/role.entity';
import { RoleEnum } from '../roles/role.enum';

@Entity()
export class User extends CustomBaseEntity {
  @Column({ unique: true })
  email: string;

  @Column()
  surname: string;

  @Column()
  readonly password: string;

  @ManyToMany(() => Role, { cascade: ['remove'] })
  @JoinTable()
  @Transform((user) => {
    const rolesName: string[] = [];
    for (let i = 0; i < user.value.length; i++) {
      rolesName.push(user.value[i].name);
    }
    return rolesName;
  })
  roles: Role[];

  public getJSON() {
    let { password, ...modifiedUser } = this;

    return {
      ...modifiedUser,
      roles: this.getRolesName(),
    };
  }

  private getRolesName(): string[] {
    const roleNames: string[] = [];
    if (this.roles) {
      for (let i = 0; i < this.roles.length; i++) {
        roleNames.push(this.roles[i].name.toLowerCase());
      }
    }
    return roleNames;
  }
}
