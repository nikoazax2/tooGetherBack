import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { UserRegisterPayload } from '../auth/payload/user-register.payload';
import { Role } from '../roles/role.entity';
import { RoleEnum } from '../roles/role.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private users: Repository<User>,
    @InjectRepository(Role)
    private roles: Repository<Role>,
  ) {}

  async getAll(email) {
    return await this.users.find({ where: { email }, relations: ['roles'] });
  }

  async getByEmail(email: string): Promise<User | undefined> {
    return this.users.findOne({
      where: { email: email },
      relations: ['roles'],
    });
  }

  async testmail(email: string) {
    return await this.users.find({
      where: { email },
      relations: ['roles'],
    });
  }

  async getById(id: string): Promise<User | undefined> {
    return await this.users.findOne({
      where: { id: id },
      relations: ['roles'],
    });
  }

  async register(payload: UserRegisterPayload) {
    if (
      payload.email === '' ||
      payload.surname === '' ||
      payload.password === '' ||
      payload.avatar === ''
    ) {
      throw new BadRequestException('Missing information');
    }
    let user = await this.getByEmail(payload.email);
    if (user) {
      throw new ConflictException();
    }

    let { password, ...payloadWithoutPass } = payload;

    // Hash the password
    const salt = await bcrypt.genSalt();
    const passHash = await bcrypt.hash(password, salt);

    // Set default role
    let role: Role = await this.roles.findOne({
      name: RoleEnum.User,
    });

    // Get number of users
    if ((await this.users.find()).length === 0) {
      // Set admin
      role = await this.roles.findOne({
        name: RoleEnum.Admin,
      });
    }

    return await this.users.save({
      ...payloadWithoutPass,
      password: passHash,
      roles: [role],
    });
  }
}
