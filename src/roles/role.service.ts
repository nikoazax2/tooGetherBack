import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './role.entity';
import { Repository } from 'typeorm';
import { RoleEnum } from './role.enum';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roles: Repository<Role>,
  ) {}

  async seed() {
    for (const roleName in RoleEnum) {
      const role = await this.roles.findOne({ name: roleName });
      if (!role) {
        await this.roles.save({ name: roleName });
      }
    }
  }
}
